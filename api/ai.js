/**
 * Vercel Serverless Function: /api/ai.js
 * SATPath AI — Socratic Hints (3 AI Tokens) & Step-by-Step Breakdowns (5 AI Tokens)
 *
 * Works out of the box on Vercel!
 * Set ONE of the following environment variables in Vercel Project Settings -> Environment Variables:
 *   - OPENAI_API_KEY   (uses gpt-4o-mini by default)
 *   - GEMINI_API_KEY   (uses gemini-2.0-flash by default)
 *   - GROQ_API_KEY     (uses llama-3.3-70b-versatile by default)
 */

module.exports = async function handler(req, res) {
  // CORS headers for local testing & Vercel preview domains
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const {
      mode = 'hint', // 'hint' (3 tokens) | 'explain' (5 tokens)
      question = '',
      options = [],
      answer = '',
      topic = 'Digital SAT',
      isRw = false,
      isGrid = false,
      userAnswer = '',
      lang = 'en'
    } = req.body || {};

    if (!question || String(question).trim().length < 3) {
      return res.status(400).json({ error: 'Missing question text.' });
    }

    const cleanQuestion = String(question)
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<svg[\s\S]*?>[\s\S]*?<\/svg>/gi, '[Graph/Diagram included in question]')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const cleanOptions = Array.isArray(options)
      ? options.map((o, idx) => `${'ABCD'[idx] || idx + 1}) ${String(o).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}`).join('\n')
      : '';

    const cleanAns = String(answer || '').replace(/<[^>]+>/g, ' ').trim();

    const systemPrompt = isRw
      ? `You are SATPath AI, an elite Digital SAT Reading & Writing tutor.
Your goal is to teach students how to think like a 1600-scorer using strict evidence-based reading and grammar rules.
Formatting rules:
- Use clear, encouraging, concise formatting with bold key terms.
- Never use raw LaTeX delimiters like \\( or $$ — write clean readable text.
- If mode is "hint": DO NOT reveal the final letter or exact answer! Give a 3-part Socratic nudge:
  1) **Core Skill**: Identify what SAT R&W skill is being tested (${topic}).
  2) **Context Clue / Signal**: Point out the exact transition word, punctuation boundary, or claim keywords in the passage to focus on.
  3) **Trap Alert**: Explain what kind of wrong-answer trap to eliminate (e.g., Too Extreme, Half-Right, Out of Scope, or Comma Splice) without naming the exact letter.
- If mode is "explain": Provide a complete, structured Step-by-Step Breakdown:
  1) **Core Concept & Goal**: State what the question asks and the key rule/claim in 1-2 sentences.
  2) **Step-by-Step Analysis**: Walk through the passage evidence or grammar structure step by step.
  3) **Why the Correct Answer Works**: Explicitly justify why "${cleanAns}" is 100% supported.
  4) **Why Distractors Fail**: Briefly explain the flaw in the other choices.
  5) **SATPath Pro Tip**: One memorable 1-sentence takeaway for test day.`
      : `You are SATPath AI, an elite Digital SAT Math tutor.
Your goal is to teach students fast, crystal-clear mathematical reasoning and Desmos graphing shortcuts.
Formatting rules:
- Write clean equations using standard readable symbols (e.g., x^2, (a/b), ≤, ≥, √) — avoid raw LaTeX code blocks like \\frac{}{} unless converted to plain readable math.
- If mode is "hint": DO NOT reveal the final numeric answer or choice! Give a 3-part strategic nudge:
  1) **Concept & Formula**: State the exact algebraic/geometric principle or formula needed (${topic}).
  2) **First Step Setup**: Show how to set up the first equation or variable from the word problem without solving it to the end.
  3) **Desmos / Fast Shortcut**: Explain how the student can type this into the built-in Desmos calculator or spot a shortcut.
- If mode is "explain": Provide a complete, structured Step-by-Step Breakdown:
  1) **Target & Given Data**: Identify what the question is asking for and extract the key equations/values.
  2) **Step-by-Step Solution**: Show Step 1, Step 2, Step 3 clearly with intermediate algebra so the student never gets lost.
  3) **Final Answer Confirmation**: Confirm the exact answer (${cleanAns}).
  4) **Desmos & Time-Saver Hack**: Explain how to solve or verify this in 10 seconds using Desmos or backsolving.`;

    const userPrompt = `Mode requested: ${mode === 'explain' ? 'FULL STEP-BY-STEP BREAKDOWN (5 Tokens)' : 'STRATEGIC HINT WITHOUT SPOILING THE ANSWER (3 Tokens)'}
Section: ${isRw ? 'Reading & Writing' : 'SAT Math'}
Topic: ${topic}
Question Type: ${isGrid ? 'Student-Produced Response (Grid-In)' : 'Multiple Choice'}
Question:
${cleanQuestion}

${cleanOptions ? `Answer Choices:\n${cleanOptions}\n` : ''}
Correct Answer (for your reference; DO NOT reveal if mode is "hint"): ${cleanAns}
${userAnswer ? `Student's previous/selected answer: ${userAnswer}` : ''}
Language preference: ${lang === 'ru' ? 'Respond in Russian (keep SAT terms/quotes in English where helpful)' : 'Respond in clear English'}`;

    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    // 1. Try OpenAI (gpt-4o-mini)
    if (openaiKey) {
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          temperature: 0.35,
          max_tokens: mode === 'explain' ? 650 : 320,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ]
        })
      });
      const data = await r.json();
      if (r.ok && data.choices && data.choices[0]?.message?.content) {
        return res.status(200).json({
          ok: true,
          provider: 'openai',
          mode,
          text: data.choices[0].message.content.trim()
        });
      }
    }

    // 2. Try Google Gemini (gemini-2.0-flash)
    if (geminiKey) {
      const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            generationConfig: {
              temperature: 0.35,
              maxOutputTokens: mode === 'explain' ? 700 : 350
            }
          })
        }
      );
      const data = await r.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (r.ok && text) {
        return res.status(200).json({
          ok: true,
          provider: 'gemini',
          mode,
          text: text.trim()
        });
      }
    }

    // 3. Try Groq (llama-3.3-70b-versatile)
    if (groqKey) {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
          temperature: 0.35,
          max_tokens: mode === 'explain' ? 650 : 320,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ]
        })
      });
      const data = await r.json();
      if (r.ok && data.choices && data.choices[0]?.message?.content) {
        return res.status(200).json({
          ok: true,
          provider: 'groq',
          mode,
          text: data.choices[0].message.content.trim()
        });
      }
    }

    // 4. Built-in Pedagogical Fallback if no API key is configured yet on Vercel
    return res.status(200).json({
      ok: true,
      provider: 'satpath-engine',
      mode,
      fallback: true,
      text: ''
    });
  } catch (err) {
    console.error('SATPath AI error:', err);
    return res.status(500).json({ error: 'Failed to generate AI response.' });
  }
}
