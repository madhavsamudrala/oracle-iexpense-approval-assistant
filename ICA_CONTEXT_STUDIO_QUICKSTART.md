# ICA Context Studio Quick Start Guide
## Oracle iExpense Approval Assistant Integration

**Version:** 1.0  
**Date:** May 14, 2026  
**Purpose:** Step-by-step guide following ICA Context Studio's 4-step workflow

---

## 🎯 Overview

ICA Context Studio uses a **4-step workflow** to set up your AI-powered assistant:

1. **Start with a Schema** - Define the structure of your data
2. **Create a Context** - Organize your knowledge for AI use
3. **Add Sources & Data** - Bring your content into the context
4. **Expose via MCP** - Make your context accessible

Let's walk through each step for your iExpense Approval Assistant.

---

## Step 1: Start with a Schema

### Purpose
Define the structure of your data - this includes methods, industry knowledge, and domain expertise.

### What is a Schema?
A schema defines:
- **Data structure** - How your information is organized
- **Entities** - Key concepts (Operating Units, Templates, Amounts)
- **Relationships** - How entities connect
- **Business rules** - Logic and constraints

### For iExpense Approval Assistant

#### 1.1 Define Your Schema Structure

**Schema Name:** `iExpense_Approval_Domain`

**Key Components:**

```yaml
# Schema Definition
schema:
  name: iExpense_Approval_Domain
  version: 1.0
  industry: Enterprise_Resource_Planning
  domain: Expense_Management
  method: Rule_Based_Approval_Routing

# Core Entities
entities:
  - OperatingUnit (OU1, OU2, OU3)
  - ExpenseTemplate (Travel, Mileage, Tuition, etc.)
  - ExpenseAmount (numeric, USD)
  - GrantFund (boolean, OU2 only)
  - SpecialSubmitter (text, specific names)
  - ApprovalChain (array of approvers)

# Business Logic
methods:
  - determineApprovalChain()
  - getTemplatesForOU()
  - validateInput()
  - requiresGrantFundInfo()

# Knowledge Areas
knowledge:
  - AME (Approval Management Engine) rules
  - Operating Unit configurations
  - Threshold logic
  - Special routing cases
```

#### 1.2 Create Schema in ICA Context Studio

**In the ICA UI:**

1. Click **"Start with a Schema"** or **"Create Schema"**

2. **Choose Schema Type:**
   - Select: **"Business Domain Schema"**
   - Industry: **"Enterprise Resource Planning"**
   - Domain: **"Expense Management"**

3. **Define Entities:**

   **Entity 1: OperatingUnit**
   ```
   Name: OperatingUnit
   Type: Categorical
   Description: Organizational unit in Oracle EBS
   Values:
     - OU1 (Primary Operating Unit, OU 101)
     - OU2 (Healthcare Unit, OU 102)
     - OU3 (Foundation Unit, OU 121)
   ```

   **Entity 2: ExpenseTemplate**
   ```
   Name: ExpenseTemplate
   Type: Text
   Description: Type of expense report
   Categories:
     OU1: [Local Mileage, Non-Travel, Travel-Other, Tuition]
     OU2: [Travel, Non-Travel, Non-Nursing Tuition, Nursing Tuition]
     OU3: [Standard Expense]
   ```

   **Entity 3: ExpenseAmount**
   ```
   Name: ExpenseAmount
   Type: Number
   Description: Total expense amount
   Validation:
     - Minimum: 0
     - Maximum: 1000000
     - Format: Currency (USD)
   ```

   **Entity 4: GrantFund**
   ```
   Name: GrantFund
   Type: Boolean
   Description: Grant-funded expense indicator
   Applicable: OU2 only
   Fund Codes: 42000, 41235
   ```

4. **Define Methods/Functions:**
   ```
   Method: determineApprovalChain
   Input: operatingUnit, template, amount, isGrantFund, submitterName
   Output: approvalChain (array), success (boolean), message (string)
   
   Method: getTemplatesForOU
   Input: operatingUnit
   Output: templates (array)
   ```

