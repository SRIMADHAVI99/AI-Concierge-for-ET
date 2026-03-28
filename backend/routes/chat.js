import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

function cleanInput(text) {
  if (!text) return "";
  return text
    .replace(/lps|lps|Lps/gi, "LPA")
    .replace(/-/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeExperience(input) {
  if (!input) return "Beginner";
  input = input.toLowerCase();
  if (input.includes("begin")) return "Beginner";
  if (input.includes("inter")) return "Intermediate";
  if (input.includes("adv")) return "Advanced";
  return "Beginner";
}

function normalizeGoal(goal) {
  if (!goal || goal.length < 3) return "building long-term wealth";
  return goal;
}

const generateFollowUp = async (history) => {
  const followUpPrompt = `
You are the ET AI Concierge. The user has already completed their onboarding and received a personalized financial plan. 
Answer their follow-up questions concisely, professionally, and always tie your advice back to Economic Times ecosystem products (ET Prime, ET Markets, Masterclasses) if relevant.
Do not hallucinate products that do not exist. Be extremely helpful.
`;

  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      throw new Error("Missing OpenAI Key");
    }
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const recentHistory = history.slice(Math.max(history.length - 4, 0)).map(msg => ({
      role: msg.role === 'bot' ? 'assistant' : 'user',
      content: msg.text || msg.content || ""
    }));

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: followUpPrompt },
        ...recentHistory
      ],
      temperature: 0.7,
    });
    return completion.choices[0].message.content.trim();
  } catch (e) {
    console.warn("OpenAI Follow-up Failed:", e.message);
    return "I recommend checking ET Prime for more detailed analysis on this topic, as my live connection is currently facing quota issues.";
  }
};

const generateFinalReport = async (incomeProf, experience, goal) => {
  const PREMIUM_PROMPT = `
You are an advanced AI Concierge for the Economic Times (ET) ecosystem.

Your goal is to act as a personalized financial guide that understands a user in one conversation and intelligently connects them to the most relevant ET products, services, and opportunities.

You must combine the roles of:
1. ET Welcome Concierge
2. Financial Life Navigator
3. ET Ecosystem Cross-Sell Engine
4. ET Services Marketplace Agent

---

USER PROFILE INPUT:
- Income & Profession: ${incomeProf}
- Investment Experience: ${experience}
- Financial Goal: ${goal}

---

INSTRUCTIONS:

1. Analyze the user deeply:
   - Understand income level, financial maturity, and intent
   - Infer needs such as wealth building, tax saving, learning, or active trading

2. Act as ET Welcome Concierge:
   - Create a personalized onboarding path
   - Suggest where the user should start within ET ecosystem

3. Act as Financial Life Navigator:
   - Identify financial gaps
   - Suggest relevant strategies (e.g., SIPs, ELSS for tax saving, portfolio tracking, etc.)
   - Adapt suggestions based on experience level

4. Act as Cross-Sell Engine:
   - Recommend relevant ET products:
     - ET Prime
     - ET Markets
     - Masterclasses
     - Events
   - Ensure recommendations are logically connected to user needs

5. Act as Services Marketplace Agent:
   - Suggest financial services where relevant:
     - Insurance
     - Loans
     - Credit cards
     - Wealth management
   - Only recommend if it fits the user's profile

6. Personalization Rules:
   - Always reference the user's profile (income, experience, goal)
   - Avoid generic advice
   - Explain WHY each recommendation is relevant

7. Intelligence Layer:
   - Handle beginners, intermediates, and advanced users differently
   - Align recommendations strictly with the user's goal (e.g., tax saving → ELSS, not trading tools)

8. Tone:
   - Professional, intelligent, and conversational
   - Not robotic, not overly salesy
   - Sound like a premium financial advisor

---

OUTPUT FORMAT:

🔍 User Summary:
(1–2 lines summarizing user profile in natural language)

🧭 Personalized ET Onboarding Path:
- Where the user should start
- Key ET platforms to explore first

✅ Recommended for You:
- [ET Product/Service]: (Clear reason WHY it fits this user)

📚 Suggested Learning / Tools:
- (Relevant tools, courses, or features with justification)

📈 Financial Action Plan:
- Step 1
- Step 2
- Step 3

💼 Services Marketplace (if relevant):
- (Insurance / loan / wealth service with reason)

⚡ Smart Cross-Sell Opportunities:
- (Additional ET offerings aligned with behavior/profile)

💬 Follow-up Suggestions:
- Suggest 2-3 questions the user might ask next

---

IMPORTANT RULES:
- Do NOT give generic or vague advice
- Do NOT repeat input directly
- Ensure every recommendation has a clear justification
- Align strictly with the user’s goal
- Make the response highly personalized, insightful, and slightly different each time to reflect true AI intelligence
`;

  const FORMATTER_PROMPT = `
You are a response formatter.

Your job is to clean and improve the following AI-generated financial response.

Instructions:
1. Fix grammar, spacing, and sentence structure.
2. Remove awkward phrases (e.g., "in the Around 7 LPA range", "goal of building").
3. Ensure all sentences are natural and professional.
4. Improve personalization using phrases like:
   - "Since you..."
   - "Based on your profile..."
5. Ensure consistency:
   - Income should look like "7 LPA"
   - Experience should be "Beginner / Intermediate / Advanced"
6. Expand vague goals:
   - "Building" → "building long-term wealth"
7. Do NOT change the meaning, only improve clarity and quality.
8. Keep the same structured format (headings, bullets, sections).

Return only the improved version.
`;

  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      throw new Error("Missing OpenAI Key");
    }
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    // Step 1: Raw Generation
    const completion1 = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: PREMIUM_PROMPT }],
      temperature: 0.7,
    });
    
    const rawResponse = completion1.choices[0].message.content.trim();

    // Step 2: Formatting / Cleanup Layer
    const completion2 = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: FORMATTER_PROMPT },
        { role: "user", content: rawResponse }
      ],
      temperature: 0.3, // Lower temp for exact formatting
    });

    let finalResponse = completion2.choices[0].message.content.trim();
    
    // Step 3: Fast Post-processing regex
    finalResponse = finalResponse    
      .replace(/in the Around/gi, "around")
      .replace(/goal of building/gi, "building long-term wealth");

    return finalResponse;

  } catch (e) {
    console.warn("OpenAI Failed. Falling back to dynamic simulated report.", e.message);
    
    let path = "Start with the ET Money app to set your baseline, then move to ET Prime for deeper market analysis.";
    let recommended = "ET Prime Subscription: Gives you exclusive, deep-dive analytical pieces to fundamentally track sectors relevant to your specific income and goals.";
    let suggested = `Wealth Masterclass: Perfect for your ${experience} level to start mapping out your trades with live charts.`;
    let actionStr = `Open an ET Money account to centralize your portfolios to achieve your goal of building long-term wealth automatically.`;
    let marketPlace = "Term Life Insurance via ET Partners: Given your salaried profile, establishing a baseline safety net is critical before aggressive allocation.";
    let crossSell = "ET Markets Pro Charting Tools: Available seamlessly as an add-on to your ET Prime account.";

    const goalLower = String(goal).toLowerCase();
    
    if (goalLower.includes('tax')) {
      path = "Start with the ET Wealth 'Tax Center' to map out your Section 80C deductions, then activate ET Money ELSS tracking.";
      recommended = "ELSS Mutual Funds (Section 80C): Since your focus is on tax saving, these mutual funds will help you reduce your tax burden immediately while building long-term wealth.";
      suggested = "ET Prime (Tax Insights): Discover customized, tax-efficient investment strategies curated by experts specifically for professionals in your bracket.";
      actionStr = "Calculate your Section 80C limit gap and start a SIP in a top-rated ELSS fund via ET Money.";
      crossSell = "ET Prime Tax Filling Assistance: An exclusive service for subscribers to seamlessly tie your investments into your actual returns.";
    } else if (goalLower.includes('trade') || goalLower.includes('market')) {
      path = "Start immediately to the ET Markets dashboard to set up your F&O watchlists and algorithmic backtesting suites.";
      recommended = "ET Markets Pro: Since you want to actively trade, this gives you the advanced technical analysis tools and live charting you need.";
      suggested = "Advanced Trading Masterclass: Learn advanced derivatives and option chain analysis.";
      actionStr = "Link your Demat account to ET Markets and set up your first watchlist.";
      marketPlace = "Margin Funding options via ET Broker Partners: Providing you liquidity specific to active day-trading needs.";
    }

    let finalFallback = `🔍 User Summary:
Since you're earning around ${incomeProf} and already have ${experience} investing experience, your roadmap below is tailored strictly to help you focus on ${goal}.

🧭 Personalized ET Onboarding Path:
- ${path}

✅ Recommended for You:
- ${recommended}

📚 Suggested Learning / Tools:
- ${suggested}

📈 Financial Action Plan:
- Step 1: ${actionStr}
- Step 2: Ensure your PAN is linked and KYC is fully updated across all platforms.
- Step 3: Track market movements weekly using the ET Markets daily briefs independently.

💼 Services Marketplace (if relevant):
- ${marketPlace}

⚡ Smart Cross-Sell Opportunities:
- ${crossSell}

💬 Follow-up Suggestions:
- "What are the exact tax benefits of ELSS?"
- "How do I activate ET Markets Pro?"
- "Which ET Masterclass should I take first?"`;

    return finalFallback
      .replace(/in the Around/gi, "around")
      .replace(/goal of building/gi, "building long-term wealth");
  }
};

