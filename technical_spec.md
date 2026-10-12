# Oracle iExpense Approval Assistant
## Technical Specification

**Version:** 1.0  
**Date:** May 14, 2026  
**Author:** Bob - Oracle EBS Consultant  
**Status:** Production Ready

---

## 1. TECHNICAL OVERVIEW

### 1.1 Architecture Philosophy
The Oracle iExpense Approval Assistant is a **pure client-side application** that implements Oracle AME (Approval Management Engine) business rules without backend dependencies. This architecture provides:

- **Zero Infrastructure Cost** - No servers, databases, or APIs required
- **Instant Deployment** - Static files deployable to any web host
- **High Availability** - No server downtime concerns
- **Fast Performance** - No network latency for rule evaluation
- **Easy Maintenance** - Rules embedded in JavaScript for quick updates

### 1.2 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Frontend | HTML5 | - | Semantic markup and structure |
| Styling | CSS3 | - | Responsive design and theming |
| Logic | JavaScript (ES6+) | ES2020+ | Rule engine and UI interaction |
| Deployment | GitHub Pages | - | Static site hosting |
| CI/CD | GitHub Actions | - | Automated deployment |

### 1.3 Browser Compatibility

**Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

**Required Features:**
- ES6+ JavaScript support
- CSS Grid and Flexbox
- LocalStorage API (optional, for preferences)
- Fetch API (for future enhancements)

---

## 2. SYSTEM ARCHITECTURE

### 2.1 High-Level Architecture (ASCII Diagram)

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    index.html (UI Layer)                   │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │  │
│  │  │   Header    │  │    Form     │  │   Results   │       │  │
│  │  │  Component  │  │  Component  │  │  Component  │       │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                    │
│                              ▼                                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              app.js (Application Controller)              │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │  │
│  │  │    Form     │  │  Validation │  │     UI      │       │  │
│  │  │   Handler   │  │   Handler   │  │   Renderer  │       │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                    │
│                              ▼                                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │          rules_engine.js (Business Logic Layer)           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │  │
│  │  │  OU1 Rules  │  │  OU2 Rules  │  │  OU3 Rules  │       │  │
│  │  │   Engine    │  │   Engine    │  │   Engine    │       │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │  │
│  │  │   Rule      │  │   Amount    │  │   Special   │       │  │
│  │  │  Evaluator  │  │  Threshold  │  │  Submitter  │       │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                    │
│                              ▼                                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              styles.css (Presentation Layer)              │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │  │
│  │  │   Layout    │  │  Components │  │  Responsive │       │  │
│  │  │   Styles    │  │   Styles    │  │   Design    │       │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYERS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  PRESENTATION LAYER (index.html + styles.css)                    │
│  ├─ Header Component                                             │
│  ├─ Form Component                                               │
│  │  ├─ Operating Unit Selector                                   │
│  │  ├─ Template Selector                                         │
│  │  ├─ Amount Input                                              │
│  │  ├─ Grant Fund Toggle (OU2 only)                              │
│  │  └─ Submitter Name Input (conditional)                        │
│  ├─ Results Component                                            │
│  │  ├─ Approval Chain Display                                    │
│  │  ├─ Error Message Display                                     │
│  │  └─ Information Display                                       │
│  └─ Footer Component                                             │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  APPLICATION LAYER (app.js)                                      │
│  ├─ Event Handlers                                               │
│  │  ├─ Form Submission Handler                                   │
│  │  ├─ OU Change Handler                                         │
│  │  ├─ Template Change Handler                                   │
│  │  └─ Reset Handler                                             │
│  ├─ Validation Logic                                             │
│  │  ├─ Required Field Validation                                 │
│  │  ├─ Amount Validation                                         │
│  │  └─ Template Validation                                       │
│  ├─ UI Rendering                                                 │
│  │  ├─ Dynamic Field Display                                     │
│  │  ├─ Results Rendering                                         │
│  │  └─ Error Display                                             │
│  └─ State Management                                             │
│     ├─ Form State                                                │
│     └─ Results State                                             │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  BUSINESS LOGIC LAYER (rules_engine.js)                          │
│  ├─ Main Rule Engine                                             │
│  │  ├─ determineApprovalChain()                                  │
│  │  └─ validateInput()                                           │
│  ├─ OU-Specific Rule Engines                                     │
│  │  ├─ evaluateOU1Rules()                                        │
│  │  ├─ evaluateOU2Rules()                                        │
│  │  └─ evaluateOU3Rules()                                        │
│  ├─ Rule Evaluation Helpers                                      │
│  │  ├─ checkAmountThreshold()                                    │
│  │  ├─ isGrantFund()                                             │
│  │  ├─ isSpecialSubmitter()                                      │
│  │  └─ matchTemplate()                                           │
│  └─ Data Structures                                              │
│     ├─ Operating Units Config                                    │
│     ├─ Templates Config                                          │
│     ├─ Approver Groups Config                                    │
│     └─ Special Submitters Config                                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. DATA STRUCTURES

