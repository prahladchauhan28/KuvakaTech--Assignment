import dataStore from '../models/dataStore.js';
import { calculateRuleScore, generateRuleReasoning } from'../services/ruleEngine.js';
import { getAIScore } from'../services/aiService.js';

const scoreLeads = async (req, res) => {
  try {
    const offer = dataStore.getOffer();
    const leads = dataStore.getLeads();
    
    if (!offer) {
      return res.status(400).json({ 
        error: 'No offer data available. Please POST to /offer first.' 
      });
    }
    
    if (!leads || leads.length === 0) {
      return res.status(400).json({ 
        error: 'No leads available. Please upload leads first.' 
      });
    }
    
    const results = [];
    let processed = 0;
    
    // Process leads sequentially to avoid API rate limits
    for (const lead of leads) {
      try {
        // Calculate rule-based score
        const ruleScore = calculateRuleScore(lead, offer);
        const ruleReasoning = generateRuleReasoning(lead, ruleScore);
        
        // Get AI score
        const aiResult = await getAIScore(lead, offer);
        
        // Calculate total score (0-100)
        const totalScore = ruleScore + aiResult.score;
        
        // Determine intent label
        let intent = 'Low';
        if (totalScore >= 70) intent = 'High';
        else if (totalScore >= 40) intent = 'Medium';
        
        // Combine reasoning
        const combinedReasoning = `${ruleReasoning}. ${aiResult.reasoning}`;
        
        results.push({
          name: lead.name || 'Unknown',
          role: lead.role || 'Not provided',
          company: lead.company || 'Not provided',
          intent,
          score: totalScore,
          reasoning: combinedReasoning,
          ruleScore,
          aiScore: aiResult.score
        });
        
        processed++;
        
        // Optional: Add small delay to avoid rate limiting
        if (processed < leads.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
      } catch (error) {
        console.error(`Error processing lead ${lead.name}:`, error);
        
        // Add error entry for failed lead processing
        results.push({
          name: lead.name || 'Unknown',
          role: lead.role || 'Not provided',
          company: lead.company || 'Not provided',
          intent: 'Error',
          score: 0,
          reasoning: 'Error processing this lead',
          ruleScore: 0,
          aiScore: 0
        });
      }
    }
    
    // Sort results by score (descending)
    results.sort((a, b) => b.score - a.score);
    
    // Store results
    dataStore.setResults(results);
    
    // Calculate summary statistics
    const highIntentCount = results.filter(r => r.intent === 'High').length;
    const mediumIntentCount = results.filter(r => r.intent === 'Medium').length;
    const lowIntentCount = results.filter(r => r.intent === 'Low').length;
    
    res.json({ 
      message: `Scoring completed for ${results.length} leads`,
      summary: {
        total: results.length,
        highIntent: highIntentCount,
        mediumIntent: mediumIntentCount,
        lowIntent: lowIntentCount,
        averageScore: Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
      },
    //   results 
    });
  } catch (error) {
    console.error('Scoring error:', error);
    res.status(500).json({ 
      error: 'Error during lead scoring process',
      details: error.message 
    });
  }
};
export { scoreLeads };