5. **Add Business Rules Structure:**
   ```
   Rule Sets:
     - OU1_Rules (5 rules)
     - OU2_Rules (6 rules)
     - OU3_Rules (4 rules)
   
   Rule Format:
     - ID (e.g., OU1-1)
     - Conditions (when to apply)
     - Actions (approval chain)
   ```

6. Click **"Save Schema"**

#### 1.3 Validate Schema

- Review schema structure
- Check for completeness
- Ensure all entities are defined
- Verify relationships are clear

✅ **Schema Created Successfully!**

---

## Step 2: Create a Context

### Purpose
Create a unique context space which will be exposed for Agentic AI application consumption. This organizes your knowledge for AI use.

### What is a Context?
A context is a **knowledge container** that:
- Groups related information together
- Attaches schemas for structure
- Prepares for data ingestion
- Enables AI to understand your domain

### For iExpense Approval Assistant

#### 2.1 Create Context Space

**In ICA Context Studio:**

1. Click **"Create a Context"** or **"New Context"**

2. **Fill in Context Details:**
   ```
   Context Name: iExpense-Approval-Assistant
   
   Description: 
   Oracle iExpense approval chain determination assistant that helps 
   employees understand who will approve their expense reports based 
   on Operating Unit, expense type, and amount.
   
   Type: Business Assistant
   
   Industry: Enterprise Resource Planning
   
   Domain: Expense Management
   
   Use Case: Approval Chain Determination
   ```

3. **Context Configuration:**
   ```
   Version: 2.0
   Language: English
   Region: Global
   Visibility: Internal (or as per your org policy)
   ```

#### 2.2 Add Schema to Context

1. In your context, click **"Add Schema"**

2. **Select Schema:**
   - Choose: `iExpense_Approval_Domain` (created in Step 1)
   - Click **"Attach"**

3. **Schema Role:**
   - Primary Schema: ✅ Yes
   - Purpose: Data structure and validation

4. **Optional: Add Additional Schemas**
   - You can add industry-specific schemas
   - Method schemas (if available)
   - Knowledge domain schemas

#### 2.3 Configure AI Settings

**LLM Configuration:**
```
Provider: IBM watsonx.ai
Model: ibm/granite-13b-chat-v2

Parameters:
  Temperature: 0.3 (for consistent, accurate responses)
  Max Tokens: 500
  Top P: 0.9
```

**System Prompt:**
```
You are an expert Oracle iExpense approval assistant. You help employees 
understand who will approve their expense reports based on:
- Operating Unit (OU1, OU2, or OU3)
- Expense type/template
- Expense amount
- Grant fund status (for OU2)
- Special submitter rules

You have access to comprehensive approval rules for all three operating 
units. Always provide accurate, clear, and helpful responses. If you need 
more information, ask clarifying questions.

Key capabilities:
- Determine approval chains
- Explain approval rules
- List available expense templates
- Handle special cases

Always be professional and concise.
```

#### 2.4 Group Related Knowledge

**Organize your knowledge into categories:**

1. **Business Rules**
   - OU1 approval rules
   - OU2 approval rules
   - OU3 approval rules

2. **Reference Data**
   - Operating unit configurations
   - Expense templates
   - Approver groups
   - Threshold amounts

3. **Documentation**
   - Functional specifications
   - Technical specifications
   - User guides
   - Test cases

4. **Code/Logic**
   - Rules engine implementation
   - Validation logic
   - Helper functions

#### 2.5 Prepare for Data Ingestion

**Set ingestion preferences:**
```
Auto-process: Yes
Validate against schema: Yes
Extract entities: Yes
Build knowledge graph: Yes
Enable semantic search: Yes
```

5. Click **"Create Context"**

✅ **Context Created Successfully!**

---

## Step 3: Add Sources & Data

