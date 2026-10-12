/**
 * Oracle iExpense Approval Assistant - Rules Engine
 * Version: 1.0
 * 
 * This module implements Oracle AME (Approval Management Engine) business rules
 * for determining expense report approval chains across three Operating Units:
 * - OU1 (OU 101)
 * - OU2 (OU 102)
 * - OU3 (OU 121)
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
  OU1: {
    id: 101,
    name: 'OU1',
    displayName: 'OU1 (OU 101)',
    templates: [
      'OU1 Tuition Expenses',
      'OU1 Non-Travel Expenses',
      'OU1 Travel Expenses-Other',
      'OU1 Local Mileage Expense'
    ],
    requiresGrantFund: false
  },
  OU2: {
    id: 102,
    name: 'OU2',
    displayName: 'OU2 (OU 102)',
    templates: [
      'OU2 Non-Travel Expenses',
      'OU2 Travel Expenses',
      'OU2 Non-Nursing Tuition',
      'OU2 Nursing Tuition'
    ],
    requiresGrantFund: true // Grant fund differentiation required for travel/non-travel
  },
  OU3: {
    id: 121,
    name: 'OU3',
    displayName: 'OU3 (OU 121)',
    templates: [
      'OU3 Standard Expense'
    ],
    requiresGrantFund: false
  }
};

/**
 * Approver Groups Configuration
 */
const APPROVER_GROUPS = {
  // OU1 Approvers
  OU1_DEPT_APPROVER: 'OU1 Department Approver',
  OU1_DBMS_APPROVERS: 'OU1 DBMS Approvers',
  OU1_OU2_NON_NURSING_TUITION_L1: 'OU1 and OU2 Non Nursing Tuition Approvers',
  OU1_OU2_NON_NURSING_TUITION_L2: 'OU1 and OU2 Non Nursing Tuition Approvers L2',
  
  // OU2 Approvers
  OU2_FIRST_SUPERIOR: 'First Superior',
  OU2_GRANT_FUND_L1: 'OU2 Grant Fund Approvers Level 1',
  OU2_NON_GRANT_FUND_L1: 'OU2 Non Grant Fund Approvers Level 1',
  OU2_APPROVERS_GT_5K: 'OU2 Approvers Greater Than 5k dollars',
  OU2_NURSING_TUITION_SELF: 'OU2 Nursing Tuition Self Approval group',
  
  // OU3 Approvers
  OU3_DEPT_APPROVER: 'OU3 Department Approver',
  OU3_SPECIAL_APPROVER: 'Special Approver',
  
  // System
  SYSADMIN: 'SYSADMIN'
};

/**
 * Special Submitters Configuration
 */
const SPECIAL_SUBMITTERS = {
  SPECIAL_APPROVER1: {
    name: 'Special Approver1',
    aliases: ['karen', 'martino', 'karen martino', 'k martino', 'k. martino'],
    affectedOUs: ['OU1', 'OU2'],
    affectedTemplates: ['tuition']
  },
  MELISSA: {
    name: 'Special Approver2',
    aliases: ['melissa'],
    affectedOUs: ['OU1', 'OU2'],
    affectedTemplates: ['tuition']
  },
  SPECIAL_APPROVER: {
    name: 'Special Approver',
    aliases: ['damon', 'howell', 'damon howell', 'd howell', 'd. howell'],
    affectedOUs: ['OU3'],
    affectedTemplates: ['all']
  }
};

/**
 * Error Messages
 */
