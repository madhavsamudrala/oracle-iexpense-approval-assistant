/**
 * Oracle iExpense Approval Assistant - Rules Engine
 * Version: 1.0
 * 
 * This module implements Oracle AME (Approval Management Engine) business rules
 * for determining expense report approval chains across three Operating Units:
 * - CCP (OU 101)
 * - CCH (OU 102)
 * - CCF (OU 121)
 * 
 * All rules are embedded client-side for zero backend dependencies.
 */

// ============================================================================
// CONFIGURATION DATA STRUCTURES
// ============================================================================

/**
 * Operating Units Configuration
 */
const OPERATING_UNITS = {
  CCP: {
    id: 101,
    name: 'CCP',
    displayName: 'CCP (OU 101)',
    templates: [
      'CCP Tuition Expenses',
      'CCP Non-Travel Expenses',
      'CCP Travel Expenses-Other',
      'CCP Local Mileage Expense'
    ],
    requiresGrantFund: false
  },
  CCH: {
    id: 102,
    name: 'CCH',
    displayName: 'CCH (OU 102)',
    templates: [
      'CCH Non-Travel Expenses',
      'CCH Travel Expenses',
      'CCH Non-Nursing Tuition',
      'CCH Nursing Tuition'
    ],
    requiresGrantFund: true // Grant fund differentiation required for travel/non-travel
  },
  CCF: {
    id: 121,
    name: 'CCF',
    displayName: 'CCF (OU 121)',
    templates: [
      'CCF Standard Expense'
    ],
    requiresGrantFund: false
  }
};

/**
 * Approver Groups Configuration
 */
const APPROVER_GROUPS = {
  // CCP Approvers
  CCP_DEPT_APPROVER: 'CCP Department Approver',
  CCP_DBMS_APPROVERS: 'CCP DBMS Approvers',
  CCP_CCH_NON_NURSING_TUITION_L1: 'CCP and CCH Non Nursing Tuition Approvers',
  CCP_CCH_NON_NURSING_TUITION_L2: 'CCP and CCH Non Nursing Tuition Approvers L2',
  
  // CCH Approvers
  CCH_FIRST_SUPERIOR: 'First Superior',
  CCH_GRANT_FUND_L1: 'CCH Grant Fund Approvers Level 1',
  CCH_NON_GRANT_FUND_L1: 'CCH Non Grant Fund Approvers Level 1',
  CCH_APPROVERS_GT_5K: 'CCH Approvers Greater Than 5k dollars',
  CCH_NURSING_TUITION_SELF: 'CCH Nursing Tuition Self Approval group',
  
  // CCF Approvers
  CCF_DEPT_APPROVER: 'CCF Department Approver',
  CCF_DAMON_HOWELL: 'Damon Howell',
  
  // System
  SYSADMIN: 'SYSADMIN'
};

/**
 * Special Submitters Configuration
 */
const SPECIAL_SUBMITTERS = {
  KAREN_MARTINO: {
    name: 'Karen Martino',
    aliases: ['karen', 'martino', 'karen martino', 'k martino', 'k. martino'],
    affectedOUs: ['CCP', 'CCH'],
    affectedTemplates: ['tuition']
  },
  MELISSA: {
    name: 'Melissa',
    aliases: ['melissa'],
    affectedOUs: ['CCP', 'CCH'],
    affectedTemplates: ['tuition']
  },
  DAMON_HOWELL: {
    name: 'Damon Howell',
    aliases: ['damon', 'howell', 'damon howell', 'd howell', 'd. howell'],
    affectedOUs: ['CCF'],
    affectedTemplates: ['all']
  }
};

/**
 * Error Messages
 */
