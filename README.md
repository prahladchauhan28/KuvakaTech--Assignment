# Lead Scoring API

A Node.js API service that scores sales leads using a combination of rule-based logic and AI analysis.

## Quick Links

- **Live API**: [https://kuvakatech-assignment.onrender.com](https://kuvakatech-assignment.onrender.com)
- **Postman Collection**: [View Documentation](https://www.postman.com/clmsl3/workspace/kuvakatech/request/36841711-e1602f8f-2848-4833-8831-577e4afc9ff6?action=share&creator=36841711&ctx=documentation)

## Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/prahladchauhan28/KuvakaTech--Assignment.git
   cd KuvakaTech--Assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory with:
   ```
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Start the server**
   ```bash
   npm start
   ```

## API Usage Examples

### 1. Create an Offer
```bash
curl -X POST http://localhost:3000/offer \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Enterprise SaaS Solution",
    "value_props": ["Increase productivity", "Reduce costs", "Improve security"],
    "ideal_use_cases": ["Technology", "Finance", "Healthcare"]
  }'
```

### 2. Upload Leads (CSV)
```bash
curl -X POST http://localhost:3000/leads/upload \
  -F "file=@leads.csv" \
  -H "Content-Type: multipart/form-data"
```

Required CSV columns:
- name
- role
- company
- industry
- location
- linkedin_bio

### 3. Score Leads
```bash
curl -X POST http://localhost:3000/score
```

### 4. Get Results
```bash
curl http://localhost:3000/results
```

Filtering options:
```bash
# Filter by intent
curl "http://localhost:3000/results?intent=high"

# Filter by score range
curl "http://localhost:3000/results?minScore=70&maxScore=100"

# Sort results
curl "http://localhost:3000/results?sortBy=score&order=desc"
```

### 5. Export Results as CSV
```bash
curl http://localhost:3000/results/export -o lead_results.csv
```

## Rule Logic & Prompts

### Rule-Based Scoring (50 points max)

1. **Role Relevance (20 points max)**
   - Decision maker roles (+20): CEO, CTO, CFO, Director, Head of, VP, President, Founder, Owner, Manager
   - Influencer roles (+10): Senior, Lead, Analyst, Specialist, Strategist, Architect
   - Other roles (0)

2. **Industry Match (20 points max)**
   - Exact match with ideal use cases (+20)
   - Adjacent industry match (+10)
   - No match (0)

3. **Data Completeness (10 points)**
   - All required fields present (+10)
   - Missing fields (0)

### AI Scoring via Gemini (50 points max)

The AI component uses a structured prompt to analyze buying intent:

```text
Analyze this prospect's buying intent for: [Offer Name]

Value Propositions: [Value Props]
Ideal Use Cases: [Use Cases]

Prospect Information:
- Name: [Name]
- Role: [Role]
- Company: [Company]
- Industry: [Industry]
- Location: [Location]
- LinkedIn Bio: [Bio]

Classify buying intent as High, Medium, or Low and provide explanation.
```

AI Score Mapping:
- High Intent: 50 points
- Medium Intent: 30 points
- Low Intent: 10 points

### Final Score Calculation

- Total Score = Rule Score + AI Score (Max 100 points)
- Intent Classification:
  - High: 70-100 points
  - Medium: 40-69 points
  - Low: 0-39 points

## Error Handling

The API includes comprehensive error handling for:
- Invalid CSV format
- Missing required fields
- File upload issues
- Missing offer or leads data
- AI service failures (with fallback scoring)