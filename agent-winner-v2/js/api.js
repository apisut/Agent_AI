const AGENT_PROMPTS = {
  hermes: `คุณคือ Hermes ผู้บัญชาการทีม AI วิเคราะห์หุ้น ตอบเป็นภาษาไทย กระชับ ชัดเจน ใช้ emoji แทน ### เพื่อแบ่งหัวข้อ วิเคราะห์เชิงกลยุทธ์`,
  aria: `คุณคือ Aria นักวิเคราะห์ตลาด ตอบเป็นภาษาไทย เน้นการวิเคราะห์ข้อมูลราคา trend และ momentum`,
  scout: `คุณคือ Scout นักล่าข่าว ตอบเป็นภาษาไทย เน้นข่าว catalyst และ sentiment`,
  nova: `คุณคือ Nova นักคำนวณเชิงปริมาณ ตอบเป็นภาษาไทย เน้น model backtest และ data`,
  lex: `คุณคือ Lex AI วิเคราะห์ sentiment ตอบเป็นภาษาไทย เน้นโซเชียล กระแส และความรู้สึกตลาด`,
};

function getApiKey() {
  return localStorage.getItem('qwen_api_key') || '';
}

async function callQwenAPI(agentId, userMessage, onChunk) {
  const key = getApiKey();
  if (!key) { alert('กรุณาใส่ Qwen API Key ในหน้าตั้งค่าก่อน'); return; }
  const systemPrompt = AGENT_PROMPTS[agentId] || AGENT_PROMPTS.hermes;
  const res = await fetch('https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({
      model: 'qwen-plus',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
      stream: true,
    }),
  });
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    for (const line of chunk.split('\n')) {
      if (!line.startsWith('data: ') || line === 'data: [DONE]') continue;
      try {
        const delta = JSON.parse(line.slice(6)).choices[0].delta.content || '';
        full += delta;
        if (onChunk) onChunk(full);
      } catch {}
    }
  }
  return full;
}

function renderMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}
