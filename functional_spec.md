# Oracle iExpense Approval Assistant
## Functional Specification

**Version:** 1.0  
**Date:** May 14, 2026  
**Author:** Bob - Oracle EBS Consultant  
**Status:** Production Ready

---

## 1. EXECUTIVE SUMMARY

### 1.1 Purpose
The Oracle iExpense Approval Assistant is a web-based decision support tool that helps employees determine the approval chain for their expense reports before submission. The assistant implements Oracle Approval Management Engine (AME) business rules for three Operating Units without requiring database access or backend integration.

### 1.2 Business Value
- **Reduces submission errors** by providing approval visibility upfront
- **Improves user experience** with instant, accurate approval chain information
- **Decreases administrative overhead** by answering common approval questions
- **Ensures compliance** with organizational approval policies
- **Provides 24/7 availability** without system dependencies

### 1.3 Scope
**In Scope:**
- Approval chain determination for OU1 (OU 101), OU2 (OU 102), and OU3 (OU 121)
- Rule-based routing logic for all expense templates
- Amount threshold evaluation
- Grant vs. Non-Grant fund differentiation (OU2)
- Special submitter handling
- Professional user interface with responsive design

**Out of Scope:**
- Expense report submission
- Reimbursement calculations
- Database integration
- Workflow execution
- Payment processing
- Rate schedule management

---

## 2. BUSINESS CONTEXT

### 2.1 Operating Units

| Operating Unit | OU ID | Description |
|----------------|-------|-------------|
| OU1 | 101 | Primary operating unit with DBMS approval requirements |
| OU2 | 102 | Healthcare unit with grant/non-grant fund differentiation |
| OU3 | 121 | Foundation unit with simplified approval structure |

### 2.2 Approval Management Engine (AME)
The assistant replicates AME approval logic using client-side JavaScript, ensuring:
- Deterministic rule evaluation
- Consistent approval chain results
- Audit trail capability
- No external dependencies

---

## 3. USER PERSONAS

### 3.1 Primary Users

#### Employee (Expense Submitter)
- **Goal:** Understand who will approve their expense before submission
- **Pain Points:** Uncertainty about approval chains, delayed submissions
- **Needs:** Quick, accurate approval information

#### Department Manager
- **Goal:** Help team members submit expenses correctly
- **Pain Points:** Answering repetitive approval questions
- **Needs:** Reference tool to share with team

#### Expense Administrator
- **Goal:** Reduce support tickets and submission errors
- **Pain Points:** High volume of "who approves this?" questions
- **Needs:** Self-service tool for employees

---

## 4. USE CASES

### 4.1 UC-001: Determine Standard Approval Chain

**Actor:** Employee  
**Preconditions:** User knows OU, template, and amount  
**Main Flow:**
1. User selects Operating Unit (OU1, OU2, or OU3)
2. User selects or enters Expense Template
3. User enters Total Amount
4. User provides additional information if required (grant fund, submitter name)
5. System evaluates rules and displays approval chain
6. User reviews approval chain

**Postconditions:** User knows who will approve their expense  
**Success Criteria:** Correct approval chain displayed in < 2 seconds

---

### 4.2 UC-002: Handle Missing Information

**Actor:** Employee  
**Preconditions:** User provides incomplete information  
**Main Flow:**
1. User submits partial information
2. System identifies missing required fields
3. System displays clear prompt for missing information
4. User provides additional information
5. System evaluates rules and displays approval chain

**Postconditions:** User understands what information is needed  
**Success Criteria:** Clear, non-technical prompts guide user to completion

---

### 4.3 UC-003: Grant Fund Differentiation (OU2 Only)

**Actor:** OU2 Employee  
**Preconditions:** User is submitting OU2 expense  
**Main Flow:**
1. User selects OU2 as Operating Unit
2. User selects travel or non-travel template
3. User enters amount
4. System prompts for grant fund status
5. User indicates if expense is grant-funded (42000 or 41235)
6. System applies appropriate approval chain based on grant status

**Postconditions:** Correct approval chain for grant or non-grant expense  
**Success Criteria:** Grant fund question appears only for OU2 expenses

---

### 4.4 UC-004: Special Submitter Handling

