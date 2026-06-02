// TradePilot OS - Main JS

// Live clock
function updateClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const el = document.getElementById('live-clock');
  if (el) el.textContent = timeStr;
}
setInterval(updateClock, 1000);
updateClock();

// Market countdown (mock)
function updateMarketCountdown() {
  const el = document.getElementById('market-countdown');
  if (!el) return;
  const now = new Date();
  const close = new Date();
  close.setHours(16, 0, 0, 0);
  const diff = Math.max(0, close - now);
  const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
  const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
  const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
  el.textContent = `${h} : ${m} : ${s}`;
}
setInterval(updateMarketCountdown, 1000);
updateMarketCountdown();

// CEO Command
async function sendCeoCommand() {
  const input = document.getElementById('ceo-input');
  const response = document.getElementById('ceo-response');
  const cmd = input.value.trim();
  if (!cmd) return;

  response.className = 'ceo-response show';
  response.textContent = '⏳ CEO กำลังประมวลผลคำสั่ง...';
  input.value = '';

  try {
    const res = await fetch('/api/ceo/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: cmd })
    });
    const data = await res.json();
    response.textContent = '🤖 CEO: ' + data.message;
  } catch {
    response.textContent = '❌ ไม่สามารถเชื่อมต่อกับ CEO Agent';
  }
}

function setQuickCmd(cmd) {
  document.getElementById('ceo-input').value = cmd;
  document.getElementById('ceo-input').focus();
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('ceo-input');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendCeoCommand();
    });
  }

  // Animate progress bars
  document.querySelectorAll('.agent-progress-fill').forEach(el => {
    const target = el.dataset.progress || 0;
    setTimeout(() => { el.style.width = target + '%'; }, 300);
  });

  // Animate confidence rings
  document.querySelectorAll('.ring-fill').forEach(el => {
    const pct = parseFloat(el.dataset.pct || 0);
    const r = 16;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    setTimeout(() => {
      el.style.strokeDasharray = circ;
      el.style.strokeDashoffset = offset;
    }, 500);
  });

  // Draw donut chart
  drawDonut();
});

function drawDonut() {
  const canvas = document.getElementById('setup-donut');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = 45;
  const data = [
    { value: 37.5, color: '#10b981', label: 'Strong Buy' },
    { value: 34.4, color: '#3b82f6', label: 'Buy' },
    { value: 18.8, color: '#f59e0b', label: 'Hold' },
    { value: 9.3,  color: '#ef4444', label: 'Avoid' },
  ];

  let startAngle = -Math.PI / 2;
  data.forEach(seg => {
    const angle = (seg.value / 100) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, startAngle + angle);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();
    startAngle += angle;
  });

  // Center hole
  ctx.beginPath();
  ctx.arc(cx, cy, 28, 0, Math.PI * 2);
  ctx.fillStyle = '#111827';
  ctx.fill();

  // Center text
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 14px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('32', cx, cy - 6);
  ctx.font = '9px Inter, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Setups', cx, cy + 8);
}

// Ticker tape animation
function initTickerTape() {
  const tickers = [
    { s: 'NVDA', p: '1,052.34', c: '+3.24%', u: true },
    { s: 'META', p: '504.21', c: '+2.11%', u: true },
    { s: 'AVGO', p: '1,672.89', c: '+1.87%', u: true },
    { s: 'MSFT', p: '420.77', c: '+1.35%', u: true },
    { s: 'AAPL', p: '195.87', c: '+1.18%', u: true },
    { s: 'TSLA', p: '178.57', c: '-0.45%', u: false },
    { s: 'AMZN', p: '186.21', c: '+0.73%', u: true },
    { s: 'GOOGL', p: '171.42', c: '+1.05%', u: true },
  ];
  // Could implement scrolling ticker tape here
}

// Simulate live price updates
function simulatePriceUpdates() {
  const changes = document.querySelectorAll('.ticker-value');
  // Minor random fluctuation for demo feel
}
setInterval(simulatePriceUpdates, 5000);
