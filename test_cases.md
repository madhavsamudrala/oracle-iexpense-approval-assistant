# Oracle iExpense Approval Assistant
## Test Cases

**Version:** 1.0  
**Date:** May 14, 2026  
**Purpose:** Comprehensive test scenarios for all approval rules

---

## TEST EXECUTION SUMMARY

| Category | Total Tests | Status |
|----------|-------------|--------|
| CCP Rules | 12 | ⏳ Pending |
| CCH Rules | 18 | ⏳ Pending |
| CCF Rules | 9 | ⏳ Pending |
| Edge Cases | 8 | ⏳ Pending |
| Error Handling | 6 | ⏳ Pending |
| UI/UX | 5 | ⏳ Pending |
| **TOTAL** | **58** | ⏳ Pending |

---

## TEST CASE FORMAT

Each test case includes:
- **Test ID:** Unique identifier
- **Rule Reference:** Corresponding business rule
- **Description:** What is being tested
- **Preconditions:** Setup requirements
- **Test Data:** Input values
- **Expected Result:** Expected approval chain
- **Priority:** Critical / High / Medium / Low
- **Status:** Pass / Fail / Pending

---

## CCP RULES TEST CASES (OU 101)

### TC-CCP-001: Tuition Expenses - Standard Submitter
**Rule Reference:** CCP-1  
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify tuition expense approval for non-special submitters

**Test Data:**
- Operating Unit: CCP
- Template: CCP Tuition Expenses
- Amount: $1,500
- Submitter: John Doe

**Expected Result:**
1. CCP and CCH Non Nursing Tuition Approvers
2. CCP and CCH Non Nursing Tuition Approvers L2

---

### TC-CCP-002: Tuition Expenses - Karen Martino
**Rule Reference:** CCP-1 (Special Submitter)  
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify different routing for Karen Martino

**Test Data:**
- Operating Unit: CCP
- Template: CCP Tuition Expenses
- Amount: $2,000
- Submitter: Karen Martino

**Expected Result:**
- Undefined scenario message (special routing not defined in rules)

---

### TC-CCP-003: Tuition Expenses - Melissa
**Rule Reference:** CCP-1 (Special Submitter)  
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify different routing for Melissa

**Test Data:**
- Operating Unit: CCP
- Template: CCP Tuition Expenses
- Amount: $1,800
- Submitter: Melissa

**Expected Result:**
- Undefined scenario message (special routing not defined in rules)

---

### TC-CCP-004: Non-Travel Expenses - Standard Amount
**Rule Reference:** CCP-2  
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify non-travel expense approval with DBMS requirement

**Test Data:**
- Operating Unit: CCP
- Template: CCP Non-Travel Expenses
- Amount: $500

**Expected Result:**
1. CCP Department Approver
2. CCP DBMS Approvers

---

### TC-CCP-005: Travel Expenses-Other - Standard Amount
**Rule Reference:** CCP-2  
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify travel expense approval with DBMS requirement

**Test Data:**
- Operating Unit: CCP
- Template: CCP Travel Expenses-Other
- Amount: $750

**Expected Result:**
1. CCP Department Approver
2. CCP DBMS Approvers

---

### TC-CCP-006: Non-Travel Expenses - Zero Amount
**Rule Reference:** CCP-2 (Edge Case)  
**Priority:** High  
**Status:** ⏳ Pending

**Description:** Verify handling of zero amount (should fail validation)

**Test Data:**
- Operating Unit: CCP
- Template: CCP Non-Travel Expenses
- Amount: $0

**Expected Result:**
- Validation error: "Please enter a valid amount greater than $0"

---

### TC-CCP-007: Local Mileage - Below Threshold
**Rule Reference:** CCP-4  
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify local mileage approval for amounts < $1,000

**Test Data:**
- Operating Unit: CCP
- Template: CCP Local Mileage Expense
- Amount: $500

**Expected Result:**
1. CCP Department Approver

---

### TC-CCP-008: Local Mileage - At Threshold
**Rule Reference:** CCP-3  
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify local mileage approval for amount exactly $1,000

**Test Data:**
- Operating Unit: CCP
- Template: CCP Local Mileage Expense
- Amount: $1,000

**Expected Result:**
1. CCP Department Approver
2. CCP DBMS Approvers

---

### TC-CCP-009: Local Mileage - Above Threshold
**Rule Reference:** CCP-3  
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify local mileage approval for amounts > $1,000