router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;
    const msgLower = (message || "").toLowerCase();
    const historyLen = (history || []).length;

    if (historyLen === 0 || msgLower === 'init') {
      return res.json({
        text: "Hello! I am the ET Welcome Concierge. I'm here to build your personalized guide to the Economic Times Ecosystem. To get started, could you tell me your approximate income bracket and current profession? (e.g. 5 LPA, Salaried)",
        action: "question"
      });
    }

    if (historyLen <= 2) {
      return res.json({
        text: "Thank you for sharing that context. It helps me tailor the tools we offer. Next, how would you describe your current investment experience? (e.g., Beginner, Intermediate, Advanced)",
        action: "question"
      });
    }

    if (historyLen <= 4) {
      return res.json({
        text: "Got it. Finally, what is your primary financial goal right now? (e.g., Building long-term wealth, tax saving, learning market fundamentals)",
        action: "question"
      });
    }

    // Step 4: Final Output - Dynamic generation using pipeline
    if (historyLen === 6) {
      const incomeProf = cleanInput(history[1]?.content || "Unknown");
      const experience = normalizeExperience(history[3]?.content || "Beginner");
      const goal = normalizeGoal(cleanInput(history[5]?.content || "Wealth Planning"));

      const finalReportText = await generateFinalReport(incomeProf, experience, goal);

      return res.json({
        action: "report",
        text: "Your personalized strategy is ready! I've curated a plan designed for your specific financial profile. 👉 Once you check it out, feel free to ask me any follow-up questions right here in the chat!",
        profile: {
          fullReport: finalReportText
        }
      });
    }

    // Step 5: Follow-up Chat (Ongoing Conversational AI)
    if (historyLen >= 8) {
       const followUpResponse = await generateFollowUp(history);
       return res.json({
         text: followUpResponse,
         action: "continue"
       });
    }

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to process chat message.' });
  }
});

export default router;
