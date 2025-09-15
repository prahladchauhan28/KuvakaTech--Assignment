import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getAIScore(lead, offer) {
  try {
    const prompt = `
      Analyze this prospect's buying intent for: ${offer.name}
      
      Value Propositions: ${offer.value_props.join(", ")}
      Ideal Use Cases: ${offer.ideal_use_cases.join(", ")}
      
      Prospect Information:
      - Name: ${lead.name || "Not provided"}
      - Role: ${lead.role || "Not provided"}
      - Company: ${lead.company || "Not provided"}
      - Industry: ${lead.industry || "Not provided"}
      - Location: ${lead.location || "Not provided"}
      - LinkedIn Bio: ${lead.linkedin_bio || "Not provided"}
      
      Classify buying intent as High, Medium, or Low and provide a concise explanation (1-2 sentences).
      
      Respond in JSON format: 
      {
        "intent": "High/Medium/Low",
        "explanation": "your explanation here"
      }
    `;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 150,
        responseMimeType: "application/json",
      },
      systemInstruction: "You are a lead qualification expert. Analyze the prospect data and classify their buying intent. Be concise and professional. Always respond with valid JSON in the specified format."
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    
    let aiResponse;

    try {
      aiResponse = JSON.parse(content);
    } catch (e) {
      // Fallback parsing if JSON response fails
      const intentMatch = content.match(
        /("intent"|intent)[:\s]+["']?(High|Medium|Low)["']?/i
      );
      const explanationMatch = content.match(
        /("explanation"|explanation)[:\s]+["']?(.*?)["']?$/i
      );

      aiResponse = {
        intent: intentMatch ? intentMatch[2] : "Low",
        explanation: explanationMatch
          ? explanationMatch[2]
          : "AI analysis unavailable",
      };
    }

    // Map intent to score: High = 50, Medium = 30, Low = 10
    const intentScoreMap = {
      High: 50,
      Medium: 30,
      Low: 10,
    };

    return {
      score: intentScoreMap[aiResponse.intent] || 10,
      reasoning: aiResponse.explanation || "No AI explanation provided",
    };
  } catch (error) {
    console.error("AI Service Error:", error);

    // Fallback response if AI service fails
    return {
      score: 10,
      reasoning: "AI analysis unavailable due to service error",
    };
  }
}

export { getAIScore };