### 3.1 Operating Unit Configuration

```javascript
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
    ]
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
    requiresGrantFund: true
  },
  OU3: {
    id: 121,
    name: 'OU3',
    displayName: 'OU3 (OU 121)',
    templates: [
      'OU3 Standard Expense'
    ]
  }
};
```

### 3.2 Approver Groups Configuration

```javascript
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
```

### 3.3 Special Submitters Configuration

```javascript
const SPECIAL_SUBMITTERS = {
  SPECIAL_APPROVER1: {
    name: 'Special Approver1',
    aliases: ['karen', 'martino', 'karen martino'],
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
    aliases: ['damon', 'howell', 'damon howell'],
    affectedOUs: ['OU3'],
    affectedTemplates: ['all']
  }
};
```

### 3.4 Input Data Structure

```javascript
interface ExpenseInput {
  operatingUnit: string;      // 'OU1' | 'OU2' | 'OU3'
  template: string;           // Template name
  amount: number;             // Expense amount
  isGrantFund?: boolean;      // OU2 only
  submitterName?: string;     // For special submitter detection
}
```

### 3.5 Output Data Structure

```javascript
interface ApprovalChainResult {
  success: boolean;
  approvalChain?: Array<{
    sequence: number;
    approverGroup: string;
    description?: string;
  }>;
  message?: string;
  error?: string;
  metadata?: {
    operatingUnit: string;
    template: string;
    amount: number;
    ruleApplied: string;
  };
}
```

---

## 4. RULES ENGINE DESIGN

### 4.1 Rule Evaluation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    RULE EVALUATION PROCESS                       │
└─────────────────────────────────────────────────────────────────┘

START
  │
  ▼
┌─────────────────────┐
│  Validate Input     │
│  - OU present?      │
│  - Template valid?  │
│  - Amount valid?    │
└─────────────────────┘
  │
  ├─ Invalid ──────────────────────────────────────┐
  │                                                 │
  ▼                                                 ▼
┌─────────────────────┐                    ┌──────────────────┐
│  Identify OU        │                    │  Return Error    │
│  - OU1 (101)        │                    │  with Missing    │
│  - OU2 (102)        │                    │  Information     │
│  - OU3 (121)        │                    └──────────────────┘
└─────────────────────┘
  │
  ▼
┌─────────────────────┐
│  Route to OU        │
│  Rule Engine        │
└─────────────────────┘
  │
  ├─ OU1 ──────────────┐
  ├─ OU2 ──────────────┤
  └─ OU3 ──────────────┘
                       │
                       ▼
              ┌─────────────────────┐
              │  Evaluate OU Rules  │
              │  in Priority Order  │
              └─────────────────────┘
                       │
                       ▼
              ┌─────────────────────┐
              │  Check Special      │
              │  Submitters         │
              └─────────────────────┘
                       │
                       ▼
              ┌─────────────────────┐
              │  Check Amount       │
              │  Thresholds         │
              └─────────────────────┘
                       │
                       ▼
              ┌─────────────────────┐
              │  Check Grant Fund   │
              │  (OU2 only)         │
              └─────────────────────┘
                       │
                       ▼
              ┌─────────────────────┐
              │  Build Approval     │
              │  Chain              │
              └─────────────────────┘
                       │
                       ▼
              ┌─────────────────────┐
              │  Return Result      │
              │  with Metadata      │
              └─────────────────────┘
                       │
                       ▼
                      END
