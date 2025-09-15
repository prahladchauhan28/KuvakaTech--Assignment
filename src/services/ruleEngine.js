function calculateRuleScore(lead, offer) {
  let score = 0;
  
  // 1. Role relevance: decision maker (+20), influencer (+10), else 0
  const role = lead.role ? lead.role.toLowerCase() : '';
  
  // Decision maker roles
  const decisionMakers = ['ceo', 'cto', 'cfo', 'director', 'head of', 'vp', 'president', 'founder', 'owner', 'manager'];
  // Influencer roles
  const influencers = ['senior', 'lead', 'analyst', 'specialist', 'strategist', 'architect'];
  
  const isDecisionMaker = decisionMakers.some(title => role.includes(title));
  const isInfluencer = influencers.some(title => role.includes(title));
  
  if (isDecisionMaker) {
    score += 20;
  } else if (isInfluencer) {
    score += 10;
  }
  
  // 2. Industry match: exact ICP (+20), adjacent (+10), else 0
  const industry = lead.industry ? lead.industry.toLowerCase() : '';
  const idealIndustries = offer.ideal_use_cases.map(ic => ic.toLowerCase());
  
  // Check for exact match
  const exactMatch = idealIndustries.some(idealIndustry => 
    industry.includes(idealIndustry) || idealIndustry.includes(industry)
  );
  
  // Check for adjacent match (simplified logic)
  const adjacentMatch = !exactMatch && industry && idealIndustries.some(idealIndustry =>
    hasIndustryOverlap(industry, idealIndustry)
  );
  
  if (exactMatch) {
    score += 20;
  } else if (adjacentMatch) {
    score += 10;
  }
  
  // 3. Data completeness: all fields present (+10)
  const requiredFields = ['name', 'role', 'company', 'industry', 'location', 'linkedin_bio'];
  const allFieldsPresent = requiredFields.every(field => 
    lead[field] && lead[field].toString().trim() !== ''
  );
  
  if (allFieldsPresent) {
    score += 10;
  }
  
  return Math.min(score, 50); // Cap at 50 points max
}

// Helper function to determine industry adjacency
function hasIndustryOverlap(industry1, industry2) {
  const industryGroups = {
    tech: ['tech', 'software', 'saas', 'ai', 'machine learning', 'cloud', 'it'],
    finance: ['finance', 'fintech', 'banking', 'investment', 'insurance'],
    healthcare: ['healthcare', 'medical', 'pharma', 'biotech'],
    retail: ['retail', 'ecommerce', 'consumer goods'],
    manufacturing: ['manufacturing', 'industrial', 'production']
  };
  
  const industry1Group = Object.keys(industryGroups).find(group =>
    industryGroups[group].some(term => industry1.includes(term))
  );
  
  const industry2Group = Object.keys(industryGroups).find(group =>
    industryGroups[group].some(term => industry2.includes(term))
  );
  
  return industry1Group && industry2Group && industry1Group === industry2Group;
}

// Generate rule-based reasoning explanation
function generateRuleReasoning(lead, ruleScore) {
  const reasons = [];
  
  // Role relevance
  const role = lead.role ? lead.role.toLowerCase() : '';
  if (role.includes('ceo') || role.includes('cto') || role.includes('director') || role.includes('vp')) {
    reasons.push('Role is decision maker');
  } else if (role.includes('senior') || role.includes('lead') || role.includes('analyst')) {
    reasons.push('Role is influencer');
  }
  
  // Industry match
  if (lead.industry) {
    reasons.push(`Industry: ${lead.industry}`);
  }
  
  // Data completeness
  const requiredFields = ['name', 'role', 'company', 'industry', 'location', 'linkedin_bio'];
  const missingFields = requiredFields.filter(field => !lead[field] || lead[field].toString().trim() === '');
  if (missingFields.length === 0) {
    reasons.push('Complete profile data');
  } else if (missingFields.length < 3) {
    reasons.push('Most data present');
  }
  
  return reasons.length > 0 ? reasons.join(', ') : 'Limited profile information';
}

export { calculateRuleScore, generateRuleReasoning };