**Test Data:**
- Operating Unit: CCP
- Template: CCP Local Mileage Expense
- Amount: $1,500

**Expected Result:**
1. CCP Department Approver
2. CCP DBMS Approvers

---

### TC-CCP-010: Local Mileage - Just Below Threshold
**Rule Reference:** CCP-4  
**Priority:** High  
**Status:** ⏳ Pending

**Description:** Verify boundary condition at $999.99

**Test Data:**
- Operating Unit: CCP
- Template: CCP Local Mileage Expense
- Amount: $999.99

**Expected Result:**
1. CCP Department Approver

---

### TC-CCP-011: Local Mileage - Just Above Threshold
**Rule Reference:** CCP-3  
**Priority:** High  
**Status:** ⏳ Pending

**Description:** Verify boundary condition at $1,000.01

**Test Data:**
- Operating Unit: CCP
- Template: CCP Local Mileage Expense
- Amount: $1,000.01

**Expected Result:**
1. CCP Department Approver
2. CCP DBMS Approvers

---

### TC-CCP-012: Large Amount - Non-Travel
**Rule Reference:** CCP-2  
**Priority:** Medium  
**Status:** ⏳ Pending

**Description:** Verify handling of very large amounts

**Test Data:**
- Operating Unit: CCP
- Template: CCP Non-Travel Expenses
- Amount: $50,000

**Expected Result:**
1. CCP Department Approver
2. CCP DBMS Approvers

---

## CCH RULES TEST CASES (OU 102)

### TC-CCH-001: Grant Fund - Below Threshold
**Rule Reference:** CCH-1  
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify grant-funded expense ≤ $5,000

**Test Data:**
- Operating Unit: CCH
- Template: CCH Non-Travel Expenses
- Amount: $3,000
- Grant Fund: Yes

**Expected Result:**
1. First Superior
2. CCH Grant Fund Approvers Level 1

---

### TC-CCH-002: Non-Grant Fund - Below Threshold
**Rule Reference:** CCH-2  
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify non-grant-funded expense ≤ $5,000

**Test Data:**
- Operating Unit: CCH
- Template: CCH Non-Travel Expenses
- Amount: $3,000
- Grant Fund: No

**Expected Result:**
1. First Superior
2. CCH Non Grant Fund Approvers Level 1

---

### TC-CCH-003: Grant Fund - Above Threshold
**Rule Reference:** CCH-3  
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify grant-funded expense > $5,000

**Test Data:**
- Operating Unit: CCH
- Template: CCH Travel Expenses
- Amount: $7,500
- Grant Fund: Yes

**Expected Result:**
1. First Superior
2. CCH Approvers Greater Than 5k dollars
3. CCH Grant Fund Approvers Level 1

---

### TC-CCH-004: Non-Grant Fund - Above Threshold
**Rule Reference:** CCH-4  
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify non-grant-funded expense > $5,000

**Test Data:**
- Operating Unit: CCH
- Template: CCH Travel Expenses
- Amount: $7,500
- Grant Fund: No

**Expected Result:**
1. First Superior
2. CCH Approvers Greater Than 5k dollars
3. CCH Non Grant Fund Approvers Level 1

---

### TC-CCH-005: Grant Fund - At Threshold
**Rule Reference:** CCH-1  
**Priority:** High  
**Status:** ⏳ Pending

**Description:** Verify grant-funded expense exactly $5,000

**Test Data:**
- Operating Unit: CCH
- Template: CCH Non-Travel Expenses
- Amount: $5,000
- Grant Fund: Yes

**Expected Result:**
1. First Superior
2. CCH Grant Fund Approvers Level 1

---

### TC-CCH-006: Non-Grant Fund - At Threshold
**Rule Reference:** CCH-2  
**Priority:** High  
**Status:** ⏳ Pending

**Description:** Verify non-grant-funded expense exactly $5,000

**Test Data:**
- Operating Unit: CCH
- Template: CCH Non-Travel Expenses
- Amount: $5,000
- Grant Fund: No

**Expected Result:**
1. First Superior
2. CCH Non Grant Fund Approvers Level 1

---

### TC-CCH-007: Grant Fund - Just Above Threshold
**Rule Reference:** CCH-3  
**Priority:** High  
**Status:** ⏳ Pending

**Description:** Verify boundary condition at $5,000.01

