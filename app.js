/**
 * Oracle iExpense Approval Assistant - Application Controller
 * Version: 1.0
 * 
 * This module handles all UI interactions, form validation, and result rendering.
 * It interfaces with the rules_engine.js module for business logic.
 */

// ============================================================================
// APPLICATION STATE
// ============================================================================

const AppState = {
  currentOU: null,
  currentTemplate: null,
  formData: {},
  lastResult: null
};

// ============================================================================
// DOM ELEMENTS
// ============================================================================

let elements = {};

/**
 * Initialize DOM element references
 */
function initializeElements() {
  elements = {
    // Form elements
    form: document.getElementById('expenseForm'),
    operatingUnit: document.getElementById('operatingUnit'),
    template: document.getElementById('template'),
    amount: document.getElementById('amount'),
    grantFundGroup: document.getElementById('grantFundGroup'),
    grantFundRadios: document.getElementsByName('isGrantFund'),
    submitterGroup: document.getElementById('submitterGroup'),
    submitterName: document.getElementById('submitterName'),
    
    // Buttons
    submitBtn: document.getElementById('submitBtn'),
    resetBtn: document.getElementById('resetBtn'),
    
    // Result sections
    resultsCard: document.getElementById('resultsCard'),
    resultsContent: document.getElementById('resultsContent'),
    errorCard: document.getElementById('errorCard'),
    errorContent: document.getElementById('errorContent'),
    infoCard: document.getElementById('infoCard'),
    infoContent: document.getElementById('infoContent'),
    
    // Loading overlay
    loadingOverlay: document.getElementById('loadingOverlay'),
    
    // Error message spans
    errorOperatingUnit: document.getElementById('error-operatingUnit'),
    errorTemplate: document.getElementById('error-template'),
    errorAmount: document.getElementById('error-amount'),
    errorGrantFund: document.getElementById('error-grantFund')
  };
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the application
 */
function initializeApp() {
  initializeElements();
  attachEventListeners();
  hideAllResultSections();
  
  console.log('Oracle iExpense Approval Assistant initialized');
}

/**
 * Attach event listeners to form elements
 */
function attachEventListeners() {
  // Form submission
  elements.form.addEventListener('submit', handleFormSubmit);
  
  // Reset button
  elements.resetBtn.addEventListener('click', handleReset);
  
  // Operating Unit change
  elements.operatingUnit.addEventListener('change', handleOUChange);
  
  // Template change
  elements.template.addEventListener('change', handleTemplateChange);
  
  // Amount input (clear error on input)
  elements.amount.addEventListener('input', () => {
    clearFieldError('amount');
  });
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Handle form submission
 * @param {Event} event - Form submit event
 */
function handleFormSubmit(event) {
  event.preventDefault();
  
  // Clear previous results and errors
  hideAllResultSections();
  clearAllFieldErrors();
  
  // Collect form data
  const formData = collectFormData();
  
  // Show loading overlay
  showLoading();
  
  // Simulate processing delay for better UX (optional)
  setTimeout(() => {
    // Determine approval chain
    const result = window.RulesEngine.determineApprovalChain(formData);
    
    // Hide loading overlay
    hideLoading();
    
    // Display result
    displayResult(result);
    
    // Store result in state
    AppState.lastResult = result;
    AppState.formData = formData;
  }, 500);
}

/**
 * Handle reset button click
 */
function handleReset() {
  // Reset form
  elements.form.reset();
  
  // Clear state
  AppState.currentOU = null;
  AppState.currentTemplate = null;
  AppState.formData = {};
  AppState.lastResult = null;
  
  // Hide all result sections
  hideAllResultSections();
  clearAllFieldErrors();
  
  // Reset template dropdown
  elements.template.disabled = true;
  elements.template.innerHTML = '<option value="">-- Select Operating Unit First --</option>';
  
  // Hide conditional fields
  elements.grantFundGroup.style.display = 'none';
  elements.submitterGroup.style.display = 'none';
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Handle Operating Unit change
 * @param {Event} event - Change event
 */
function handleOUChange(event) {
  const selectedOU = event.target.value;
  
  clearFieldError('operatingUnit');
  
  if (!selectedOU) {
    // No OU selected, disable template
    elements.template.disabled = true;
    elements.template.innerHTML = '<option value="">-- Select Operating Unit First --</option>';
    elements.grantFundGroup.style.display = 'none';
    elements.submitterGroup.style.display = 'none';
    AppState.currentOU = null;
    return;
  }
  
  // Update state
  AppState.currentOU = selectedOU;
  
  // Populate templates for selected OU
  populateTemplates(selectedOU);
  
  // Show/hide conditional fields based on OU
  updateConditionalFields(selectedOU, null);
}

/**
 * Handle Template change
 * @param {Event} event - Change event
 */
function handleTemplateChange(event) {
  const selectedTemplate = event.target.value;
  
  clearFieldError('template');
  
  if (!selectedTemplate) {
    AppState.currentTemplate = null;
    return;
  }
  
  // Update state
  AppState.currentTemplate = selectedTemplate;
  
  // Update conditional fields based on template
  updateConditionalFields(AppState.currentOU, selectedTemplate);
}

// ============================================================================
// FORM DATA COLLECTION
// ============================================================================

/**
 * Collect form data
 * @returns {Object} Form data object
 */
function collectFormData() {
  const data = {
    operatingUnit: elements.operatingUnit.value,
    template: elements.template.value,
    amount: elements.amount.value
  };
  
  // Add grant fund status if applicable
  if (elements.grantFundGroup.style.display !== 'none') {
    const selectedGrantFund = Array.from(elements.grantFundRadios).find(radio => radio.checked);
    if (selectedGrantFund) {
      data.isGrantFund = selectedGrantFund.value === 'true';
    }
  }
  
  // Add submitter name if provided
  if (elements.submitterName.value.trim()) {
    data.submitterName = elements.submitterName.value.trim();
  }
  
  return data;
}

// ============================================================================
// TEMPLATE POPULATION
// ============================================================================

/**
 * Populate template dropdown based on selected OU
 * @param {string} operatingUnit - Selected operating unit
 */
function populateTemplates(operatingUnit) {
  const templates = window.RulesEngine.getTemplatesForOU(operatingUnit);
  
  // Clear existing options
  elements.template.innerHTML = '<option value="">-- Select Expense Template --</option>';
  
  // Add templates
  templates.forEach(template => {
    const option = document.createElement('option');
    option.value = template;
    option.textContent = template;
    elements.template.appendChild(option);
  });
  
  // Enable template dropdown
  elements.template.disabled = false;
}

// ============================================================================
// CONDITIONAL FIELDS
// ============================================================================

/**
 * Update conditional fields based on OU and template
 * @param {string} operatingUnit - Selected operating unit
 * @param {string} template - Selected template
 */
function updateConditionalFields(operatingUnit, template) {
  // Grant Fund field (OU2 only, for travel/non-travel)
  if (operatingUnit === 'OU2' && template && 
      window.RulesEngine.requiresGrantFundInfo(operatingUnit, template)) {
    elements.grantFundGroup.style.display = 'block';
  } else {
    elements.grantFundGroup.style.display = 'none';
    // Clear grant fund selection
    Array.from(elements.grantFundRadios).forEach(radio => radio.checked = false);
  }
  
  // Submitter Name field (show for tuition templates and OU3)
  const showSubmitterField = 
    (operatingUnit === 'OU1' && template && template.includes('Tuition')) ||
    (operatingUnit === 'OU2' && template && template.includes('Tuition')) ||
    (operatingUnit === 'OU3');
  
  if (showSubmitterField) {
    elements.submitterGroup.style.display = 'block';
  } else {
    elements.submitterGroup.style.display = 'none';
    elements.submitterName.value = '';
  }
}

// ============================================================================
// RESULT DISPLAY
// ============================================================================

/**
 * Display result based on type
 * @param {Object} result - Result object from rules engine
 */
function displayResult(result) {
  if (result.success) {
    displayApprovalChain(result);
  } else if (result.type === 'info') {
    displayInfoMessage(result.message);
  } else if (result.type === 'system') {
    displayErrorMessage(result.error);
  } else {
    displayErrorMessage(result.error || 'An unexpected error occurred');
  }
  
  // Scroll to results
  setTimeout(() => {
    const targetElement = result.success ? elements.resultsCard : 
                         result.type === 'info' ? elements.infoCard : 
                         elements.errorCard;
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

/**
 * Display approval chain
 * @param {Object} result - Successful result with approval chain
 */
function displayApprovalChain(result) {
  const { approvalChain, metadata } = result;
  
  let html = '<div class="approval-result">';
  html += '<p class="result-intro">Based on your expense details, the approval chain is:</p>';
  html += '<ol class="approval-chain">';
  
  approvalChain.forEach(approver => {
    html += `<li class="approval-step">
      <span class="approver-sequence">${approver.sequence}</span>
      <span class="approver-name">${approver.approverGroup}</span>
    </li>`;
  });
  
  html += '</ol>';
  
  // Add metadata summary
  if (metadata) {
    html += '<div class="result-metadata">';
    html += '<h3>Expense Summary</h3>';
    html += '<ul class="metadata-list">';
    html += `<li><strong>Operating Unit:</strong> ${metadata.operatingUnit}</li>`;
    html += `<li><strong>Template:</strong> ${metadata.template}</li>`;
    html += `<li><strong>Amount:</strong> $${parseFloat(metadata.amount).toFixed(2)}</li>`;
    html += '</ul>';
    html += '</div>';
  }
  
  // Add helpful note
  html += '<div class="result-note">';
  html += '<p><strong>Next Steps:</strong> Submit your expense report through Oracle iExpense. The system will automatically route it through this approval chain.</p>';
  html += '</div>';
  
  html += '</div>';
  
  elements.resultsContent.innerHTML = html;
  elements.resultsCard.style.display = 'block';
}

/**
 * Display info message (missing information)
 * @param {string} message - Info message
 */
function displayInfoMessage(message) {
  elements.infoContent.innerHTML = `
    <div class="info-message">
      <p>${message}</p>
    </div>
  `;
  elements.infoCard.style.display = 'block';
}

/**
 * Display error message
 * @param {string} message - Error message
 */
function displayErrorMessage(message) {
  elements.errorContent.innerHTML = `
    <div class="error-message">
      <p>${message}</p>
    </div>
  `;
  elements.errorCard.style.display = 'block';
}

/**
 * Hide all result sections
 */
function hideAllResultSections() {
  elements.resultsCard.style.display = 'none';
  elements.errorCard.style.display = 'none';
  elements.infoCard.style.display = 'none';
}

// ============================================================================
// FIELD ERROR HANDLING
// ============================================================================

/**
 * Display field error
 * @param {string} fieldName - Field name
 * @param {string} message - Error message
 */
function displayFieldError(fieldName, message) {
  const errorElement = elements[`error${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`];
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
  
  // Add error class to field
  const field = elements[fieldName];
  if (field) {
    field.classList.add('error');
  }
}

/**
 * Clear field error
 * @param {string} fieldName - Field name
 */
function clearFieldError(fieldName) {
  const errorElement = elements[`error${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`];
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }
  
  // Remove error class from field
  const field = elements[fieldName];
  if (field) {
    field.classList.remove('error');
  }
}

/**
 * Clear all field errors
 */
function clearAllFieldErrors() {
  ['operatingUnit', 'template', 'amount', 'grantFund'].forEach(field => {
    clearFieldError(field);
  });
}

// ============================================================================
// LOADING OVERLAY
// ============================================================================

/**
 * Show loading overlay
 */
function showLoading() {
  elements.loadingOverlay.style.display = 'flex';
  elements.submitBtn.disabled = true;
}

/**
 * Hide loading overlay
 */
function hideLoading() {
  elements.loadingOverlay.style.display = 'none';
  elements.submitBtn.disabled = false;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

/**
 * Scroll to element
 * @param {HTMLElement} element - Element to scroll to
 */
function scrollToElement(element) {
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ============================================================================
// KEYBOARD SHORTCUTS (Optional Enhancement)
// ============================================================================

/**
 * Handle keyboard shortcuts
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeyboardShortcuts(event) {
  // Ctrl/Cmd + Enter to submit form
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    elements.form.dispatchEvent(new Event('submit'));
  }
  
  // Escape to reset form
  if (event.key === 'Escape') {
    handleReset();
  }
}

// Attach keyboard shortcuts
document.addEventListener('keydown', handleKeyboardShortcuts);

// ============================================================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================================================

/**
 * Announce result to screen readers
 * @param {string} message - Message to announce
 */
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// ============================================================================
// PRINT FUNCTIONALITY (Optional Enhancement)
// ============================================================================

/**
 * Print approval chain
 */
function printApprovalChain() {
  if (AppState.lastResult && AppState.lastResult.success) {
    window.print();
  }
}

// Add print button to results (if needed)
function addPrintButton() {
  const printBtn = document.createElement('button');
  printBtn.className = 'btn btn-secondary btn-print';
  printBtn.innerHTML = `
    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 17H19C20.1046 17 21 16.1046 21 15V11C21 9.89543 20.1046 9 19 9H5C3.89543 9 3 9.89543 3 11V15C3 16.1046 3.89543 17 5 17H7M9 21H15C16.1046 21 17 20.1046 17 19V15C17 13.8954 16.1046 13 15 13H9C7.89543 13 7 13.8954 7 15V19C7 20.1046 7.89543 21 9 21ZM17 9V5C17 3.89543 16.1046 3 15 3H9C7.89543 3 7 3.89543 7 5V9H17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    Print
  `;
  printBtn.addEventListener('click', printApprovalChain);
  return printBtn;
}

// ============================================================================
// ERROR BOUNDARY
// ============================================================================

/**
 * Global error handler
 */
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  // Display user-friendly error message
  displayErrorMessage(window.RulesEngine.ERROR_MESSAGES.SYSTEM_ERROR);
  
  // Hide loading if active
  hideLoading();
});

/**
 * Unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  // Display user-friendly error message
  displayErrorMessage(window.RulesEngine.ERROR_MESSAGES.SYSTEM_ERROR);
  
  // Hide loading if active
  hideLoading();
});

// ============================================================================
// APPLICATION STARTUP
// ============================================================================

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// ============================================================================
// EXPORTS (for testing or external use)
// ============================================================================

if (typeof window !== 'undefined') {
  window.ExpenseApp = {
    handleReset,
    collectFormData,
    displayResult,
    formatCurrency,
    AppState
  };
}

// Made with Bob