```

### 4.2 OU1 Rule Engine Logic

```javascript
function evaluateOU1Rules(input) {
  const { template, amount, submitterName } = input;
  
  // Rule OU1-1: Tuition Expenses
  if (template === 'OU1 Tuition Expenses') {
    if (!isSpecialSubmitter(submitterName, ['SPECIAL_APPROVER1', 'MELISSA'])) {
      return [
        APPROVER_GROUPS.OU1_OU2_NON_NURSING_TUITION_L1,
        APPROVER_GROUPS.OU1_OU2_NON_NURSING_TUITION_L2
      ];
    }
  }
  
  // Rule OU1-2: Travel and Non-Travel (DBMS Required)
  if (template === 'OU1 Non-Travel Expenses' || 
      template === 'OU1 Travel Expenses-Other') {
    if (amount > 0) {
      return [
        APPROVER_GROUPS.OU1_DEPT_APPROVER,
        APPROVER_GROUPS.OU1_DBMS_APPROVERS
      ];
    }
  }
  
  // Rule OU1-3: Local Mileage ≥ $1,000
  if (template === 'OU1 Local Mileage Expense') {
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
  
  // Rule OU1-5: No Department Approver (handled at system level)
  return null;
}
```

### 4.3 OU2 Rule Engine Logic

```javascript
function evaluateOU2Rules(input) {
  const { template, amount, isGrantFund, submitterName } = input;
  
  // Rule OU2-5: Non-Nursing Tuition
  if (template === 'OU2 Non-Nursing Tuition') {
    if (!isSpecialSubmitter(submitterName, ['SPECIAL_APPROVER1', 'MELISSA'])) {
      return [
        APPROVER_GROUPS.OU1_OU2_NON_NURSING_TUITION_L1,
        APPROVER_GROUPS.OU1_OU2_NON_NURSING_TUITION_L2
      ];
    }
  }
  
  // Rule OU2-6: Nursing Tuition (Self Approval)
  if (template === 'OU2 Nursing Tuition') {
    return [
      APPROVER_GROUPS.OU2_NURSING_TUITION_SELF
    ];
  }
  
  // Rules OU2-1 through OU2-4: Travel/Non-Travel
  if (template === 'OU2 Non-Travel Expenses' || 
      template === 'OU2 Travel Expenses') {
    
    const baseApprovers = [APPROVER_GROUPS.OU2_FIRST_SUPERIOR];
    
    // Amount > $5,000
    if (amount > 5000) {
      baseApprovers.push(APPROVER_GROUPS.OU2_APPROVERS_GT_5K);
    }
    
    // Grant vs Non-Grant
    if (isGrantFund) {
      baseApprovers.push(APPROVER_GROUPS.OU2_GRANT_FUND_L1);
    } else {
      baseApprovers.push(APPROVER_GROUPS.OU2_NON_GRANT_FUND_L1);
    }
    
    return baseApprovers;
  }
  
  return null;
}
```

### 4.4 OU3 Rule Engine Logic

```javascript
function evaluateOU3Rules(input) {
  const { amount, submitterName } = input;
  
  // Rule OU3-3: Damon's Own Submissions
  if (isSpecialSubmitter(submitterName, ['SPECIAL_APPROVER'])) {
    return [
      APPROVER_GROUPS.OU3_DEPT_APPROVER
      // Damon is skipped
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
  
  // Rule OU3-4: No Department Approver (handled at system level)
  return null;
}
```

---

## 5. USER INTERFACE DESIGN

### 5.1 Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                           HEADER                                 │
│  Oracle iExpense Approval Assistant                              │
│  Determine your expense approval chain                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        MAIN CONTENT                              │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    EXPENSE DETAILS FORM                    │  │
│  │                                                             │  │
│  │  Operating Unit: [Dropdown: OU1 / OU2 / OU3]              │  │
│  │                                                             │  │
│  │  Expense Template: [Dropdown: Template options]           │  │
│  │                                                             │  │
│  │  Total Amount: [$_______]                                 │  │
│  │                                                             │  │
│  │  [Conditional: Grant Fund toggle for OU2]                 │  │
│  │  [Conditional: Submitter name for special cases]          │  │
│  │                                                             │  │
│  │  [Get Approval Chain Button]  [Reset Button]              │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    APPROVAL CHAIN RESULTS                  │  │
│  │                                                             │  │
│  │  Based on your expense details, the approval chain is:    │  │
│  │                                                             │  │
│  │  1. [First Approver Name/Role]                            │  │
│  │  2. [Second Approver Name/Role]                           │  │
│  │  3. [Third Approver Name/Role]                            │  │
│  │                                                             │  │
│  │  [Additional information or notes]                        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                           FOOTER                                 │
│  © 2026 Oracle iExpense Approval Assistant v1.0                 │
│  For informational purposes only                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Responsive Breakpoints

```css
/* Mobile First Approach */

/* Small devices (phones, < 640px) */
@media (max-width: 639px) {
  - Single column layout
  - Full-width form fields
  - Stacked buttons
  - Larger touch targets (min 44px)
}

/* Medium devices (tablets, 640px - 1023px) */
@media (min-width: 640px) and (max-width: 1023px) {
  - Two-column layout for form
  - Side-by-side buttons
  - Optimized spacing
}

/* Large devices (desktops, ≥ 1024px) */
@media (min-width: 1024px) {
  - Centered content (max-width: 1200px)
  - Multi-column layout
  - Enhanced visual hierarchy
}
```

### 5.3 Color Scheme

```css
:root {
  /* Primary Colors (Oracle-inspired) */
  --primary-color: #c74634;        /* Oracle Red */
  --primary-dark: #a03828;
  --primary-light: #e85847;
  
  /* Secondary Colors */
  --secondary-color: #312d2a;      /* Dark Gray */
  --secondary-light: #5a5550;
  
  /* Neutral Colors */
  --background: #ffffff;
  --surface: #f8f9fa;
  --border: #dee2e6;
  
  /* Text Colors */
  --text-primary: #212529;
  --text-secondary: #6c757d;
  --text-light: #adb5bd;
  
  /* Status Colors */
  --success: #28a745;
  --warning: #ffc107;
  --error: #dc3545;
  --info: #17a2b8;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

---

## 6. ERROR HANDLING STRATEGY

### 6.1 Error Categories

```javascript
const ERROR_TYPES = {
  VALIDATION_ERROR: 'validation',
  SYSTEM_ERROR: 'system',
  MISSING_INFO: 'missing_info',
  UNDEFINED_SCENARIO: 'undefined'
};

const ERROR_MESSAGES = {
  SYSTEM_ERROR: 'Approval information is temporarily unavailable due to a system issue. Please try again later.',
  MISSING_OU: 'Please specify which operating unit: OU1, OU2, or OU3',
  MISSING_TEMPLATE: 'Please select an expense template',
  MISSING_AMOUNT: 'Please enter the total expense amount',
  INVALID_AMOUNT: 'Please enter a valid amount greater than $0',
  MISSING_GRANT_INFO: 'Is this expense charged to a grant fund (42000 or 41235)?',
  UNDEFINED_SCENARIO: 'This expense scenario is not defined in the current approval rules. Please contact your expense administrator for guidance.'
};
```

### 6.2 Error Handling Flow

```javascript
function handleError(error, context) {
  // Log error for debugging (console only, not shown to user)
  console.error('Error in approval chain determination:', error, context);
  
  // Determine error type
  if (error.type === ERROR_TYPES.VALIDATION_ERROR) {
    return {
      success: false,
      error: error.message,
      type: 'validation'
    };
  }
  
  if (error.type === ERROR_TYPES.MISSING_INFO) {
    return {
      success: false,
      message: error.message,
      type: 'info'
    };
  }
  
  // All system errors return standard message
  return {
    success: false,
    error: ERROR_MESSAGES.SYSTEM_ERROR,
    type: 'system'
  };
}
```

### 6.3 Input Validation

```javascript
function validateInput(input) {
  const errors = [];
  
  // Required: Operating Unit
  if (!input.operatingUnit) {
    errors.push({
      field: 'operatingUnit',
      message: ERROR_MESSAGES.MISSING_OU
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
  if (input.amount === undefined || input.amount === null) {
    errors.push({
      field: 'amount',
      message: ERROR_MESSAGES.MISSING_AMOUNT
    });
  } else if (input.amount <= 0) {
    errors.push({
      field: 'amount',
      message: ERROR_MESSAGES.INVALID_AMOUNT
    });
  }
  
  // OU2-specific: Grant Fund
  if (input.operatingUnit === 'OU2' && 
      (input.template === 'OU2 Non-Travel Expenses' || 
       input.template === 'OU2 Travel Expenses')) {
    if (input.isGrantFund === undefined) {
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
```

---

## 7. PERFORMANCE OPTIMIZATION

### 7.1 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Initial Page Load | < 3 seconds | Time to Interactive (TTI) |
| Rule Evaluation | < 100ms | Function execution time |
| Form Interaction | < 50ms | Input response time |
| Memory Usage | < 50MB | Browser DevTools |
| Bundle Size | < 100KB | Uncompressed total |

### 7.2 Optimization Techniques

**Code Optimization:**
- Minimize DOM manipulation
- Use event delegation
- Debounce input handlers
- Lazy load non-critical features

**Asset Optimization:**
- Inline critical CSS
- Minify JavaScript and CSS
- Use modern image formats (WebP)
- Implement resource hints (preconnect, prefetch)

**Caching Strategy:**
```javascript
// Service Worker for offline capability (future enhancement)
const CACHE_NAME = 'iexpense-approval-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/rules_engine.js'
];
```

---

## 8. TESTING STRATEGY

### 8.1 Test Pyramid

```
                    ┌─────────────┐
                    │   Manual    │  5%
                    │   Testing   │
                    └─────────────┘
                  ┌─────────────────┐
                  │  Integration    │  15%
                  │    Testing      │
                  └─────────────────┘
              ┌───────────────────────┐
              │    Unit Testing       │  80%
              │  (Rules Engine)       │
              └───────────────────────┘
```

### 8.2 Unit Test Coverage

**Rules Engine Tests:**
```javascript
describe('OU1 Rules Engine', () => {
  test('OU1-1: Tuition expenses for non-special submitters', () => {
    const input = {
      operatingUnit: 'OU1',
      template: 'OU1 Tuition Expenses',
      amount: 1000,
      submitterName: 'John Doe'
    };
    const result = determineApprovalChain(input);
    expect(result.approvalChain).toHaveLength(2);
    expect(result.approvalChain[0]).toBe('OU1 and OU2 Non Nursing Tuition Approvers');
  });
  
  test('OU1-3: Local mileage >= $1,000', () => {
    const input = {
      operatingUnit: 'OU1',
      template: 'OU1 Local Mileage Expense',
      amount: 1500
    };
    const result = determineApprovalChain(input);
    expect(result.approvalChain).toHaveLength(2);
    expect(result.approvalChain[1]).toBe('OU1 DBMS Approvers');
  });
});
```

### 8.3 Integration Test Scenarios

1. **End-to-End User Flow**
   - User selects OU → Template → Amount
   - System displays correct approval chain
   - User resets form and tries different scenario

2. **Dynamic Field Display**
   - OU2 selection shows grant fund toggle
   - Template selection updates based on OU
   - Conditional fields appear/disappear correctly

3. **Error Handling**
   - Missing required fields show validation errors
   - System errors display standard message
   - Validation clears when corrected

---

## 9. DEPLOYMENT ARCHITECTURE

### 9.1 GitHub Pages Deployment

```
┌─────────────────────────────────────────────────────────────────┐
│                      GITHUB REPOSITORY                           │
│                                                                   │
│  main branch                                                      │
│  ├── index.html                                                   │
│  ├── styles.css                                                   │
│  ├── app.js                                                       │
│  ├── rules_engine.js                                              │
│  ├── README.md                                                    │
│  ├── functional_spec.md                                           │
│  ├── technical_spec.md                                            │
│  ├── test_cases.md                                                │
│  └── .github/                                                     │
│      └── workflows/                                               │
│          └── deploy.yml                                           │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              GITHUB ACTIONS WORKFLOW                     │    │
│  │                                                           │    │
│  │  Trigger: Push to main branch                           │    │
│  │  Steps:                                                  │    │
│  │    1. Checkout code                                      │    │
│  │    2. Run tests (if configured)                         │    │
│  │    3. Deploy to GitHub Pages                            │    │
│  │    4. Notify on success/failure                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       GITHUB PAGES CDN                           │
│                                                                   │
│  URL: https://[username].github.io/[repo-name]                   │
│                                                                   │
│  Features:                                                        │
│  ✓ HTTPS enabled                                                 │
│  ✓ Global CDN distribution                                       │
│  ✓ Automatic SSL certificate                                     │
│  ✓ Custom domain support (optional)                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node.js (for future testing)
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
          publish_branch: gh-pages
```

---

## 10. SECURITY CONSIDERATIONS

### 10.1 Security Principles

**Client-Side Security:**
- No sensitive data storage
- No authentication/authorization required
- No PII collection
- Input sanitization for XSS prevention
- Content Security Policy (CSP) headers

**Data Privacy:**
- No data transmission to external servers
- No cookies or tracking
- No analytics (unless explicitly added)
- All processing happens in browser

### 10.2 Input Sanitization

```javascript
function sanitizeInput(input) {
  return {
    operatingUnit: sanitizeString(input.operatingUnit),
    template: sanitizeString(input.template),
    amount: parseFloat(input.amount) || 0,
    isGrantFund: Boolean(input.isGrantFund),
    submitterName: sanitizeString(input.submitterName)
  };
}

function sanitizeString(str) {
  if (!str) return '';
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 200);   // Limit length
}
```

---

## 11. MAINTENANCE AND UPDATES

### 11.1 Rule Update Process

**When AME rules change:**

1. **Update rules_engine.js**
   - Modify rule evaluation logic
   - Update approver group constants
   - Add/remove templates as needed

2. **Update Documentation**
   - Update functional_spec.md
   - Update test_cases.md
   - Update README.md

3. **Test Changes**
   - Run all test cases
   - Verify edge cases
   - Test in multiple browsers

4. **Deploy**
   - Commit changes to main branch
   - GitHub Actions auto-deploys
   - Verify production deployment

### 11.2 Version Control Strategy

```
main branch (production)
  │
  ├── feature/new-rule-ccp-6
  ├── feature/update-cch-thresholds
  ├── bugfix/grant-fund-validation
  └── docs/update-specifications
```

**Branching Strategy:**
- `main` - Production-ready code
- `feature/*` - New features or rule additions
- `bugfix/*` - Bug fixes
- `docs/*` - Documentation updates

---

## 12. MONITORING AND ANALYTICS

### 12.1 Error Logging (Console Only)

```javascript
const Logger = {
  error: (message, context) => {
    console.error('[iExpense Approval]', message, context);
  },
  warn: (message, context) => {
    console.warn('[iExpense Approval]', message, context);
  },
  info: (message, context) => {
    console.info('[iExpense Approval]', message, context);
  }
};
```

### 12.2 Future Analytics Considerations

**Potential Metrics (if analytics added):**
- Most queried Operating Units
- Most common expense templates
- Average amount ranges
- Error frequency by type
- User session duration

**Privacy-First Approach:**
- No personal information collected
- Aggregate data only
- Opt-in analytics
- Clear privacy policy

---

## 13. ACCESSIBILITY (WCAG 2.1 AA)

### 13.1 Accessibility Requirements

**Keyboard Navigation:**
- All interactive elements keyboard accessible
- Logical tab order
- Visible focus indicators
- Skip navigation links

**Screen Reader Support:**
- Semantic HTML elements
- ARIA labels where needed
- Form field associations
- Error announcements

**Visual Accessibility:**
- Color contrast ratio ≥ 4.5:1
- Text resizable to 200%
- No information conveyed by color alone
- Clear visual hierarchy

### 13.2 ARIA Implementation

```html
<form role="form" aria-labelledby="form-title">
  <h2 id="form-title">Expense Details</h2>
  
  <label for="operating-unit">Operating Unit</label>
  <select id="operating-unit" 
          aria-required="true"
          aria-describedby="ou-help">
    <option value="">Select Operating Unit</option>
  </select>
  <span id="ou-help" class="help-text">
    Choose OU1, OU2, or OU3
  </span>
  
  <div role="alert" aria-live="polite" id="error-message"></div>
  <div role="status" aria-live="polite" id="results"></div>
</form>
```

---

## 14. BROWSER COMPATIBILITY MATRIX

| Feature | Chrome 90+ | Firefox 88+ | Safari 14+ | Edge 90+ |
|---------|------------|-------------|------------|----------|
| ES6+ JavaScript | ✓ | ✓ | ✓ | ✓ |
| CSS Grid | ✓ | ✓ | ✓ | ✓ |
| CSS Flexbox | ✓ | ✓ | ✓ | ✓ |
| LocalStorage | ✓ | ✓ | ✓ | ✓ |
| Fetch API | ✓ | ✓ | ✓ | ✓ |
| Arrow Functions | ✓ | ✓ | ✓ | ✓ |
| Template Literals | ✓ | ✓ | ✓ | ✓ |
| Destructuring | ✓ | ✓ | ✓ | ✓ |

---

## 15. TECHNICAL DEBT AND FUTURE ENHANCEMENTS

### 15.1 Known Limitations

1. **No Backend Integration**
   - Cannot fetch real-time approver names
   - Cannot validate against actual org structure
   - Cannot check current AME configuration

2. **Static Rule Set**
   - Rules must be manually updated
   - No dynamic rule loading
   - No A/B testing capability

3. **Limited Offline Support**
   - No service worker implementation
   - No offline caching (yet)

### 15.2 Future Technical Enhancements

**Phase 2:**
- Service Worker for offline capability
- Progressive Web App (PWA) features
- LocalStorage for form state persistence
- Print stylesheet optimization

**Phase 3:**
- Integration with Oracle EBS APIs (read-only)
- Real-time approver name lookup
- Historical approval chain queries
- Export approval chain to PDF

**Phase 4:**
- Mobile native app (React Native)
- Voice interface (Alexa/Google Assistant)
- Chatbot integration
- Multi-language support

---

## 16. CODE ORGANIZATION

### 16.1 File Structure

```
iexpense-approval-assistant/
├── index.html              # Main HTML file (UI structure)
├── styles.css              # All styling (responsive design)
├── app.js                  # Application controller (UI logic)
├── rules_engine.js         # Business logic (AME rules)
├── README.md               # Project documentation
├── functional_spec.md      # Functional specification
├── technical_spec.md       # Technical specification (this file)
├── test_cases.md           # Test scenarios and cases
├── .gitignore              # Git ignore file
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Actions deployment
```

### 16.2 Code Style Guidelines

**JavaScript:**
- ES6+ syntax
- Camel case for variables and functions
- UPPER_SNAKE_CASE for constants
- JSDoc comments for functions
- 2-space indentation

**CSS:**
- BEM naming convention
- Mobile-first approach
- CSS custom properties for theming
- Logical property grouping

**HTML:**
- Semantic HTML5 elements
- Accessible markup
- Minimal inline styles
- Clear class names

---

## 17. APPENDIX

### 17.1 Glossary of Technical Terms

| Term | Definition |
|------|------------|
| AME | Approval Management Engine - Oracle's workflow system |
| Client-Side | Code that runs in the user's browser |
| CSP | Content Security Policy - Security header |
| DOM | Document Object Model - HTML structure |
| ES6+ | Modern JavaScript (ECMAScript 2015+) |
| PWA | Progressive Web App |
| SPA | Single Page Application |
| WCAG | Web Content Accessibility Guidelines |
| XSS | Cross-Site Scripting attack |

### 17.2 Reference Links

- **Oracle EBS Documentation:** https://docs.oracle.com/en/applications/
- **AME User Guide:** https://docs.oracle.com/cd/E18727_01/doc.121/e13373/toc.htm
- **WCAG 2.1 Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **MDN Web Docs:** https://developer.mozilla.org/

---

## 18. CHANGE LOG

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-05-14 | Bob | Initial technical specification |

---

**END OF TECHNICAL SPECIFICATION**