const ERROR_MESSAGES = {
  SYSTEM_ERROR: 'Approval information is temporarily unavailable due to a system issue. Please try again later.',
  MISSING_OU: 'Please specify which operating unit: OU1, OU2, or OU3',
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
 * @param {Array<string>} specialSubmitterKeys - Keys to check (e.g., ['SPECIAL_APPROVER1', 'MELISSA'])
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
 * Check if template requires grant fund information (OU2 only)
 * @param {string} operatingUnit - Operating unit
 * @param {string} template - Template name
 * @returns {boolean} True if grant fund info is required
 */
function requiresGrantFundInfo(operatingUnit, template) {
  if (operatingUnit !== 'OU2') {
    return false;
  }
  
  const normalizedTemplate = normalizeTemplate(template);
  return normalizedTemplate === 'OU2 Non-Travel Expenses' || 
         normalizedTemplate === 'OU2 Travel Expenses';
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
      message: 'Invalid operating unit. Please select OU1, OU2, or OU3.'
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
  
  // OU2-specific: Grant Fund (for travel/non-travel templates)
  if (input.operatingUnit === 'OU2' && requiresGrantFundInfo(input.operatingUnit, input.template)) {
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
// OU1 RULES ENGINE (OU 101)
// ============================================================================

/**
 * Evaluate OU1 approval rules
 * @param {Object} input - Expense input data
 * @returns {Array<string>|null} Array of approver groups or null if no rule matches
 */
function evaluateOU1Rules(input) {
  const { template, amount, submitterName } = input;
  const normalizedTemplate = normalizeTemplate(template);
  
  // Rule OU1-1: Tuition Expenses
  if (normalizedTemplate === 'OU1 Tuition Expenses') {
    // Check if submitter is Special Approver1 or Special Approver2 (they have different routing)
    if (!isSpecialSubmitter(submitterName, ['SPECIAL_APPROVER1', 'MELISSA'])) {
      return [
        APPROVER_GROUPS.OU1_OU2_NON_NURSING_TUITION_L1,
        APPROVER_GROUPS.OU1_OU2_NON_NURSING_TUITION_L2
      ];
    }
    // If Karen or Special Approver2, different routing applies (not defined in rules, return null)
    return null;
  }
  
  // Rule OU1-2: Travel and Non-Travel (DBMS Required)
  if (normalizedTemplate === 'OU1 Non-Travel Expenses' || 
      normalizedTemplate === 'OU1 Travel Expenses-Other') {
    if (amount > 0) {
      return [
        APPROVER_GROUPS.OU1_DEPT_APPROVER,
        APPROVER_GROUPS.OU1_DBMS_APPROVERS
      ];
    }
  }
  
  // Rules OU1-3 & OU1-4: Local Mileage
  if (normalizedTemplate === 'OU1 Local Mileage Expense') {
    // Rule OU1-3: Local Mileage ≥ $1,000
    if (amount >= 1000) {
      return [
        APPROVER_GROUPS.OU1_DEPT_APPROVER,
        APPROVER_GROUPS.OU1_DBMS_APPROVERS
      ];
    }
    // Rule OU1-4: Local Mileage < $1,000
    else {
      return [
        APPROVER_GROUPS.OU1_DEPT_APPROVER
      ];
    }
  }
  
  // Rule OU1-5: No Department Approver Found
  // This is handled at the system level, return null to indicate undefined scenario
  return null;
}

// ============================================================================
// OU2 RULES ENGINE (OU 102)
// ============================================================================

/**
 * Evaluate OU2 approval rules
 * @param {Object} input - Expense input data
 * @returns {Array<string>|null} Array of approver groups or null if no rule matches
 */
function evaluateOU2Rules(input) {
  const { template, amount, isGrantFund, submitterName } = input;
  const normalizedTemplate = normalizeTemplate(template);
  
  // Rule OU2-5: Non-Nursing Tuition
  if (normalizedTemplate === 'OU2 Non-Nursing Tuition') {
    // Check if submitter is Special Approver1 or Special Approver2 (they have different routing)
    if (!isSpecialSubmitter(submitterName, ['SPECIAL_APPROVER1', 'MELISSA'])) {
      return [
        APPROVER_GROUPS.OU1_OU2_NON_NURSING_TUITION_L1,
        APPROVER_GROUPS.OU1_OU2_NON_NURSING_TUITION_L2
      ];
    }
    // If Karen or Special Approver2, different routing applies (not defined in rules, return null)
    return null;
  }
  
  // Rule OU2-6: Nursing Tuition (Self Approval)
  if (normalizedTemplate === 'OU2 Nursing Tuition') {
    return [
      APPROVER_GROUPS.OU2_NURSING_TUITION_SELF
    ];
  }
  
  // Rules OU2-1 through OU2-4: Travel/Non-Travel with Grant Fund differentiation
  if (normalizedTemplate === 'OU2 Non-Travel Expenses' || 
      normalizedTemplate === 'OU2 Travel Expenses') {
    
    const baseApprovers = [APPROVER_GROUPS.OU2_FIRST_SUPERIOR];
    
    // Check amount threshold: > $5,000 requires additional approver
    if (amount > 5000) {
      baseApprovers.push(APPROVER_GROUPS.OU2_APPROVERS_GT_5K);
    }
    
    // Add final approver based on grant fund status
    if (isGrantFund === true || isGrantFund === 'true') {
      // Rules OU2-1 & OU2-3: Grant Funds
      baseApprovers.push(APPROVER_GROUPS.OU2_GRANT_FUND_L1);
    } else {
      // Rules OU2-2 & OU2-4: Non-Grant Funds
      baseApprovers.push(APPROVER_GROUPS.OU2_NON_GRANT_FUND_L1);
    }
    
    return baseApprovers;
  }
  
  // No matching rule
  return null;
}

// ============================================================================
// OU3 RULES ENGINE (OU 121)
// ============================================================================

/**
 * Evaluate OU3 approval rules
 * @param {Object} input - Expense input data
 * @returns {Array<string>|null} Array of approver groups or null if no rule matches
 */
function evaluateOU3Rules(input) {
  const { amount, submitterName } = input;
  
  // Rule OU3-3: Damon's Own Submissions
  if (isSpecialSubmitter(submitterName, ['SPECIAL_APPROVER'])) {
    return [
      APPROVER_GROUPS.OU3_DEPT_APPROVER
      // Damon is skipped in his own submissions
    ];
  }
  
  // Rule OU3-1: Standard Expenses < $2,000
  if (amount < 2000) {
    return [
      APPROVER_GROUPS.OU3_DEPT_APPROVER
    ];
  }
  
  // Rule OU3-2: Standard Expenses ≥ $2,000
  if (amount >= 2000) {
    return [
      APPROVER_GROUPS.OU3_DEPT_APPROVER,
      APPROVER_GROUPS.OU3_SPECIAL_APPROVER
    ];
  }
  
  // Rule OU3-4: No Department Approver Found
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
 * @param {string} input.operatingUnit - Operating unit (OU1, OU2, or OU3)
 * @param {string} input.template - Expense template name
 * @param {number} input.amount - Expense amount
 * @param {boolean} [input.isGrantFund] - Grant fund status (OU2 only)
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
      case 'OU1':
        approvers = evaluateOU1Rules(normalizedInput);
        ruleApplied = 'OU1 Rules';
        break;
      
      case 'OU2':
        approvers = evaluateOU2Rules(normalizedInput);
        ruleApplied = 'OU2 Rules';
        break;
      
      case 'OU3':
        approvers = evaluateOU3Rules(normalizedInput);
        ruleApplied = 'OU3 Rules';
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
 * @param {string} operatingUnit - Operating unit (OU1, OU2, or OU3)
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
