# ICA Context Studio Schema Files
## Oracle iExpense Approval Assistant

This directory contains all the schema components needed to build your knowledge base in ICA Context Studio.

---

## 📁 Files Overview

### 1. `01-nodes.json` - Entity Definitions
**Purpose:** Define all nodes (entities) in your knowledge graph

**Contains:**
- ✅ **8 Node Types:**
  - OperatingUnit (CCP, CCH, CCF)
  - ExpenseTemplate (all expense types)
  - ExpenseAmount (monetary values)
  - GrantFund (grant funding indicator)
  - SpecialSubmitter (Karen, Melissa, Damon)
  - ApproverGroup (all approver groups)
  - ApprovalRule (business rules)
  - ApprovalChain (approval sequences)

**Each node includes:**
- Properties with data types
- Validation rules
- Example data
- Descriptions

---

### 2. `02-rules.json` - Business Rules
**Purpose:** Define all 15 approval rules with conditions and actions

**Contains:**
- ✅ **CCP Rules (5):** CCP-1 through CCP-5
- ✅ **CCH Rules (6):** CCH-1 through CCH-6
- ✅ **CCF Rules (4):** CCF-1 through CCF-4

**Each rule includes:**
- Rule ID and name
- Operating unit
- Priority
- Conditions (when to apply)
- Actions (approval chain)
- Metadata

---

### 3. `03-relationships.json` - Entity Relationships
**Purpose:** Define how entities connect to each other

**Contains:**
- ✅ **10 Relationship Types:**
  - HAS_TEMPLATE (OU → Template)
  - APPLIES_TO (Rule → OU)
  - REQUIRES_TEMPLATE (Rule → Template)
  - CHECKS_AMOUNT (Rule → Amount)
  - REQUIRES_GRANT_INFO (Rule → Grant)
  - CHECKS_SUBMITTER (Rule → Submitter)
  - GENERATES_CHAIN (Rule → Chain)
  - INCLUDES_APPROVER (Chain → Approver)
  - BELONGS_TO_OU (Approver → OU)
  - FOLLOWS (Approver → Approver)

**Each relationship includes:**
- Cardinality (1:1, 1:N, N:1, N:N)
- Direction
- Properties
- Examples

---

### 4. `04-sample-data.json` - Test Data
**Purpose:** Provide sample data for testing and validation

**Contains:**
- ✅ **3 Operating Units** with full configuration
- ✅ **10 Test Scenarios** with expected results
- ✅ **12 Approver Groups** with descriptions
- ✅ **3 Special Submitters** with rules
- ✅ **5 Natural Language Queries** with expected responses

**Use for:**
- Schema validation
- Testing rule logic
- Training AI models
- Documentation examples

---

## 🚀 How to Use These Files in ICA Context Studio

### Step 1: Start with a Schema

#### Option A: Upload Sample Data (Recommended for Quick Start)
1. In ICA Context Studio, click **"Upload Sample Data"**
2. Select `04-sample-data.json`
3. ICA will automatically generate schema from the data
4. Review and adjust generated schema
5. Click **"Create Schema"**

#### Option B: Build Schema Manually
1. Click **"Add Node"** for each entity
2. Use `01-nodes.json` as reference
3. Copy properties and examples
4. Repeat for all 8 node types

#### Option C: Upload Complete Schema
1. Combine all files into one schema definition
2. Upload as YAML or JSON
3. Validate structure
4. Save schema

---

## 📋 Step-by-Step Instructions

### Using Upload Sample Data (Easiest Method)

**Step 1: Prepare the File**
```bash
# The file is ready to use: ica-schema/04-sample-data.json
# No modifications needed!
```

**Step 2: Upload to ICA**
1. Open ICA Context Studio
2. Navigate to **"Start with a Schema"**
3. Click **"Upload Sample Data"**
4. Select `04-sample-data.json`
5. Wait for processing (30-60 seconds)

**Step 3: Review Generated Schema**
ICA will automatically create:
- ✅ All 8 node types
- ✅ Properties and data types
- ✅ Relationships between entities
- ✅ Example values

**Step 4: Validate and Save**
1. Review each node type
2. Check relationships
3. Verify examples
4. Click **"Save Schema"**
5. Name it: `iExpense_Approval_Domain`

---

### Adding Nodes Manually

If you prefer to build the schema step-by-step:

#### Add Node: OperatingUnit

1. Click **"Add Node"**
2. Fill in details:
   ```
   Node Name: OperatingUnit
   Node Type: Entity
   Description: Organizational unit in Oracle EBS
   ```
3. Add properties:
   ```
   Property: id
   Type: String
   Required: Yes
   Enum: [CCP, CCH, CCF]
   
   Property: name
   Type: String
   Required: Yes
   
   Property: ou_id
   Type: Integer
   Required: Yes
   ```
4. Add example:
   ```json
   {
     "id": "CCP",
     "name": "Primary Operating Unit",
     "ou_id": 101,
     "mileage_threshold": 1000,
     "requires_dbms": true
   }
   ```
5. Click **"Save Node"**

**Repeat for all 8 node types** using `01-nodes.json` as reference.

---

### Adding Rules

#### Add Rule: CCP-4 (Example)