### Purpose
Bring your content into the context. Connect data sources, ingest and process content, and validate data quality.

### What to Add?
- Documentation files
- Code files
- Business rules
- Reference data
- Test cases

### For iExpense Approval Assistant

#### 3.1 Connect Data Sources

**Option A: Upload Files Directly**

1. In your context, click **"Add Sources & Data"**

2. Click **"Upload Files"**

3. **Upload these files from your project:**

   **📄 Documentation (Priority: High)**
   ```
   ✅ functional_spec.md
      - Business requirements
      - Use cases
      - User stories
      - Acceptance criteria
   
   ✅ technical_spec.md
      - Architecture
      - Data structures
      - Implementation details
   
   ✅ README.md
      - Overview
      - Quick start
      - Usage guide
   
   ✅ test_cases.md
      - Test scenarios
      - Expected results
      - Edge cases
   ```

   **💻 Code Files (Priority: High)**
   ```
   ✅ rules_engine.js
      - Core business logic
      - All 15 AME rules
      - Validation functions
   
   ✅ app.js
      - Application controller
      - UI logic
      - Form handling
   ```

   **🎨 Supporting Files (Priority: Medium)**
   ```
   ✅ index.html
      - User interface
      - Form structure
   
   ✅ styles.css
      - UI styling
   ```

4. **For each file:**
   - Select file
   - Choose document type
   - Add metadata:
     ```
     Category: [Documentation | Code | Test | Reference]
     Importance: [High | Medium | Low]
     Version: 1.0
     Last Updated: 2026-05-14
     ```
   - Click **"Upload"**

**Option B: Connect GitHub Repository**

1. Click **"Connect Data Source"**

2. Select **"GitHub"**

3. **Configure connection:**
   ```
   Repository: your-username/oracle-iexpense-approval-assistant
   Branch: main
   Access: Read-only
   
   Files to sync:
     - *.md (all markdown files)
     - *.js (JavaScript files)
     - *.html (HTML files)
   
   Sync frequency: On-demand (or Daily)
   ```

4. Click **"Connect"**

#### 3.2 Ingest and Process Content

**ICA will automatically:**

1. **Parse files** - Extract text and structure
2. **Validate against schema** - Check entity compliance
3. **Extract entities** - Identify OUs, templates, amounts, rules
4. **Build relationships** - Connect rules to entities
5. **Create knowledge graph** - Map all connections
6. **Enable semantic search** - Make content searchable

**Monitor ingestion progress:**
- Go to **"Ingestion Status"** tab
- Watch real-time processing
- Review any warnings or errors

#### 3.3 Add Structured Business Rules

**Create structured rule data:**

1. Click **"Add Structured Data"**

2. Select **"Business Rules"**

3. **Input OU1 Rules:**
   ```json
   {
     "rule_set": "OU1_Approval_Rules",
     "operating_unit": "OU1",
     "rules": [
       {
         "id": "OU1-1",
         "name": "Tuition Expenses Routing",
         "priority": 1,
         "conditions": {
           "template": "OU1 Tuition Expenses",
           "submitter_not_in": ["Special Approver1", "Special Approver2"]
         },
         "approval_chain": [
           "OU1 and OU2 Non Nursing Tuition Approvers",
           "Level 2 Approvers"
         ]
       },
       {
         "id": "OU1-2",
         "name": "Non-Travel DBMS Required",
         "priority": 2,
         "conditions": {
           "template_in": ["OU1 Non-Travel Expenses", "OU1 Travel-Other Expenses"],
           "amount_greater_than": 0
         },
         "approval_chain": [
           "OU1 Department Approver",
           "OU1 DBMS Approvers"
         ]
       },
       {
         "id": "OU1-3",
         "name": "Mileage High Amount",
         "priority": 3,
         "conditions": {
           "template": "OU1 Local Mileage Expense",
           "amount_greater_than_or_equal": 1000
         },
         "approval_chain": [
           "OU1 Department Approver",
           "OU1 DBMS Approvers"
         ]
       },
       {
         "id": "OU1-4",
         "name": "Mileage Low Amount",
         "priority": 4,
         "conditions": {
           "template": "OU1 Local Mileage Expense",
           "amount_less_than": 1000
         },
         "approval_chain": [
           "OU1 Department Approver"
         ]
       },
       {
         "id": "OU1-5",
         "name": "No Dept Approver Fallback",
         "priority": 5,
         "conditions": {
           "no_dept_approver": true
         },
         "approval_chain": [
           "SYSADMIN"
         ],
         "note": "Automatic routing"
       }
     ]
   }
   ```