**Test Data:**
- Operating Unit: CCH
- Template: CCH Travel Expenses
- Amount: $5,000.01
- Grant Fund: Yes

**Expected Result:**
1. First Superior
2. CCH Approvers Greater Than 5k dollars
3. CCH Grant Fund Approvers Level 1

---

### TC-CCH-008: Non-Grant Fund - Just Below Threshold
**Rule Reference:** CCH-2  
**Priority:** High  
**Status:** ⏳ Pending

**Description:** Verify boundary condition at $4,999.99

**Test Data:**
- Operating Unit: CCH
- Template: CCH Non-Travel Expenses
- Amount: $4,999.99
- Grant Fund: No

**Expected Result:**
1. First Superior
2. CCH Non Grant Fund Approvers Level 1

---

### TC-CCH-009: Non-Nursing Tuition - Standard Submitter
**Rule Reference:** CCH-5  
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify non-nursing tuition approval

**Test Data:**
- Operating Unit: CCH
- Template: CCH Non-Nursing Tuition
- Amount: $2,500
- Submitter: Jane Smith

**Expected Result:**
1. CCP and CCH Non Nursing Tuition Approvers
2. CCP and CCH Non Nursing Tuition Approvers L2

---

### TC-CCH-010: Non-Nursing Tuition - Karen Martino
**Rule Reference:** CCH-5 (Special Submitter)  
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify different routing for Karen Martino

**Test Data:**
- Operating Unit: CCH
- Template: CCH Non-Nursing Tuition
- Amount: $2,500
- Submitter: Karen Martino

**Expected Result:**
- Undefined scenario message (special routing not defined in rules)

---

### TC-CCH-011: Non-Nursing Tuition - Melissa
**Rule Reference:** CCH-5 (Special Submitter)  
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify different routing for Melissa

**Test Data:**
- Operating Unit: CCH
- Template: CCH Non-Nursing Tuition
- Amount: $2,500
- Submitter: Melissa

**Expected Result:**
- Undefined scenario message (special routing not defined in rules)

---

### TC-CCH-012: Nursing Tuition - Self Approval
**Rule Reference:** CCH-6  
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify nursing tuition self-approval

**Test Data:**
- Operating Unit: CCH
- Template: CCH Nursing Tuition
- Amount: $3,000

**Expected Result:**
1. CCH Nursing Tuition Self Approval group

---

### TC-CCH-013: Missing Grant Fund Information
**Rule Reference:** Validation  
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify validation when grant fund status is missing

**Test Data:**
- Operating Unit: CCH
- Template: CCH Travel Expenses
- Amount: $4,000
- Grant Fund: (not provided)

**Expected Result:**
- Info message: "Is this expense charged to a grant fund (42000 or 41235)?"

---

### TC-CCH-014: Travel Expenses - Small Grant Amount
**Rule Reference:** CCH-1  
**Priority:** Medium  
**Status:** ⏳ Pending

**Description:** Verify small grant-funded travel expense

**Test Data:**
- Operating Unit: CCH
- Template: CCH Travel Expenses
- Amount: $250
- Grant Fund: Yes

**Expected Result:**
1. First Superior
2. CCH Grant Fund Approvers Level 1

---

### TC-CCH-015: Travel Expenses - Large Non-Grant Amount
**Rule Reference:** CCH-4  
**Priority:** Medium  
**Status:** ⏳ Pending

**Description:** Verify large non-grant-funded travel expense

**Test Data:**
- Operating Unit: CCH
- Template: CCH Travel Expenses
- Amount: $15,000
- Grant Fund: No

**Expected Result:**
1. First Superior
2. CCH Approvers Greater Than 5k dollars
3. CCH Non Grant Fund Approvers Level 1

---

### TC-CCH-016: Non-Travel - Grant Fund Code 42000
**Rule Reference:** CCH-1  
**Priority:** Medium  
**Status:** ⏳ Pending

**Description:** Verify grant fund recognition with code 42000

**Test Data:**
- Operating Unit: CCH
- Template: CCH Non-Travel Expenses
- Amount: $2,000
- Grant Fund: Yes (42000)

**Expected Result:**
1. First Superior
2. CCH Grant Fund Approvers Level 1

---

### TC-CCH-017: Non-Travel - Grant Fund Code 41235
**Rule Reference:** CCH-1  
**Priority:** Medium  
**Status:** ⏳ Pending

