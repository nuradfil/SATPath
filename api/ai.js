// /api/ai — SATPath AI tutor (Gemini). Env var: GEMINI_AI (optional GEMINI_MODEL).
// Vercel serverless function (CommonJS). If your project has "type":"module", change
// `module.exports =` to `export default`.

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

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
    ru
      ? 'Reply in Russian. Keep math terms and answer choices as they appear in the question.'
      : 'Reply in English.',
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
  ]
    .filter((x) => x !== '')
    .join('\n');

  return { system, user };
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const key = process.env.GEMINI_AI;
  if (!key) return res.status(500).json({ error: 'GEMINI_AI env var is not set' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = null; }
  }
  if (!body || !body.question || (body.mode !== 'hint' && body.mode !== 'explain')) {
    return res.status(400).json({ error: 'bad request' });
  }

  const { system, user } = buildPrompts(body);

  try {
    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' + MODEL + ':generateContent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: 'user', parts: [{ text: user }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 3000,
            thinkingConfig: { thinkingBudget: body.mode === 'hint' ? 256 : 1024 },
          },
        }),
      }
    );
    const data = await r.json();
    if (!r.ok) {
      console.error('Gemini error', r.status, JSON.stringify(data).slice(0, 500));
      const msg = (data && data.error && data.error.message) || '';
      return res.status(502).json({ error: 'gemini_' + r.status, detail: String(msg).slice(0, 200) });
    }
    const text = ((data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [])
      .map((p) => p.text || '')
      .join('')
      .trim();
    if (!text) {
      const why = (data.promptFeedback && data.promptFeedback.blockReason) || (data.candidates && data.candidates[0] && data.candidates[0].finishReason) || '';
      return res.status(502).json({ error: 'empty', detail: String(why) });
    }
    return res.status(200).json({ text });
  } catch (e) {
    console.error('ai.js', e);
    return res.status(502).json({ error: 'network', detail: String(e && e.message || e).slice(0, 200) });
  }
};

module.exports.config = { maxDuration: 30 };