4. **Input OU2 Rules:**
   ```json
   {
     "rule_set": "OU2_Approval_Rules",
     "operating_unit": "OU2",
     "rules": [
       {
         "id": "OU2-1",
         "name": "Travel Low Amount Grant",
         "conditions": {
           "template_in": ["OU2 Travel Expenses", "OU2 Non-Travel Expenses"],
           "amount_less_than_or_equal": 5000,
           "grant_fund": true
         },
         "approval_chain": [
           "First Superior",
           "OU2 Grant Fund Approvers Level 1"
         ]
       },
       {
         "id": "OU2-2",
         "name": "Travel Low Amount Non-Grant",
         "conditions": {
           "template_in": ["OU2 Travel Expenses", "OU2 Non-Travel Expenses"],
           "amount_less_than_or_equal": 5000,
           "grant_fund": false
         },
         "approval_chain": [
           "First Superior",
           "OU2 Non Grant Fund Approvers Level 1"
         ]
       },
       {
         "id": "OU2-3",
         "name": "Travel High Amount Grant",
         "conditions": {
           "template_in": ["OU2 Travel Expenses", "OU2 Non-Travel Expenses"],
           "amount_greater_than": 5000,
           "grant_fund": true
         },
         "approval_chain": [
           "First Superior",
           "OU2 Approvers Greater Than 5k dollars",
           "OU2 Grant Fund Approvers Level 1"
         ]
       },
       {
         "id": "OU2-4",
         "name": "Travel High Amount Non-Grant",
         "conditions": {
           "template_in": ["OU2 Travel Expenses", "OU2 Non-Travel Expenses"],
           "amount_greater_than": 5000,
           "grant_fund": false
         },
         "approval_chain": [
           "First Superior",
           "OU2 Approvers Greater Than 5k dollars",
           "OU2 Non Grant Fund Approvers Level 1"
         ]
       },
       {
         "id": "OU2-5",
         "name": "Non-Nursing Tuition",
         "conditions": {
           "template": "OU2 Non-Nursing Tuition Expenses",
           "submitter_not_in": ["Special Approver1", "Special Approver2"]
         },
         "approval_chain": [
           "OU1 and OU2 Non Nursing Tuition Approvers",
           "Level 2 Approvers"
         ]
       },
       {
         "id": "OU2-6",
         "name": "Nursing Tuition Self Approval",
         "conditions": {
           "template": "OU2 Nursing Tuition Expenses"
         },
         "approval_chain": [
           "OU2 Nursing Tuition Self Approval group"
         ]
       }
     ]
   }
   ```

5. **Input OU3 Rules:**
   ```json
   {
     "rule_set": "OU3_Approval_Rules",
     "operating_unit": "OU3",
     "rules": [
       {
         "id": "OU3-1",
         "name": "Low Amount Standard",
         "conditions": {
           "amount_less_than": 2000,
           "submitter_not": "Special Approver"
         },
         "approval_chain": [
           "OU3 Department Approver"
         ]
       },
       {
         "id": "OU3-2",
         "name": "High Amount Standard",
         "conditions": {
           "amount_greater_than_or_equal": 2000,
           "submitter_not": "Special Approver"
         },
         "approval_chain": [
           "OU3 Department Approver",
           "Special Approver"
         ]
       },
       {
         "id": "OU3-3",
         "name": "Special Approver Submitter Skip",
         "conditions": {
           "submitter": "Special Approver"
         },
         "approval_chain": [
           "OU3 Department Approver"
         ],
         "note": "Special Approver is skipped in his own submissions"
       },
       {
         "id": "OU3-4",
         "name": "No Dept Approver Fallback",
         "conditions": {
           "no_dept_approver": true
         },
         "approval_chain": [
           "SYSADMIN"
         ],
         "note": "Automatic routing"
       }
     ]
   }
   ```