**Description:** Verify grant fund recognition with code 41235

**Test Data:**
- Operating Unit: CCH
- Template: CCH Non-Travel Expenses
- Amount: $2,000
- Grant Fund: Yes (41235)

**Expected Result:**
1. First Superior
2. CCH Grant Fund Approvers Level 1

---

### TC-CCH-018: Nursing Tuition - Large Amount
**Rule Reference:** CCH-6  
**Priority:** Medium  
**Status:** ⏳ Pending

**Description:** Verify nursing tuition self-approval for large amounts

**Test Data:**
- Operating Unit: CCH
- Template: CCH Nursing Tuition
- Amount: $10,000

**Expected Result:**
1. CCH Nursing Tuition Self Approval group

---

## CCF RULES TEST CASES (OU 121)

### TC-CCF-001: Standard Expense - Below Threshold
**Rule Reference:** CCF-1  
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify standard expense < $2,000

**Test Data:**
- Operating Unit: CCF
- Template: CCF Standard Expense
- Amount: $1,500

**Expected Result:**
1. CCF Department Approver

---

### TC-CCF-002: Standard Expense - At Threshold
**Rule Reference:** CCF-2  
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify standard expense exactly $2,000

**Test Data:**
- Operating Unit: CCF
- Template: CCF Standard Expense
- Amount: $2,000

**Expected Result:**
1. CCF Department Approver
2. Damon Howell

---

### TC-CCF-003: Standard Expense - Above Threshold
**Rule Reference:** CCF-2  
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify standard expense > $2,000

**Test Data:**
- Operating Unit: CCF
- Template: CCF Standard Expense
- Amount: $3,500

**Expected Result:**
1. CCF Department Approver
2. Damon Howell

---

### TC-CCF-004: Standard Expense - Just Below Threshold
**Rule Reference:** CCF-1  
**Priority:** High  
**Status:** ⏳ Pending

**Description:** Verify boundary condition at $1,999.99

**Test Data:**
- Operating Unit: CCF
- Template: CCF Standard Expense
- Amount: $1,999.99

**Expected Result:**
1. CCF Department Approver

---

### TC-CCF-005: Standard Expense - Just Above Threshold
**Rule Reference:** CCF-2  
**Priority:** High  
**Status:** ⏳ Pending

**Description:** Verify boundary condition at $2,000.01

**Test Data:**
- Operating Unit: CCF
- Template: CCF Standard Expense
- Amount: $2,000.01

**Expected Result:**
1. CCF Department Approver
2. Damon Howell

---

### TC-CCF-006: Damon's Submission - Below Threshold
**Rule Reference:** CCF-3  
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify Damon Howell's own submission < $2,000

**Test Data:**
- Operating Unit: CCF
- Template: CCF Standard Expense
- Amount: $1,500
- Submitter: Damon Howell

**Expected Result:**
1. CCF Department Approver
(Damon is skipped)

---

### TC-CCF-007: Damon's Submission - Above Threshold
**Rule Reference:** CCF-3  
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify Damon Howell's own submission ≥ $2,000

**Test Data:**
- Operating Unit: CCF
- Template: CCF Standard Expense
- Amount: $3,000
- Submitter: Damon Howell

**Expected Result:**
1. CCF Department Approver
(Damon is skipped even though amount ≥ $2,000)

---

### TC-CCF-008: Large Amount - Standard Submitter
**Rule Reference:** CCF-2  
**Priority:** Medium  
**Status:** ⏳ Pending

**Description:** Verify handling of very large amounts

**Test Data:**
- Operating Unit: CCF
- Template: CCF Standard Expense
- Amount: $25,000

**Expected Result:**
1. CCF Department Approver
2. Damon Howell

---

### TC-CCF-009: Small Amount - Standard Submitter
**Rule Reference:** CCF-1  
**Priority:** Medium  
**Status:** ⏳ Pending

**Description:** Verify handling of very small amounts

**Test Data:**
- Operating Unit: CCF
- Template: CCF Standard Expense
- Amount: $50

**Expected Result:**
1. CCF Department Approver

---

## EDGE CASES & SPECIAL SCENARIOS

### TC-EDGE-001: Decimal Amount - Precise Calculation
**Priority:** High  
**Status:** ⏳ Pending

**Description:** Verify handling of decimal amounts

**Test Data:**
- Operating Unit: CCP
- Template: CCP Local Mileage Expense
- Amount: $999.99

