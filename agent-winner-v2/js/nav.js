// Auto-inject nav and ticker, mark active menu

const NAV_ITEMS = [
  { href: 'index.html', icon: '🏠', label: 'หน้าแรก' },
  { href: 'hermes.html', icon: '🧠', label: 'Hermes' },
  { href: 'scanner.html', icon: '🔍', label: 'สแกนหุ้น' },
  { href: 'stock.html', icon: '📈', label: 'ห้องหุ้น' },
  { href: 'agents.html', icon: '🤖', label: 'เอเจนต์' },
  { href: 'team.html', icon: '🏢', label: 'ทีม AI' },
  { href: 'portfolio.html', icon: '💼', label: 'พอร์ต' },
  { href: 'devlab.html', icon: '⚗️', label: 'Dev Lab' },
  { href: 'settings.html', icon: '⚙️', label: 'ตั้งค่า' },
];

function buildNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  const menuHtml = NAV_ITEMS.map(item => {
    const active = current === item.href ? 'active' : '';
    return `<a href="${item.href}" class="nav-item ${active}">${item.icon} ${item.label}</a>`;
  }).join('');

  const nav = document.getElementById('topnav');
  if (nav) {
    nav.innerHTML = `
      <div class="logo"><span class="logo-icon">⬡</span><span class="logo-text">เอเจนวินเนอร์</span></div>
      <div class="topnav-menu">${menuHtml}</div>
      <div class="topnav-right">
        <span class="status-dot online"></span><span class="text-sm">ตลาดเปิด</span>
        <span class="divider">|</span>
        <span class="status-dot online"></span><span class="text-sm">Hermes Online</span>
        <input class="input search-input" placeholder="ค้นหา..." />
        <div class="avatar" style="background:var(--accent-subtle);display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--accent)">J</div>
        <span class="text-sm">Janie</span>
      </div>
    `;
  }

  const ticker = document.getElementById('ticker');
  if (ticker) {
    ticker.innerHTML = `
      <span class="ticker-item"><span class="ticker-label">S&amp;P500</span><span class="ticker-value" id="t-sp500">5,325</span><span class="price-up" id="t-sp500-c">+0.88%</span></span>
      <span class="ticker-item"><span class="ticker-label">NASDAQ</span><span class="ticker-value" id="t-nasdaq">17,721</span><span class="price-up" id="t-nasdaq-c">+1.35%</span></span>
      <span class="ticker-item"><span class="ticker-label">VIX</span><span class="ticker-value" id="t-vix">13.62</span><span class="price-down" id="t-vix-c">-5.23%</span></span>
      <span class="ticker-item"><span class="ticker-label">HIMS</span><span class="ticker-value" id="t-hims">--</span><span id="t-hims-c">--</span></span>
      <span class="ticker-item"><span class="ticker-label">ZETA</span><span class="ticker-value" id="t-zeta">--</span><span id="t-zeta-c">--</span></span>
      <span class="ticker-item"><span class="ticker-label">RXRX</span><span class="ticker-value" id="t-rxrx">--</span><span id="t-rxrx-c">--</span></span>
      <span class="ticker-item"><span class="ticker-label">NVDA</span><span class="ticker-value" id="t-nvda">--</span><span id="t-nvda-c">--</span></span>
      <span class="ticker-item"><span class="ticker-label">BTC</span><span class="ticker-value" id="t-btc">--</span><span id="t-btc-c">--</span></span>
    `;
  }
}

document.addEventListener('DOMContentLoaded', buildNav);