6. Click **"Import Rules"**

#### 3.4 Validate Data Quality

**ICA will validate:**

1. **Schema Compliance**
   - ✅ All entities match schema
   - ✅ Data types are correct
   - ✅ Required fields present

2. **Content Quality**
   - ✅ No duplicate rules
   - ✅ Complete rule coverage
   - ✅ Consistent naming

3. **Relationships**
   - ✅ Rules linked to OUs
   - ✅ Templates linked to rules
   - ✅ Thresholds properly defined

**Review validation report:**
- Go to **"Data Quality"** tab
- Check validation status
- Fix any issues flagged
- Re-validate if needed

#### 3.5 Test Your Context

**Test with sample queries:**

1. Go to **"Test Console"** in ICA

2. **Test Query 1:**
   ```
   Input: "Who approves my OU1 mileage expense of $800?"
   
   Expected: 
   - Identify OU: OU1
   - Identify template: Local Mileage
   - Identify amount: $800
   - Apply rule: OU1-4 (amount < $1000)
   - Return: OU1 Department Approver
   ```

3. **Test Query 2:**
   ```
   Input: "I need to submit a OU2 travel expense for $6,000 on a grant"
   
   Expected:
   - Identify OU: OU2
   - Identify template: Travel
   - Identify amount: $6,000
   - Identify grant: Yes
   - Apply rule: OU2-3 (amount > $5000, grant)
   - Return: First Superior → Approvers >5k → Grant Fund Approvers L1
   ```

4. **Test Query 3:**
   ```
   Input: "What are the approval rules for OU3?"
   
   Expected:
   - Identify OU: OU3
   - Return: Summary of OU3-1 through OU3-4 rules
   ```

5. **Review responses** and adjust if needed

✅ **Data Ingested and Validated Successfully!**

---

## Step 4: Expose via MCP

### Purpose
Make your context accessible to external applications. Generate credentials, copy configuration, and enable consumption by agentic applications and IDEs.

### What is MCP?
**Model Context Protocol (MCP)** is a standard way to:
- Expose your context to AI applications
- Provide tools for external apps to call
- Share resources and knowledge
- Enable secure access with credentials

### For iExpense Approval Assistant

#### 4.1 Enable MCP for Your Context

**In ICA Context Studio:**

1. Go to your context: `iExpense-Approval-Assistant`

2. Click **"Expose via MCP"** tab

3. Click **"Enable MCP Server"**

4. **Configure MCP Settings:**
   ```
   MCP Server Name: iexpense-approval-mcp
   Version: 1.0.0
   Description: Oracle iExpense approval assistant MCP server
   
   Status: Enabled
   Protocol: MCP v1.0
   ```

#### 4.2 Generate Credentials

**Create access credentials:**

1. Click **"Generate Credentials"**

2. **Credential Configuration:**
   ```
   Credential Name: iExpense-MCP-Production
   Type: API Key
   Scope: Full Access
   Expiration: 1 year (or as per policy)
   ```

3. Click **"Generate"**

4. **Save your credentials securely:**
   ```
   API Key: ica_prod_xxxxxxxxxxxxxxxxxxxx
   Server URL: https://mcp.ica.ibm.com/contexts/iexpense-approval-assistant
   Context ID: ctx_iexpense_approval_12345
   ```

   ⚠️ **Important:** Save these credentials immediately - they won't be shown again!