**Expected Result:**
1. CCP Department Approver

---

### TC-EDGE-002: Very Large Amount
**Priority:** Medium  
**Status:** ⏳ Pending

**Description:** Verify handling of extremely large amounts

**Test Data:**
- Operating Unit: CCH
- Template: CCH Travel Expenses
- Amount: $100,000
- Grant Fund: No

**Expected Result:**
1. First Superior
2. CCH Approvers Greater Than 5k dollars
3. CCH Non Grant Fund Approvers Level 1

---

### TC-EDGE-003: Special Character in Submitter Name
**Priority:** Low  
**Status:** ⏳ Pending

**Description:** Verify handling of special characters

**Test Data:**
- Operating Unit: CCF
- Template: CCF Standard Expense
- Amount: $1,500
- Submitter: O'Brien, Mary-Jane

**Expected Result:**
1. CCF Department Approver

---

### TC-EDGE-004: Case Insensitive Submitter Matching
**Priority:** High  
**Status:** ⏳ Pending

**Description:** Verify case-insensitive special submitter detection

**Test Data:**
- Operating Unit: CCF
- Template: CCF Standard Expense
- Amount: $2,500
- Submitter: DAMON HOWELL

**Expected Result:**
1. CCF Department Approver
(Damon should be recognized regardless of case)

---

### TC-EDGE-005: Partial Name Matching - Damon
**Priority:** High  
**Status:** ⏳ Pending

**Description:** Verify partial name matching for Damon

**Test Data:**
- Operating Unit: CCF
- Template: CCF Standard Expense
- Amount: $2,500
- Submitter: Damon

**Expected Result:**
1. CCF Department Approver
(Should recognize "Damon" as Damon Howell)

---

### TC-EDGE-006: Whitespace in Input
**Priority:** Medium  
**Status:** ⏳ Pending

**Description:** Verify handling of extra whitespace

**Test Data:**
- Operating Unit: CCP
- Template: "  CCP Local Mileage Expense  "
- Amount: "  1500  "

**Expected Result:**
1. CCP Department Approver
2. CCP DBMS Approvers

---

### TC-EDGE-007: Template Name Variation
**Priority:** Medium  
**Status:** ⏳ Pending

**Description:** Verify exact template name matching

**Test Data:**
- Operating Unit: CCP
- Template: CCP Local Mileage (incorrect)
- Amount: $1,500

**Expected Result:**
- Validation error or undefined scenario

---

### TC-EDGE-008: Multiple Special Submitters Same OU
**Priority:** Low  
**Status:** ⏳ Pending

**Description:** Verify handling when multiple special submitters exist

**Test Data:**
- Operating Unit: CCP
- Template: CCP Tuition Expenses
- Amount: $2,000
- Submitter: Karen Martino

**Expected Result:**
- Undefined scenario (special routing not defined)

---

## ERROR HANDLING TEST CASES

### TC-ERROR-001: Missing Operating Unit
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify validation when OU is not selected

**Test Data:**
- Operating Unit: (not selected)
- Template: (any)
- Amount: $1,000

**Expected Result:**
- Info message: "Please specify which operating unit: CCP, CCH, or CCF"

---

### TC-ERROR-002: Missing Template
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify validation when template is not selected

**Test Data:**
- Operating Unit: CCP
- Template: (not selected)
- Amount: $1,000

**Expected Result:**
- Info message: "Please select an expense template"

---

### TC-ERROR-003: Missing Amount
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify validation when amount is not provided

**Test Data:**
- Operating Unit: CCP
- Template: CCP Local Mileage Expense
- Amount: (not provided)

**Expected Result:**
- Info message: "Please enter the total expense amount"

---

### TC-ERROR-004: Negative Amount
**Priority:** High  
**Status:** ⏳ Pending

**Description:** Verify validation for negative amounts

**Test Data:**
- Operating Unit: CCP
- Template: CCP Local Mileage Expense
- Amount: -$500

**Expected Result:**
- Validation error: "Please enter a valid amount greater than $0"

---

### TC-ERROR-005: Non-Numeric Amount
**Priority:** High  
**Status:** ⏳ Pending

**Description:** Verify validation for non-numeric input

**Test Data:**
- Operating Unit: CCP
- Template: CCP Local Mileage Expense
- Amount: "ABC"

**Expected Result:**
- Validation error: "Please enter a valid amount greater than $0"

