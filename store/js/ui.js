function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatBaht(amount) {
  return `${new Intl.NumberFormat("th-TH").format(amount)} บาท`;
}

function formatWhen(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Bangkok"
  }).format(date);
}

function toneClass(tone) {
  const allowed = new Set(["sand", "leaf", "clay", "mist", "bloom"]);
  return allowed.has(tone) ? tone : "sand";
}

function productCard(product) {
  const soldOut = product.stock <= 0;
  const badge = product.badge ? `<span class="badge">${escapeHtml(product.badge)}</span>` : "";
  const href = `product.html?id=${encodeURIComponent(product.id)}`;
  return `
    <article class="card">
      <a class="card-media tone-${toneClass(product.tone)}" href="${href}">
        <span class="illu">${iconSvg(product.icon)}</span>
        ${badge}
      </a>
      <div class="card-body">
        <p class="eyebrow">${escapeHtml(categoryLabel(product.category))} · ${escapeHtml(product.origin)}</p>
        <h3><a href="${href}">${escapeHtml(product.name)}</a></h3>
        <p class="meta">${escapeHtml(product.weight)}</p>
        <div class="card-row">
          <p class="price">${formatBaht(product.price)}</p>
          <button type="button" class="btn btn-small" data-add="${escapeHtml(product.id)}" data-qty="1"${soldOut ? " disabled" : ""}>${soldOut ? "สินค้าหมด" : "ใส่ตะกร้า"}</button>
        </div>
      </div>
    </article>`;
}

function emptyState(title, text, href, label) {
  const link = href ? `<p><a class="btn" href="${escapeHtml(href)}">${escapeHtml(label || "ไปต่อ")}</a></p>` : "";
  return `<div class="empty"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(text)}</p>${link}</div>`;
}

function summaryHtml(summary, options) {
  const showItems = Boolean(options && options.showItems);
  const withCheckout = Boolean(options && options.checkoutLink);
  const itemRows = showItems
    ? summary.items.map((item) => `
        <div class="summary-row minor">
          <span>${escapeHtml(item.product.name)} × ${item.qty}</span>
          <span>${formatBaht(item.lineTotal)}</span>
        </div>`).join("")
    : "";
  let hint = "";
  if (summary.subtotal > 0 && summary.freeRemaining === 0) hint = `<p class="ship-hint">ยอดนี้ส่งฟรี</p>`;
  else if (summary.subtotal > 0) hint = `<p class="ship-hint">ซื้ออีก ${formatBaht(summary.freeRemaining)} ส่งฟรี</p>`;
  const shippingLabel = summary.shipping === 0 ? "ฟรี" : formatBaht(summary.shipping);
  const checkout = withCheckout ? `<a class="btn btn-block" href="checkout.html">ไปชำระเงิน</a>` : "";
  return `
    <h2>สรุปคำสั่งซื้อ</h2>
    ${hint}
    ${itemRows}
    <div class="summary-row"><span>สินค้า</span><span>${formatBaht(summary.subtotal)}</span></div>
    <div class="summary-row"><span>ค่าส่ง</span><span>${shippingLabel}</span></div>
    <div class="summary-row total"><span>รวม</span><span>${formatBaht(summary.total)}</span></div>
    ${checkout}`;
}

function toast(message) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    el.hidden = true;
  }, 2400);
}

function updateCartBadge() {
  const count = getCart().reduce((sum, line) => sum + line.qty, 0);
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = String(count);
  });
  const link = document.querySelector(".cart-link");
  if (link) link.setAttribute("aria-label", `ตะกร้าสินค้า ${count} ชิ้น`);
}

function renderChrome() {
  const page = document.body.dataset.page || "";
  const current = { product: "shop", checkout: "cart", order: "cart" }[page] || page;
  const nav = [
    ["home", "index.html", "หน้าแรก"],
    ["shop", "shop.html", "ร้านค้า"],
    ["story", "index.html#story", "เรื่องร้าน"]
  ].map(([id, href, label]) => {
    const currentAttr = id === current ? ` aria-current="page"` : "";
    return `<a href="${href}" data-nav="${id}"${currentAttr}>${label}</a>`;
  }).join("");

  document.getElementById("site-header").innerHTML = `
    <header class="site-header">
      <div class="announce" id="announce"></div>
      <div class="header-inner">
        <a class="logo" href="index.html">
          <span class="logo-mark" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M16 28S6 20 6 12a6 6 0 0 1 10-4 6 6 0 0 1 10 4c0 8-10 16-10 16z" fill="currentColor"/></svg></span>
          <span>สวนสุข</span>
        </a>
        <form class="search" action="shop.html" method="get" role="search">
          <input type="search" name="q" placeholder="ค้นหา ข้าว ชา สบู่" aria-label="ค้นหาสินค้า" enterkeyhint="search">
          <button class="btn btn-small" type="submit">ค้นหา</button>
        </form>
        <a class="cart-link" href="cart.html" data-nav="cart">
          ตะกร้า <span class="cart-count" data-cart-count>0</span>
        </a>
        <button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav">เมนู</button>
        <nav class="nav" id="site-nav" aria-label="หลัก">${nav}</nav>
      </div>
    </header>`;

  const cartLink = document.querySelector(".cart-link");
  if (current === "cart" && cartLink) cartLink.setAttribute("aria-current", "page");

  document.getElementById("site-footer").innerHTML = `
    <footer class="footer">
      <div class="footer-inner">
        <strong class="logo-word">สวนสุข</strong>
        <p>ของกินและของใช้ที่คัดจากชุมชน ส่งถึงบ้าน</p>
        <div class="footer-links">
          <a href="shop.html">ร้านค้า</a>
          <a href="cart.html">ตะกร้า</a>
          <a href="orders.html">ออเดอร์ในเครื่องนี้</a>
        </div>
        <p class="fine">ร้านตัวอย่างสำหรับขายของออนไลน์ ตะกร้าและคำสั่งซื้ออยู่เฉพาะในเบราว์เซอร์นี้ ไม่มีการตัดเงินจริง</p>
      </div>
    </footer>`;

  const announce = document.getElementById("announce");
  if (announce) {
    announce.textContent = `ส่งฟรีเมื่อซื้อครบ ${formatBaht(FREE_SHIPPING_MIN)} · จัดส่งทั่วประเทศ จันทร์ถึงเสาร์`;
  }
}

function bindChrome() {
  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav");
  menuBtn.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    document.body.classList.remove("nav-open");
    menuBtn.setAttribute("aria-expanded", "false");
  });

  const form = document.querySelector(".search");
  const input = form.querySelector("input");
  const params = new URLSearchParams(location.search);
  if (params.get("q")) input.value = params.get("q");

  form.addEventListener("submit", (event) => {
    if (document.body.dataset.page !== "shop") return;
    event.preventDefault();
    document.dispatchEvent(new CustomEvent("shop-query", { detail: input.value }));
  });
  input.addEventListener("input", () => {
    if (document.body.dataset.page !== "shop") return;
    document.dispatchEvent(new CustomEvent("shop-query", { detail: input.value }));
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add]");
    if (!button || button.disabled) return;
    const result = addToCart(button.dataset.add, button.dataset.qty || 1);
    if (!result.ok) {
      toast(result.message);
      return;
    }
    updateCartBadge();
    toast(`ใส่ตะกร้าแล้ว · ${result.product.name} รวม ${result.qty} ชิ้น`);
  });
}

function initUi() {
  renderChrome();
  normalizeCart();
  updateCartBadge();
  bindChrome();
}

if (typeof document !== "undefined") initUi();