const ERROR_MESSAGES = {
  SYSTEM_ERROR: 'Approval information is temporarily unavailable due to a system issue. Please try again later.',
  MISSING_OU: 'Please specify which operating unit: CCP, CCH, or CCF',
  MISSING_TEMPLATE: 'Please select an expense template',
  MISSING_AMOUNT: 'Please enter the total expense amount',
  INVALID_AMOUNT: 'Please enter a valid amount greater than $0',
  MISSING_GRANT_INFO: 'Is this expense charged to a grant fund (42000 or 41235)?',
  UNDEFINED_SCENARIO: 'This expense scenario is not defined in the current approval rules. Please contact your expense administrator for guidance.',
  NO_DEPT_APPROVER: 'Your expense will be routed to SYSADMIN because no department approver is assigned. This is automatic system routing.'
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if a submitter is a special submitter
 * @param {string} submitterName - Name of the submitter
 * @param {Array<string>} specialSubmitterKeys - Keys to check (e.g., ['KAREN_MARTINO', 'MELISSA'])
 * @returns {boolean} True if submitter matches any of the special submitters
 */
function isSpecialSubmitter(submitterName, specialSubmitterKeys) {
  if (!submitterName || !specialSubmitterKeys || specialSubmitterKeys.length === 0) {
    return false;
  }
  
  const normalizedName = submitterName.toLowerCase().trim();
  
  for (const key of specialSubmitterKeys) {
    const submitter = SPECIAL_SUBMITTERS[key];
    if (submitter && submitter.aliases) {
      for (const alias of submitter.aliases) {
        if (normalizedName === alias.toLowerCase()) {
          return true;
        }
      }
    }
  }
  
  return false;
}

/**
 * Normalize template name for matching
 * @param {string} template - Template name
 * @returns {string} Normalized template name
 */
function normalizeTemplate(template) {
  return template ? template.trim() : '';
}

/**
 * Check if template requires grant fund information (CCH only)
 * @param {string} operatingUnit - Operating unit
 * @param {string} template - Template name
 * @returns {boolean} True if grant fund info is required
 */
function requiresGrantFundInfo(operatingUnit, template) {
  if (operatingUnit !== 'CCH') {
    return false;
  }
  
  const normalizedTemplate = normalizeTemplate(template);
  return normalizedTemplate === 'CCH Non-Travel Expenses' || 
         normalizedTemplate === 'CCH Travel Expenses';
}

/**
 * Build approval chain result object
 * @param {Array<string>} approvers - Array of approver group names
 * @param {Object} metadata - Additional metadata
 * @returns {Object} Approval chain result
 */
function buildApprovalChainResult(approvers, metadata = {}) {
  const approvalChain = approvers.map((approver, index) => ({
    sequence: index + 1,
    approverGroup: approver
  }));
  
  return {
    success: true,
    approvalChain: approvalChain,
    metadata: metadata
  };
}

/**
 * Build error result object
 * @param {string} message - Error message
 * @param {string} type - Error type
 * @returns {Object} Error result
 */
function buildErrorResult(message, type = 'error') {
  return {
    success: false,
    error: message,
    type: type
  };
}

/**
 * Build info result object (for missing information prompts)
 * @param {string} message - Info message
 * @returns {Object} Info result
 */
function buildInfoResult(message) {
  return {
    success: false,
    message: message,
    type: 'info'
  };
}

// ============================================================================
// INPUT VALIDATION
// ============================================================================

/**
 * Validate expense input data
 * @param {Object} input - Expense input data
 * @returns {Object} Validation result with errors array
 */
function validateInput(input) {
  const errors = [];
  
  // Required: Operating Unit
  if (!input.operatingUnit) {
    errors.push({
      field: 'operatingUnit',
      message: ERROR_MESSAGES.MISSING_OU
    });
  } else if (!OPERATING_UNITS[input.operatingUnit]) {
    errors.push({
      field: 'operatingUnit',
      message: 'Invalid operating unit. Please select CCP, CCH, or CCF.'
    });
  }
  
  // Required: Template
  if (!input.template) {
    errors.push({
      field: 'template',
      message: ERROR_MESSAGES.MISSING_TEMPLATE
    });
  }
  
  // Required: Amount
  if (input.amount === undefined || input.amount === null || input.amount === '') {
    errors.push({
      field: 'amount',
      message: ERROR_MESSAGES.MISSING_AMOUNT
    });
  } else {
    const amount = parseFloat(input.amount);
    if (isNaN(amount) || amount <= 0) {
      errors.push({
        field: 'amount',
        message: ERROR_MESSAGES.INVALID_AMOUNT
      });
    }
  }
  
  // CCH-specific: Grant Fund (for travel/non-travel templates)
  if (input.operatingUnit === 'CCH' && requiresGrantFundInfo(input.operatingUnit, input.template)) {
    if (input.isGrantFund === undefined || input.isGrantFund === null) {
      errors.push({
        field: 'isGrantFund',
        message: ERROR_MESSAGES.MISSING_GRANT_INFO
      });
    }
  }
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
}

// ============================================================================
// CCP RULES ENGINE (OU 101)
// ============================================================================

/**
 * Evaluate CCP approval rules
 * @param {Object} input - Expense input data
 * @returns {Array<string>|null} Array of approver groups or null if no rule matches
 */
function evaluateCCPRules(input) {
  const { template, amount, submitterName } = input;
  const normalizedTemplate = normalizeTemplate(template);
  
  // Rule CCP-1: Tuition Expenses
  if (normalizedTemplate === 'CCP Tuition Expenses') {
    // Check if submitter is Karen Martino or Melissa (they have different routing)
    if (!isSpecialSubmitter(submitterName, ['KAREN_MARTINO', 'MELISSA'])) {
      return [
        APPROVER_GROUPS.CCP_CCH_NON_NURSING_TUITION_L1,
        APPROVER_GROUPS.CCP_CCH_NON_NURSING_TUITION_L2
      ];
    }
    // If Karen or Melissa, different routing applies (not defined in rules, return null)
    return null;
  }
  
  // Rule CCP-2: Travel and Non-Travel (DBMS Required)
  if (normalizedTemplate === 'CCP Non-Travel Expenses' || 
      normalizedTemplate === 'CCP Travel Expenses-Other') {
    if (amount > 0) {
      return [
        APPROVER_GROUPS.CCP_DEPT_APPROVER,
        APPROVER_GROUPS.CCP_DBMS_APPROVERS
      ];
    }
  }
  
  // Rules CCP-3 & CCP-4: Local Mileage
  if (normalizedTemplate === 'CCP Local Mileage Expense') {
    // Rule CCP-3: Local Mileage ≥ $1,000
    if (amount >= 1000) {
      return [
        APPROVER_GROUPS.CCP_DEPT_APPROVER,
        APPROVER_GROUPS.CCP_DBMS_APPROVERS
      ];
    }
    // Rule CCP-4: Local Mileage < $1,000
    else {
      return [
        APPROVER_GROUPS.CCP_DEPT_APPROVER
      ];
    }
  }
  
  // Rule CCP-5: No Department Approver Found
  // This is handled at the system level, return null to indicate undefined scenario
  return null;
}

// ============================================================================
// CCH RULES ENGINE (OU 102)
// ============================================================================

/**
 * Evaluate CCH approval rules
 * @param {Object} input - Expense input data
 * @returns {Array<string>|null} Array of approver groups or null if no rule matches
 */
function evaluateCCHRules(input) {
  const { template, amount, isGrantFund, submitterName } = input;
  const normalizedTemplate = normalizeTemplate(template);
  
  // Rule CCH-5: Non-Nursing Tuition
  if (normalizedTemplate === 'CCH Non-Nursing Tuition') {
    // Check if submitter is Karen Martino or Melissa (they have different routing)
    if (!isSpecialSubmitter(submitterName, ['KAREN_MARTINO', 'MELISSA'])) {
      return [
        APPROVER_GROUPS.CCP_CCH_NON_NURSING_TUITION_L1,
        APPROVER_GROUPS.CCP_CCH_NON_NURSING_TUITION_L2
      ];
    }
    // If Karen or Melissa, different routing applies (not defined in rules, return null)
    return null;
  }
  
  // Rule CCH-6: Nursing Tuition (Self Approval)
  if (normalizedTemplate === 'CCH Nursing Tuition') {
    return [
      APPROVER_GROUPS.CCH_NURSING_TUITION_SELF
    ];
  }
  
  // Rules CCH-1 through CCH-4: Travel/Non-Travel with Grant Fund differentiation
  if (normalizedTemplate === 'CCH Non-Travel Expenses' || 
      normalizedTemplate === 'CCH Travel Expenses') {
    
    const baseApprovers = [APPROVER_GROUPS.CCH_FIRST_SUPERIOR];
    
    // Check amount threshold: > $5,000 requires additional approver
    if (amount > 5000) {
      baseApprovers.push(APPROVER_GROUPS.CCH_APPROVERS_GT_5K);
    }
    
    // Add final approver based on grant fund status
    if (isGrantFund === true || isGrantFund === 'true') {
      // Rules CCH-1 & CCH-3: Grant Funds
      baseApprovers.push(APPROVER_GROUPS.CCH_GRANT_FUND_L1);
    } else {
      // Rules CCH-2 & CCH-4: Non-Grant Funds
      baseApprovers.push(APPROVER_GROUPS.CCH_NON_GRANT_FUND_L1);
    }
    
    return baseApprovers;
  }
  
  // No matching rule
  return null;
}

// ============================================================================
// CCF RULES ENGINE (OU 121)
// ============================================================================

/**
 * Evaluate CCF approval rules
 * @param {Object} input - Expense input data
 * @returns {Array<string>|null} Array of approver groups or null if no rule matches
 */
function evaluateCCFRules(input) {
  const { amount, submitterName } = input;
  
  // Rule CCF-3: Damon's Own Submissions
  if (isSpecialSubmitter(submitterName, ['DAMON_HOWELL'])) {
    return [
      APPROVER_GROUPS.CCF_DEPT_APPROVER
      // Damon is skipped in his own submissions
    ];
  }
  
  // Rule CCF-1: Standard Expenses < $2,000
  if (amount < 2000) {
    return [
      APPROVER_GROUPS.CCF_DEPT_APPROVER
    ];
  }
  
  // Rule CCF-2: Standard Expenses ≥ $2,000
  if (amount >= 2000) {
    return [
      APPROVER_GROUPS.CCF_DEPT_APPROVER,
      APPROVER_GROUPS.CCF_DAMON_HOWELL
    ];
  }
  
  // Rule CCF-4: No Department Approver Found
  // This is handled at the system level, return null to indicate undefined scenario
  return null;
}

// ============================================================================
// MAIN RULE ENGINE
// ============================================================================

/**
 * Determine approval chain based on expense input
 * Main entry point for the rules engine
 * 
 * @param {Object} input - Expense input data
 * @param {string} input.operatingUnit - Operating unit (CCP, CCH, or CCF)
 * @param {string} input.template - Expense template name
 * @param {number} input.amount - Expense amount
 * @param {boolean} [input.isGrantFund] - Grant fund status (CCH only)
 * @param {string} [input.submitterName] - Submitter name (for special submitter detection)
 * @returns {Object} Approval chain result or error
 */
function determineApprovalChain(input) {
  try {
    // Validate input
    const validation = validateInput(input);
    if (!validation.valid) {
      // Return first validation error as info message
      return buildInfoResult(validation.errors[0].message);
    }
    
    // Normalize input
    const normalizedInput = {
      operatingUnit: input.operatingUnit,
      template: normalizeTemplate(input.template),
      amount: parseFloat(input.amount),
      isGrantFund: input.isGrantFund,
      submitterName: input.submitterName ? input.submitterName.trim() : ''
    };
    
    // Route to appropriate OU rule engine
    let approvers = null;
    let ruleApplied = '';
    
    switch (normalizedInput.operatingUnit) {
      case 'CCP':
        approvers = evaluateCCPRules(normalizedInput);
        ruleApplied = 'CCP Rules';
        break;
      
      case 'CCH':
        approvers = evaluateCCHRules(normalizedInput);
        ruleApplied = 'CCH Rules';
        break;
      
      case 'CCF':
        approvers = evaluateCCFRules(normalizedInput);
        ruleApplied = 'CCF Rules';
        break;
      
      default:
        return buildErrorResult('Invalid operating unit');
    }
    
    // Check if a rule matched
    if (!approvers || approvers.length === 0) {
      return buildInfoResult(ERROR_MESSAGES.UNDEFINED_SCENARIO);
    }
    
    // Build and return successful result
    return buildApprovalChainResult(approvers, {
      operatingUnit: normalizedInput.operatingUnit,
      template: normalizedInput.template,
      amount: normalizedInput.amount,
      ruleApplied: ruleApplied
    });
    
  } catch (error) {
    // Log error for debugging (console only)
    console.error('Error in determineApprovalChain:', error);
    
    // Return standard system error message
    return buildErrorResult(ERROR_MESSAGES.SYSTEM_ERROR, 'system');
  }
}

// ============================================================================
// HELPER FUNCTIONS FOR UI
// ============================================================================

/**
 * Get templates for a specific operating unit
 * @param {string} operatingUnit - Operating unit (CCP, CCH, or CCF)
 * @returns {Array<string>} Array of template names
 */
function getTemplatesForOU(operatingUnit) {
  const ou = OPERATING_UNITS[operatingUnit];
  return ou ? ou.templates : [];
}

/**
 * Check if operating unit requires grant fund information
 * @param {string} operatingUnit - Operating unit
 * @returns {boolean} True if grant fund info is required
 */
function ouRequiresGrantFund(operatingUnit) {
  const ou = OPERATING_UNITS[operatingUnit];
  return ou ? ou.requiresGrantFund : false;
}

/**
 * Get all operating units
 * @returns {Object} Operating units configuration
 */
function getAllOperatingUnits() {
  return OPERATING_UNITS;
}

// ============================================================================
// EXPORTS (for use in app.js)
// ============================================================================

// Make functions available globally for app.js
if (typeof window !== 'undefined') {
  window.RulesEngine = {
    determineApprovalChain,
    getTemplatesForOU,
    ouRequiresGrantFund,
    requiresGrantFundInfo,
    getAllOperatingUnits,
    OPERATING_UNITS,
    APPROVER_GROUPS,
    ERROR_MESSAGES
  };
}

// Made with Bob
