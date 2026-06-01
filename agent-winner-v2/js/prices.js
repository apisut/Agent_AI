const TICKERS = ['HIMS','ZETA','RXRX','SOUN','BBAI','PLTR','NVDA','AMD','^GSPC','^IXIC','^VIX','GC=F','BTC-USD'];
const TICKER_MAP = { '^GSPC':'sp500', '^IXIC':'nasdaq', '^VIX':'vix', 'HIMS':'hims', 'ZETA':'zeta', 'RXRX':'rxrx', 'NVDA':'nvda', 'BTC-USD':'btc' };

async function fetchPrice(symbol) {
  const url = `https://corsproxy.io/?https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=2d`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    const meta = json.chart.result[0].meta;
    const price = meta.regularMarketPrice;
    const prev = meta.previousClose || meta.chartPreviousClose;
    const change = prev ? ((price - prev) / prev * 100) : 0;
    return { price, change };
  } catch { return null; }
}

async function updatePrices() {
  for (const sym of TICKERS) {
    const data = await fetchPrice(sym);
    if (!data) continue;
    const key = TICKER_MAP[sym] || sym.toLowerCase();
    const valEl = document.getElementById(`t-${key}`);
    const chgEl = document.getElementById(`t-${key}-c`);
    if (valEl) valEl.textContent = data.price.toFixed(2);
    if (chgEl) {
      const sign = data.change >= 0 ? '+' : '';
      chgEl.textContent = `${sign}${data.change.toFixed(2)}%`;
      chgEl.className = data.change >= 0 ? 'price-up' : 'price-down';
    }
    // Update any elements with data-ticker attribute
    document.querySelectorAll(`[data-ticker="${sym}"]`).forEach(el => {
      if (el.dataset.field === 'price') el.textContent = data.price.toFixed(2);
      if (el.dataset.field === 'change') {
        const sign = data.change >= 0 ? '+' : '';
        el.textContent = `${sign}${data.change.toFixed(2)}%`;
        el.className = data.change >= 0 ? 'price-up' : 'price-down';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updatePrices();
  setInterval(updatePrices, 60000);
});