5. **Create additional credentials** (optional):
   - Development: `iExpense-MCP-Dev`
   - Testing: `iExpense-MCP-Test`
   - Integration: `iExpense-MCP-Integration`

#### 4.3 Copy Configuration

**ICA provides ready-to-use configuration:**

1. Click **"Copy Configuration"**

2. **Choose your format:**

   **Option A: JSON Configuration**
   ```json
   {
     "mcp_server": {
       "name": "iexpense-approval-mcp",
       "url": "https://mcp.ica.ibm.com/contexts/iexpense-approval-assistant",
       "version": "1.0.0",
       "context_id": "ctx_iexpense_approval_12345"
     },
     "authentication": {
       "type": "api_key",
       "api_key": "ica_prod_xxxxxxxxxxxxxxxxxxxx"
     },
     "tools": [
       {
         "name": "get_approval_chain",
         "description": "Determine approval chain for an expense",
         "endpoint": "/tools/get_approval_chain"
       },
       {
         "name": "list_templates",
         "description": "Get available expense templates for an OU",
         "endpoint": "/tools/list_templates"
       },
       {
         "name": "explain_rules",
         "description": "Explain approval rules for an operating unit",
         "endpoint": "/tools/explain_rules"
       }
     ],
     "resources": [
       {
         "uri": "expense://rules/all",
         "name": "All Approval Rules",
         "endpoint": "/resources/rules/all"
       },
       {
         "uri": "expense://operating-units",
         "name": "Operating Units",
         "endpoint": "/resources/operating-units"
       }
     ]
   }
   ```

   **Option B: Environment Variables**
   ```bash
   # ICA MCP Configuration
   export ICA_MCP_SERVER_URL="https://mcp.ica.ibm.com/contexts/iexpense-approval-assistant"
   export ICA_MCP_API_KEY="ica_prod_xxxxxxxxxxxxxxxxxxxx"
   export ICA_MCP_CONTEXT_ID="ctx_iexpense_approval_12345"
   export ICA_MCP_VERSION="1.0.0"
   ```

   **Option C: Bob IDE Configuration**
   ```json
   {
     "mcpServers": {
       "iexpense-approval": {
         "command": "npx",
         "args": [
           "-y",
           "@modelcontextprotocol/server-ica"
         ],
         "env": {
           "ICA_SERVER_URL": "https://mcp.ica.ibm.com/contexts/iexpense-approval-assistant",
           "ICA_API_KEY": "ica_prod_xxxxxxxxxxxxxxxxxxxx",
           "ICA_CONTEXT_ID": "ctx_iexpense_approval_12345"
         }
       }
     }
   }
   ```

3. **Copy and save** the configuration you need

#### 4.4 Configure in Agentic Applications

**Option 1: Use in Bob IDE**

1. Open Bob IDE settings
2. Go to **"MCP Servers"** section
3. Click **"Add MCP Server"**
4. Paste the Bob IDE configuration (from 4.3)
5. Click **"Save"**
6. Restart Bob IDE

**Test in Bob:**
```
You: @iexpense-approval Who approves my OU1 mileage of $800?

Bob: Based on the iExpense approval rules, for a OU1 Local Mileage 
expense of $800, the approval chain is:
1. OU1 Department Approver

Since the amount is less than $1,000, only your department approver 
is required.
```

**Option 2: Use in Custom Application**

1. Install MCP client:
   ```bash
   npm install @modelcontextprotocol/sdk
   ```