---

### TC-ERROR-006: System Error Simulation
**Priority:** Critical  
**Status:** ⏳ Pending

**Description:** Verify standard error message for system failures

**Test Data:**
- Simulate JavaScript error during rule evaluation

**Expected Result:**
- Error message: "Approval information is temporarily unavailable due to a system issue. Please try again later."

---

## UI/UX TEST CASES

### TC-UI-001: Template Dropdown Population
**Priority:** High  
**Status:** ⏳ Pending

**Description:** Verify templates populate correctly when OU is selected

**Test Steps:**
1. Select CCP as Operating Unit
2. Verify template dropdown is enabled
3. Verify CCP templates are displayed

**Expected Result:**
- Template dropdown shows: CCP Tuition Expenses, CCP Non-Travel Expenses, CCP Travel Expenses-Other, CCP Local Mileage Expense

---

### TC-UI-002: Grant Fund Field Visibility
**Priority:** High  
**Status:** ⏳ Pending

**Description:** Verify grant fund field appears only for CCH travel/non-travel

**Test Steps:**
1. Select CCH as Operating Unit
2. Select "CCH Travel Expenses" template
3. Verify grant fund radio buttons appear

**Expected Result:**
- Grant fund field is visible and required

---

### TC-UI-003: Submitter Field Visibility
**Priority:** Medium  
**Status:** ⏳ Pending

**Description:** Verify submitter field appears for appropriate templates

**Test Steps:**
1. Select CCF as Operating Unit
2. Verify submitter name field appears

**Expected Result:**
- Submitter name field is visible

---

### TC-UI-004: Form Reset Functionality
**Priority:** Medium  
**Status:** ⏳ Pending

**Description:** Verify reset button clears all fields

**Test Steps:**
1. Fill out complete form
2. Click Reset button
3. Verify all fields are cleared

**Expected Result:**
- All form fields reset to default state
- Results section hidden

---

### TC-UI-005: Responsive Design - Mobile
**Priority:** Medium  
**Status:** ⏳ Pending

**Description:** Verify application works on mobile devices

**Test Steps:**
1. Open application on mobile device (or use browser dev tools)
2. Verify layout adapts to small screen
3. Test form submission

**Expected Result:**
- Layout is responsive
- All functionality works on mobile

---

## REGRESSION TEST SUITE

### Critical Path Tests (Must Pass)
1. TC-CCP-001, TC-CCP-004, TC-CCP-007, TC-CCP-008
2. TC-CCH-001, TC-CCH-002, TC-CCH-003, TC-CCH-004, TC-CCH-012
3. TC-CCF-001, TC-CCF-002, TC-CCF-006
4. TC-ERROR-001, TC-ERROR-002, TC-ERROR-003

### Smoke Test Suite (Quick Validation)
1. One test from each OU (CCP, CCH, CCF)
2. One boundary test
3. One error handling test

---

## TEST EXECUTION INSTRUCTIONS

### Manual Testing
1. Open `index.html` in a web browser
2. For each test case:
   - Enter the test data as specified
   - Click "Get Approval Chain"
   - Verify the result matches expected output
   - Mark test as Pass/Fail
3. Document any discrepancies

### Automated Testing (Future)
- Unit tests for rules_engine.js functions
- Integration tests for form submission
- E2E tests using Playwright or Cypress

---

## DEFECT REPORTING TEMPLATE

**Defect ID:** DEF-XXX  
**Test Case:** TC-XXX-XXX  
**Severity:** Critical / High / Medium / Low  
**Description:** Brief description of the issue  
**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:** What should happen  
**Actual Result:** What actually happened  
**Screenshots:** (if applicable)  
**Environment:** Browser, OS, Version

---

## TEST METRICS

### Coverage Metrics
- **Rule Coverage:** 100% (All 15 rules covered)
- **Boundary Testing:** 100% (All thresholds tested)
- **Special Submitters:** 100% (All 3 special submitters tested)
- **Error Scenarios:** 100% (All error types covered)

### Quality Metrics
- **Pass Rate Target:** ≥ 95%
- **Critical Test Pass Rate:** 100%
- **Defect Density:** < 1 defect per 10 test cases

---

## SIGN-OFF

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Test Lead | | | |
| Business Analyst | | | |
| Developer | | | |
| QA Manager | | | |

---

**END OF TEST CASES DOCUMENT**