**Actor:** Special Submitter (Special Approver1, Special Approver2, Special Approver)  
**Preconditions:** User is a special submitter with different routing  
**Main Flow:**
1. User enters their name or is identified
2. System recognizes special submitter status
3. System applies modified approval rules
4. System displays appropriate approval chain

**Postconditions:** Special routing rules applied correctly  
**Success Criteria:** 
- Special Approver1/Special Approver2: Different tuition routing
- Special Approver: Skipped in OU3 approval chain

---

### 4.5 UC-005: Handle Rate Information Requests

**Actor:** Employee  
**Preconditions:** User asks about mileage or per diem rates  
**Main Flow:**
1. User asks about reimbursement rates
2. System recognizes rate-related question
3. System provides reference links (DOD mileage, GSA per diem)
4. System refocuses user on approval chain determination

**Postconditions:** User directed to official rate sources  
**Success Criteria:** User receives helpful references without calculations

---

### 4.6 UC-006: System Error Handling

**Actor:** Employee  
**Preconditions:** System encounters processing error  
**Main Flow:**
1. User submits expense information
2. System encounters error during rule evaluation
3. System displays standard error message
4. User is informed to try again later

**Postconditions:** User sees professional error message  
**Success Criteria:** No technical details exposed to user

---

## 5. USER STORIES

### 5.1 Epic: Approval Chain Determination

#### Story 1: OU1 Employee - Local Mileage
**As a** OU1 employee  
**I want to** know who approves my local mileage expense  
**So that** I can submit my expense with confidence

**Acceptance Criteria:**
- Given I select OU1 and "Local Mileage" template
- When I enter an amount < $1,000
- Then I see: OU1 Department Approver only
- When I enter an amount ≥ $1,000
- Then I see: OU1 Department Approver, then OU1 DBMS Approvers

---

#### Story 2: OU2 Employee - Grant-Funded Travel
**As a** OU2 employee with grant-funded travel  
**I want to** understand my approval chain based on grant status  
**So that** I can ensure proper fund allocation

**Acceptance Criteria:**
- Given I select OU2 and "Travel Expenses"
- When I indicate grant fund (42000 or 41235) and amount ≤ $5,000
- Then I see: First Superior, then OU2 Grant Fund Approvers Level 1
- When amount > $5,000
- Then I see: First Superior, OU2 Approvers Greater Than 5k, OU2 Grant Fund Approvers Level 1

---

#### Story 3: OU3 Employee - Standard Expense
**As a** OU3 employee  
**I want to** know if Special Approver will approve my expense  
**So that** I can plan my submission timing

**Acceptance Criteria:**
- Given I select OU3 and enter amount < $2,000
- Then I see: OU3 Department Approver only
- When amount ≥ $2,000
- Then I see: OU3 Department Approver, then Special Approver

---

#### Story 4: Tuition Expense Submitter
**As an** employee submitting tuition expenses  
**I want to** know the specialized approval chain  
**So that** I can submit educational reimbursement correctly

**Acceptance Criteria:**
- Given I select OU1 or OU2 and "Tuition" template
- When I am NOT Special Approver1 or Special Approver2
- Then I see: OU1 and OU2 Non Nursing Tuition Approvers, then Level 2 Approvers
- When template is "OU2 Nursing Tuition"
- Then I see: OU2 Nursing Tuition Self Approval group

---

### 5.2 Epic: User Experience

#### Story 5: Mobile User
**As a** mobile user  
**I want to** access the assistant on my phone  
**So that** I can check approvals while traveling

**Acceptance Criteria:**
- Interface is fully responsive on mobile devices
- All form fields are easily tappable
- Results are readable without zooming
- Page loads in < 3 seconds on 4G connection

---

#### Story 6: First-Time User
**As a** first-time user  
**I want to** understand how to use the assistant  
**So that** I can get approval information quickly

**Acceptance Criteria:**
- Clear instructions visible on page load
- Form fields have helpful placeholders
- Tooltips explain complex fields (grant fund)
- Example scenarios provided

---

## 6. FUNCTIONAL REQUIREMENTS