1. Click **"Add Rule"**
2. Fill in details:
   ```
   Rule ID: CCP-4
   Rule Name: Mileage Low Amount
   Operating Unit: CCP
   Priority: 4
   ```
3. Define conditions:
   ```
   Condition 1:
   - Field: template
   - Operator: equals
   - Value: "CCP Local Mileage Expense"
   
   Condition 2:
   - Field: amount
   - Operator: less_than
   - Value: 1000
   ```
4. Define actions:
   ```
   Action: Generate Approval Chain
   Approvers:
     1. CCP Department Approver
   ```
5. Click **"Save Rule"**

**Repeat for all 15 rules** using `02-rules.json` as reference.

---

### Adding Relationships

#### Add Relationship: HAS_TEMPLATE (Example)

1. Click **"Add Relationship"**
2. Fill in details:
   ```
   Relationship Name: HAS_TEMPLATE
   Type: one-to-many
   Description: Operating Unit has multiple expense templates
   ```
3. Define connection:
   ```
   Source Node: OperatingUnit
   Target Node: ExpenseTemplate
   Cardinality: 1:N
   ```
4. Add example:
   ```
   Source: {id: "CCP"}
   Target: {template_id: "CCP_MILEAGE"}
   ```
5. Click **"Save Relationship"**

**Repeat for all 10 relationships** using `03-relationships.json` as reference.

---

## ✅ Validation Checklist

After building your schema, verify:

### Nodes
- [ ] All 8 node types created
- [ ] Properties defined with correct data types
- [ ] Required fields marked
- [ ] Examples provided
- [ ] Descriptions clear

### Rules
- [ ] All 15 rules created (5 CCP, 6 CCH, 4 CCF)
- [ ] Conditions properly defined
- [ ] Actions specify approval chains
- [ ] Priorities set correctly
- [ ] Metadata included

### Relationships
- [ ] All 10 relationships created
- [ ] Cardinality correct
- [ ] Source and target nodes linked
- [ ] Examples provided
- [ ] Bidirectional where needed

### Sample Data
- [ ] All scenarios have expected outputs
- [ ] Natural language queries included
- [ ] Approver groups defined
- [ ] Special submitters documented

---

## 🧪 Testing Your Schema

### Test Scenario 1: Simple Query
```
Input: CCP Local Mileage, $800
Expected Rule: CCP-4
Expected Output: CCP Department Approver
```

### Test Scenario 2: Complex Query
```
Input: CCH Travel, $6,000, Grant Fund
Expected Rule: CCH-3
Expected Output: 
  1. First Superior
  2. CCH Approvers Greater Than 5k dollars
  3. CCH Grant Fund Approvers Level 1
```

### Test Scenario 3: Special Submitter
```
Input: CCF Standard, $3,000, Submitter: Damon Howell
Expected Rule: CCF-3
Expected Output: CCF Department Approver (Damon skipped)
```

---

## 📊 Schema Statistics

- **Total Nodes:** 8
- **Total Rules:** 15
- **Total Relationships:** 10
- **Sample Scenarios:** 10
- **Approver Groups:** 12
- **Special Submitters:** 3
- **Natural Language Queries:** 5

---

## 🔄 Next Steps After Schema Creation

1. **Create Context** (Step 2)
   - Attach this schema
   - Configure LLM settings
   - Set system prompt

2. **Add Sources & Data** (Step 3)
   - Upload documentation files
   - Upload code files
   - Ingest structured rules

3. **Expose via MCP** (Step 4)
   - Enable MCP server
   - Generate credentials
   - Test integration

---

## 💡 Tips for Success

### Best Practices
- ✅ Start with sample data upload (fastest)
- ✅ Review generated schema carefully
- ✅ Test with provided scenarios
- ✅ Validate all relationships
- ✅ Use clear, descriptive names

### Common Issues
- ❌ Missing required properties → Add them
- ❌ Incorrect data types → Fix in schema
- ❌ Broken relationships → Check node names
- ❌ Invalid examples → Update with correct data

### Optimization
- 🚀 Use batch upload for multiple nodes
- 🚀 Copy-paste from JSON files
- 🚀 Test incrementally
- 🚀 Save frequently

---

## 📚 Reference

### File Formats Supported
- JSON (recommended)
- YAML
- CSV (for simple data)
- Excel (for tabular data)

### Schema Validation
ICA will validate:
- Data types
- Required fields
- Enum values
- Relationships
- Examples

### Error Messages
- **"Invalid property type"** → Check data type matches
- **"Missing required field"** → Add required property
- **"Relationship not found"** → Verify node names
- **"Invalid example"** → Update example data

---

## 🆘 Need Help?

### Resources
- **ICA Documentation:** https://pages.github.ibm.com/guild-of-coding-agents-at-consulting/documentation/
- **Quick Start Guide:** See `ICA_CONTEXT_STUDIO_QUICKSTART.md`
- **Integration Guide:** See `ICA_INTEGRATION_GUIDE.md`

### Support
- **ICA Support:** Slack #ica-support
- **Schema Issues:** Review validation errors
- **Data Issues:** Check sample data format

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-05-14 | Initial schema files created |

---

**Ready to build your schema?** Start with uploading `04-sample-data.json` for the fastest setup! 🚀