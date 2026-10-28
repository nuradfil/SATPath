// /api/ai — SATPath AI tutor (Gemini). Key: GEMINI_AI or GEMINI_API_KEY (optional GEMINI_MODEL).
// Vercel serverless function (CommonJS). If package.json has "type":"module",
// replace `module.exports =` with `export default` and delete the last line.

// Tried in order; a model that returns 404 (retired / not available to this key) is skipped.
const MODELS = [process.env.GEMINI_MODEL, 'gemini-3.8-flash', 'gemini-flash-latest', 'gemini-2.5-flash'].filter(Boolean);

const clean = (s, max) =>
  String(s == null ? '' : s)
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' [diagram omitted] ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

function buildPrompts(b) {
  const ru = b.lang === 'ru';
  const isRw = !!b.isRw;
  const opts = Array.isArray(b.options) ? b.options.map((o, i) => String.fromCharCode(65 + i) + ') ' + clean(o, 300)) : [];
  const q = clean(b.question, 4000);
  const ans = clean(b.answer, 300);
  const topic = clean(b.topic, 120);
  const wrong = clean(b.userAnswer, 300);

  const system = [
    'You are SATPath AI, a sharp, concise Digital SAT tutor for a high-school student.',
    'Write ONLY about the specific question given. Never write generic advice that would fit any question.',
    'Use the actual numbers, words and sentences from the question.',
    'Output plain text only: no emojis, no headings with #, no bullet symbols, no LaTeX. Write math inline in plain text, e.g. a/b = 7/6, x^2, sqrt(5).',
    'Format: short blocks separated by one blank line. A block may start with a bold label like **Step 1** on its own line, followed by 1-3 sentences.',
    ru ? 'Reply in Russian. Keep math terms and answer choices as they appear in the question.' : 'Reply in English.',
    'Be correct. If the provided correct answer disagrees with your own work, trust your own careful work and state the result you derive.',
  ].join('\n');

  const task =
    b.mode === 'hint'
      ? [
          'MODE: HINT. Do NOT reveal the final answer or say which choice is correct.',
          'Give 2-3 short sentences: (1) what exactly this question asks, (2) the one key idea or relationship to use, (3) the first concrete move to make with the given numbers.',
          'Max 70 words total. No bold labels.',
        ].join('\n')
      : [
          'MODE: FULL SOLUTION.',
          isRw
            ? 'Quote the key phrase from the text, explain the rule or logic it tests, say why the correct choice works, and in one line each why the other choices fail. 120-200 words.'
            : 'Show the real worked solution with actual calculations, 3-5 numbered steps (**Step 1**, **Step 2** ...). Show each computed value. 120-220 words.',
          'Finish with a final block **Answer** stating the correct choice and value.',
        ].join('\n');

  const user = [
    'Section: ' + (isRw ? 'Reading & Writing' : 'Math') + (topic ? ' · Topic: ' + topic : ''),
    'Question: ' + q,
    opts.length ? 'Choices:\n' + opts.join('\n') : b.isGrid ? 'Student-produced response (no choices).' : '',
    ans ? 'Correct answer: ' + ans : '',
    wrong ? 'Student answered: ' + wrong + ' (explain why this is wrong).' : '',
    '',
    task,
  ].filter((x) => x !== '').join('\n');

  return { system, user };
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const key = (process.env.GEMINI_AI || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_KEY || '').trim();
  if (!key) return res.status(500).json({ error: 'no api key env var' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = null; } }
  if (!body || !body.question || (body.mode !== 'hint' && body.mode !== 'explain')) {
    return res.status(400).json({ error: 'bad request' });
  }

  const { system, user } = buildPrompts(body);

  const call = (model, withThinking) =>
    fetch('https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: user }] }],
        generationConfig: Object.assign(
          { temperature: 0.3, maxOutputTokens: 3000 },
          withThinking ? { thinkingConfig: { thinkingBudget: body.mode === 'hint' ? 256 : 1024 } } : {}
        ),
      }),
    });

  try {
    let r = null, data = null, used = '';
    for (const model of MODELS) {
      r = await call(model, true);
      data = await r.json();
      if (r.status === 400) { r = await call(model, false); data = await r.json(); }
      used = model;
      if (r.status !== 404) break;
      console.error('model unavailable, trying next:', model);
    }
    if (!r.ok) {
      console.error('Gemini error', used, r.status, JSON.stringify(data).slice(0, 500));
      return res.status(502).json({ error: 'gemini_' + r.status });
    }
    const text = ((data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [])
      .map((p) => p.text || '').join('').trim();
    if (!text) return res.status(502).json({ error: 'empty' });
    return res.status(200).json({ text });
  } catch (e) {
    console.error('ai.js', e);
    return res.status(502).json({ error: 'network' });
  }
};

module.exports.config = { maxDuration: 30 };