### 6.1 Core Functionality

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-001 | Support all three Operating Units (OU1, OU2, OU3) | Must Have | All OU rules implemented correctly |
| FR-002 | Evaluate amount thresholds accurately | Must Have | Correct approval chain for all threshold scenarios |
| FR-003 | Differentiate grant vs. non-grant funds (OU2) | Must Have | Proper routing based on fund codes 42000, 41235 |
| FR-004 | Handle special submitters (Special Approver1, Special Approver2, Special Approver) | Must Have | Modified routing applied correctly |
| FR-005 | Display approval chains in order | Must Have | Sequential approver list with clear numbering |
| FR-006 | Provide missing information prompts | Must Have | Clear, actionable prompts for incomplete data |
| FR-007 | Handle SYSADMIN routing scenarios | Must Have | Automatic routing message when no dept approver |
| FR-008 | Support all expense templates per OU | Must Have | All templates from rules document implemented |

### 6.2 User Interface Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| UI-001 | Responsive design (mobile, tablet, desktop) | Must Have | Functional on all screen sizes |
| UI-002 | Professional, business-appropriate styling | Must Have | Clean, corporate design aesthetic |
| UI-003 | Clear form labels and instructions | Must Have | No ambiguous field names |
| UI-004 | Accessible color contrast | Must Have | WCAG 2.1 AA compliance |
| UI-005 | Loading indicators for processing | Should Have | Visual feedback during rule evaluation |
| UI-006 | Print-friendly approval chain output | Should Have | Clean print layout |
| UI-007 | Template autocomplete/suggestions | Nice to Have | Easier template selection |

### 6.3 Error Handling Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| EH-001 | Standard error message for system failures | Must Have | "Approval information is temporarily unavailable..." |
| EH-002 | No technical details in error messages | Must Have | No stack traces, URLs, or system info exposed |
| EH-003 | Graceful degradation | Must Have | System remains functional with partial data |
| EH-004 | Input validation | Must Have | Prevent invalid data submission |
| EH-005 | Clear validation error messages | Must Have | User understands what to fix |

### 6.4 Performance Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| PF-001 | Rule evaluation < 2 seconds | Must Have | Instant response for standard queries |
| PF-002 | Page load < 3 seconds | Must Have | Fast initial load time |
| PF-003 | No backend dependencies | Must Have | Fully client-side operation |
| PF-004 | Works offline after initial load | Should Have | Service worker caching |

---

## 7. BUSINESS RULES SUMMARY

### 7.1 OU1 Rules (OU 101)

| Rule | Template | Condition | Approval Chain |
|------|----------|-----------|----------------|
| OU1-1 | Tuition Expenses | Not Special Approver1/Special Approver2 | Non Nursing Tuition Approvers → L2 |
| OU1-2 | Non-Travel / Travel-Other | Amount > $0 | Dept Approver → DBMS Approvers |
| OU1-3 | Local Mileage | Amount ≥ $1,000 | Dept Approver → DBMS Approvers |
| OU1-4 | Local Mileage | Amount < $1,000 | Dept Approver |
| OU1-5 | Any | No dept approver | SYSADMIN (automatic) |

### 7.2 OU2 Rules (OU 102)

| Rule | Template | Amount | Grant Fund | Approval Chain |
|------|----------|--------|------------|----------------|
| OU2-1 | Travel/Non-Travel | ≤ $5,000 | Yes | First Superior → Grant Fund Approvers L1 |
| OU2-2 | Travel/Non-Travel | ≤ $5,000 | No | First Superior → Non Grant Fund Approvers L1 |
| OU2-3 | Travel/Non-Travel | > $5,000 | Yes | First Superior → Approvers >5k → Grant Fund Approvers L1 |
| OU2-4 | Travel/Non-Travel | > $5,000 | No | First Superior → Approvers >5k → Non Grant Fund Approvers L1 |
| OU2-5 | Non-Nursing Tuition | Not Special Approver1/Special Approver2 | Non Nursing Tuition Approvers → L2 |
| OU2-6 | Nursing Tuition | Any | Nursing Tuition Self Approval |

### 7.3 OU3 Rules (OU 121)

| Rule | Condition | Approval Chain |
|------|-----------|----------------|
| OU3-1 | Amount < $2,000, Not Special Approver | OU3 Dept Approver |
| OU3-2 | Amount ≥ $2,000, Not Special Approver | OU3 Dept Approver → Special Approver |
| OU3-3 | Submitter is Special Approver | OU3 Dept Approver (Special Approver skipped) |
| OU3-4 | No dept approver | SYSADMIN (automatic) |

---

