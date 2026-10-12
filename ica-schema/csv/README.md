# CSV Files for ICA Context Studio Schema
## Oracle iExpense Approval Assistant

This directory contains CSV files ready to upload to ICA Context Studio for schema generation.

---

## 📁 CSV Files Overview

### 1. **`operating_units.csv`** (3 rows)
**Operating Units in Oracle EBS**
- OU1 (Primary Operating Unit)
- OU2 (Healthcare Unit)
- OU3 (Foundation Unit)

**Columns:**
- `id` - Unit identifier (OU1, OU2, OU3)
- `name` - Full name
- `ou_id` - Oracle OU ID (101, 102, 121)
- `mileage_threshold` - Mileage approval threshold
- `amount_threshold` - Amount approval threshold
- `requires_dbms` - DBMS approval required
- `grant_differentiation` - Grant fund differentiation
- `special_approver` - Special approver name

---

### 2. **`expense_templates.csv`** (9 rows)
**Expense report templates by OU**

**Columns:**
- `template_id` - Unique template ID
- `template_name` - Full template name
- `operating_unit` - Associated OU
- `category` - Template category
- `requires_grant_info` - Grant info required

**Templates:**
- OU1: 4 templates (Mileage, Non-Travel, Travel-Other, Tuition)
- OU2: 4 templates (Travel, Non-Travel, 2 Tuition types)
- OU3: 1 template (Standard)

---

### 3. **`approval_rules.csv`** (15 rows)
**All 15 AME approval rules**

**Columns:**
- `rule_id` - Rule identifier (OU1-1 to OU3-4)
- `rule_name` - Descriptive name
- `operating_unit` - Applicable OU
- `priority` - Rule priority
- `template` - Required template(s)
- `amount_condition` - Amount threshold condition
- `grant_fund` - Grant fund requirement
- `submitter_condition` - Special submitter conditions
- `approver_1` - First approver
- `approver_2` - Second approver (if any)
- `approver_3` - Third approver (if any)

**Rules:**
- OU1: 5 rules
- OU2: 6 rules
- OU3: 4 rules

---

### 4. **`test_scenarios.csv`** (10 rows)
**Test cases with expected results**

**Columns:**
- `scenario_id` - Unique scenario ID
- `description` - Scenario description
- `operating_unit` - OU
- `template` - Expense template
- `amount` - Expense amount
- `currency` - Currency (USD)
- `grant_fund` - Grant funded (true/false)
- `fund_code` - Fund code (if grant)
- `submitter` - Submitter name (if special)
- `expected_rule` - Expected rule to apply
- `expected_approver_1` - Expected first approver
- `expected_approver_2` - Expected second approver
- `expected_approver_3` - Expected third approver

---

### 5. **`approver_groups.csv`** (12 rows)
**All approver groups**

**Columns:**
- `group_id` - Unique group ID
- `group_name` - Full group name
- `operating_unit` - Associated OU(s)
- `description` - Group description
- `sequence_typical` - Typical sequence position

**Groups:**
- OU1: 3 groups
- OU2: 5 groups
- OU3: 2 groups
- Shared: 2 groups (Level 2, SYSADMIN)

---

### 6. **`special_submitters.csv`** (3 rows)
**Submitters with special routing**

**Columns:**
- `submitter_id` - Unique submitter ID
- `name` - Submitter name
- `special_rule` - Description of special rule
- `affected_operating_units` - Which OUs affected
- `affected_templates` - Which templates affected

**Submitters:**
- Special Approver1
- Special Approver2
- Special Approver

---

### 7. **`natural_language_queries.csv`** (5 rows)
**Sample queries for AI training**

**Columns:**
- `query_id` - Unique query ID
- `query_text` - Natural language question
- `expected_operating_unit` - Expected OU extraction
- `expected_template` - Expected template extraction
- `expected_amount` - Expected amount extraction
- `expected_grant_fund` - Expected grant fund extraction
- `expected_rule` - Expected rule to apply
- `expected_response` - Expected AI response

---

## 🚀 How to Upload to ICA Context Studio

### Method 1: Upload All Files Together (Recommended)

1. In ICA Context Studio, go to **"Upload Sample Data"**
2. Click **"Select Multiple Files"** or **"Upload Folder"**
3. Select all 7 CSV files from the `csv/` folder
4. Click **"Upload"**
5. Wait for processing (1-2 minutes)
6. Review generated schema
7. Save as `iExpense_Approval_Domain`

### Method 2: Upload Files One by One

**Upload in this order:**

1. **`operating_units.csv`** - Foundation entities
2. **`expense_templates.csv`** - Template definitions
3. **`approver_groups.csv`** - Approver definitions
4. **`approval_rules.csv`** - Business rules
5. **`special_submitters.csv`** - Special cases
6. **`test_scenarios.csv`** - Test data
7. **`natural_language_queries.csv`** - AI training

**For each file:**
- Click **"Upload Sample Data"**
- Select CSV file
- Wait for validation
- Click **"Next"**

---

## ✅ What ICA Will Generate

### From These CSV Files:

**Entities (Nodes):**
- ✅ OperatingUnit (3 instances)
- ✅ ExpenseTemplate (9 instances)
- ✅ ApprovalRule (15 instances)
- ✅ ApproverGroup (12 instances)
- ✅ SpecialSubmitter (3 instances)
- ✅ TestScenario (10 instances)

**Relationships:**
- ✅ OU → Templates (HAS_TEMPLATE)
- ✅ Rule → OU (APPLIES_TO)
- ✅ Rule → Template (REQUIRES_TEMPLATE)
- ✅ Rule → Approvers (GENERATES_CHAIN)
- ✅ Approver → OU (BELONGS_TO)

---

## 📊 File Statistics

| File | Rows | Columns | Size |
|------|------|---------|------|
| operating_units.csv | 3 | 8 | ~300 bytes |
| expense_templates.csv | 9 | 5 | ~600 bytes |
| approval_rules.csv | 15 | 11 | ~2 KB |
| test_scenarios.csv | 10 | 13 | ~1.5 KB |
| approver_groups.csv | 12 | 5 | ~900 bytes |
| special_submitters.csv | 3 | 5 | ~400 bytes |
| natural_language_queries.csv | 5 | 8 | ~800 bytes |
| **TOTAL** | **57** | **55** | **~6.5 KB** |

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-05-14 | Initial CSV files created |