2. Create client code:
   ```javascript
   const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
   const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');
   
   // Initialize MCP client
   const transport = new StdioClientTransport({
     command: 'npx',
     args: ['-y', '@modelcontextprotocol/server-ica'],
     env: {
       ICA_SERVER_URL: 'https://mcp.ica.ibm.com/contexts/iexpense-approval-assistant',
       ICA_API_KEY: process.env.ICA_MCP_API_KEY,
       ICA_CONTEXT_ID: 'ctx_iexpense_approval_12345'
     }
   });
   
   const client = new Client({
     name: 'iexpense-client',
     version: '1.0.0'
   }, {
     capabilities: {}
   });
   
   // Connect
   await client.connect(transport);
   
   // Call tool
   const result = await client.callTool({
     name: 'get_approval_chain',
     arguments: {
       operating_unit: 'OU1',
       template: 'OU1 Local Mileage Expense',
       amount: 800
     }
   });
   
   console.log(result);
   ```

3. Run your application:
   ```bash
   node your-app.js
   ```

**Option 3: Use in Other IDEs**

**VS Code with Continue:**
```json
{
  "mcpServers": {
    "iexpense-approval": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-ica"],
      "env": {
        "ICA_SERVER_URL": "https://mcp.ica.ibm.com/contexts/iexpense-approval-assistant",
        "ICA_API_KEY": "ica_prod_xxxxxxxxxxxxxxxxxxxx",
        "ICA_CONTEXT_ID": "ctx_iexpense_approval_12345"
      }
    }
  }
}
```

**Cursor IDE:**
```json
{
  "mcp": {
    "servers": {
      "iexpense-approval": {
        "url": "https://mcp.ica.ibm.com/contexts/iexpense-approval-assistant",
        "apiKey": "ica_prod_xxxxxxxxxxxxxxxxxxxx",
        "contextId": "ctx_iexpense_approval_12345"
      }
    }
  }
}
```

#### 4.5 Test MCP Integration

**Test your MCP connection:**

1. **Health Check:**
   ```bash
   curl -H "Authorization: Bearer ica_prod_xxxxxxxxxxxxxxxxxxxx" \
        https://mcp.ica.ibm.com/contexts/iexpense-approval-assistant/health
   ```

   Expected response:
   ```json
   {
     "status": "healthy",
     "context": "iExpense-Approval-Assistant",
     "version": "1.0.0",
     "uptime": "99.9%"
   }
   ```

2. **List Available Tools:**
   ```bash
   curl -H "Authorization: Bearer ica_prod_xxxxxxxxxxxxxxxxxxxx" \
        https://mcp.ica.ibm.com/contexts/iexpense-approval-assistant/tools
   ```

   Expected response:
   ```json
   {
     "tools": [
       {
         "name": "get_approval_chain",
         "description": "Determine approval chain for an expense",
         "inputSchema": { ... }
       },
       {
         "name": "list_templates",
         "description": "Get available expense templates",
         "inputSchema": { ... }
       },
       {
         "name": "explain_rules",
         "description": "Explain approval rules",
         "inputSchema": { ... }
       }
     ]
   }
   ```

3. **Call a Tool:**
   ```bash
   curl -X POST \
        -H "Authorization: Bearer ica_prod_xxxxxxxxxxxxxxxxxxxx" \
        -H "Content-Type: application/json" \
        -d '{
          "name": "get_approval_chain",
          "arguments": {
            "operating_unit": "OU1",
            "template": "OU1 Local Mileage Expense",
            "amount": 800
          }
        }' \
        https://mcp.ica.ibm.com/contexts/iexpense-approval-assistant/tools/call
   ```

   Expected response:
   ```json
   {
     "success": true,
     "approvalChain": [
       {
         "sequence": 1,
         "approverGroup": "OU1 Department Approver"
       }
     ],
     "metadata": {
       "operatingUnit": "OU1",
       "template": "OU1 Local Mileage Expense",
       "amount": 800,
       "ruleApplied": "OU1-4"
     }
   }
   ```

4. **Test in Bob IDE:**
   - Open Bob IDE
   - Type: `@iexpense-approval Who approves my OU1 mileage of $800?`
   - Verify Bob uses your MCP server
   - Check response accuracy

#### 4.6 Monitor Usage

**Track MCP usage:**