## 8. NON-FUNCTIONAL REQUIREMENTS

### 8.1 Usability
- Interface must be intuitive for non-technical users
- No training required for basic usage
- Clear error messages and guidance
- Professional, business-appropriate tone

### 8.2 Reliability
- 99.9% uptime (client-side, no server dependencies)
- Consistent rule evaluation results
- No data loss during session

### 8.3 Security
- No sensitive data storage
- No authentication required (informational tool)
- No PII collection
- HTTPS deployment recommended

### 8.4 Maintainability
- Well-documented code
- Modular rule engine design
- Easy rule updates without code changes
- Version control integration

### 8.5 Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- No plugins or extensions required

---

## 9. CONSTRAINTS

### 9.1 Technical Constraints
- Must be fully client-side (no backend)
- No database access
- No external API calls
- JavaScript-based rule engine

### 9.2 Business Constraints
- Rules must match production AME configuration
- No expense submission capability
- No calculation or rate determination
- Informational tool only

### 9.3 Regulatory Constraints
- Must not expose internal system details
- Must provide accurate approval information
- Must handle errors gracefully

---

## 10. ASSUMPTIONS

1. Users have basic knowledge of their expense type
2. Users know their Operating Unit
3. Expense templates are standardized across organization
4. AME rules are stable and documented
5. Users have internet access for initial page load
6. Modern browser with JavaScript enabled

---

## 11. DEPENDENCIES

### 11.1 External Dependencies
- None (fully self-contained)

### 11.2 Internal Dependencies
- Business rules documentation (001_Oracle iExpense Approval Assistant.md)
- Error handling policy (002_iExpense Approval Assistant - Error Handling & Policy.md)

---

## 12. SUCCESS METRICS

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| User Adoption | 80% of employees use tool before submission | Usage analytics |
| Accuracy | 100% correct approval chains | Rule validation testing |
| Response Time | < 2 seconds for rule evaluation | Performance monitoring |
| Error Rate | < 1% system errors | Error logging |
| User Satisfaction | > 4.5/5 rating | User surveys |
| Support Ticket Reduction | 50% decrease in approval questions | Help desk metrics |

---

## 13. ACCEPTANCE CRITERIA

### 13.1 Functional Acceptance
- [ ] All OU1 rules (OU1-1 through OU1-5) implemented and tested
- [ ] All OU2 rules (OU2-1 through OU2-6) implemented and tested
- [ ] All OU3 rules (OU3-1 through OU3-4) implemented and tested
- [ ] Grant fund differentiation working correctly
- [ ] Special submitter handling verified
- [ ] Amount thresholds evaluated accurately
- [ ] SYSADMIN routing scenarios handled

### 13.2 User Experience Acceptance
- [ ] Responsive design works on mobile, tablet, desktop
- [ ] Form validation provides clear feedback
- [ ] Approval chains display in correct order
- [ ] Professional styling and branding
- [ ] Accessible to users with disabilities

### 13.3 Quality Acceptance
- [ ] All test cases pass (happy path, edge cases, errors)
- [ ] No console errors in browser
- [ ] Code is documented and maintainable
- [ ] Performance targets met
- [ ] Error handling tested and verified

---

## 14. FUTURE ENHANCEMENTS

### Phase 2 Considerations
- Multi-language support
- Integration with Oracle EBS (read-only)
- Email approval chain to user
- Historical approval chain lookup
- Mobile app version
- Voice interface integration
- Analytics dashboard for administrators

---

## 15. GLOSSARY

| Term | Definition |
|------|------------|
| AME | Approval Management Engine - Oracle's approval workflow system |
| OU | Operating Unit - Organizational division in Oracle EBS |
| DBMS | Database Management System - Specific approval group in OU1 |
| Grant Fund | Research or project-specific funding (codes 42000, 41235) |
| First Superior | Employee's direct manager in organizational hierarchy |
| SYSADMIN | System administrator - fallback approver when no dept approver exists |
| Template | Expense report type/category in Oracle iExpense |

---

## 16. APPROVAL SIGN-OFF

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Business Owner | | | |
| Expense Administrator | | | |
| IT Manager | | | |
| Compliance Officer | | | |

---

**Document Version History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-05-14 | Bob | Initial functional specification |

---

**END OF FUNCTIONAL SPECIFICATION**