1. Go to **"Analytics"** tab in ICA Context Studio

2. **View metrics:**
   - Total API calls
   - Tool usage breakdown
   - Response times
   - Error rates
   - Active clients

3. **Set up alerts** (optional):
   - High error rate
   - Slow response times
   - Credential expiration
   - Usage limits

✅ **MCP Exposed and Configured Successfully!**

---

## 🎉 Completion Checklist

### ✅ Step 1: Schema - COMPLETE
- [x] Created `iExpense_Approval_Domain` schema
- [x] Defined all entities (OU, Template, Amount, etc.)
- [x] Defined methods (determineApprovalChain, etc.)
- [x] Validated schema structure

### ✅ Step 2: Context - COMPLETE
- [x] Created `iExpense-Approval-Assistant` context
- [x] Attached schema
- [x] Configured watsonx.ai LLM
- [x] Set system prompt
- [x] Organized knowledge categories

### ✅ Step 3: Sources & Data - COMPLETE
- [x] Uploaded all documentation files
- [x] Uploaded code files (rules_engine.js, app.js)
- [x] Added structured business rules (OU1, OU2, OU3)
- [x] Validated data quality
- [x] Tested with sample queries

### ✅ Step 4: MCP - COMPLETE
- [x] Enabled MCP server
- [x] Generated credentials
- [x] Copied configuration
- [x] Configured in Bob IDE (or other application)
- [x] Tested MCP integration
- [x] Verified tool calls work

---

## 🚀 Next Steps

### Immediate Actions
1. **Test in Bob IDE:**
   - Ask natural language questions
   - Verify accuracy of responses
   - Test edge cases

2. **Integrate with Your Web App:**
   - Add chat interface to existing app
   - Connect to MCP server
   - Enable both form and chat modes

3. **Share with Users:**
   - Announce new AI capabilities
   - Provide usage examples
   - Gather feedback

### Future Enhancements
- Add more conversational flows
- Implement multi-turn conversations
- Add voice interface
- Create mobile app
- Integrate with Oracle EBS (read-only)

---

## 📚 Resources

### ICA Context Studio
- **Lab Guide:** https://pages.github.ibm.com/guild-of-coding-agents-at-consulting/documentation/docs/enablement-materials/ica-labs/ica-context-studio-lab/
- **Documentation:** https://pages.github.ibm.com/guild-of-coding-agents-at-consulting/documentation/

### Bob IDE
- **Quick Start:** https://bob.ibm.com/docs/ide/getting-started/quickstart
- **MCP Integration:** https://bob.ibm.com/docs/mcp

### Model Context Protocol
- **Specification:** https://modelcontextprotocol.io/
- **SDK:** https://github.com/modelcontextprotocol/sdk

---

## 🆘 Troubleshooting

### Common Issues

**Issue: Schema validation fails**
- Solution: Check entity definitions match your data
- Verify all required fields are present

**Issue: Data ingestion errors**
- Solution: Check file formats (UTF-8 encoding)
- Ensure files are not corrupted

**Issue: MCP connection fails**
- Solution: Verify API key is correct
- Check server URL is accessible
- Ensure credentials haven't expired

**Issue: Tool calls return errors**
- Solution: Validate input parameters
- Check tool is enabled
- Review error logs in ICA

**Issue: Bob IDE doesn't see MCP server**
- Solution: Restart Bob IDE
- Verify configuration file location
- Check environment variables

---

## 📞 Support

**Need Help?**
- ICA Support: Slack #ica-support
- Bob Support: bob-support@ibm.com
- MCP Issues: GitHub Issues

---

**Congratulations! 🎉**

You've successfully integrated your iExpense Approval Assistant with ICA Context Studio and exposed it via MCP. Your assistant is now AI-powered and ready to help users with natural language queries!

---

**Document Version:** 1.0  
**Last Updated:** May 14, 2026  
**Author:** Bob - Oracle EBS Consultant
