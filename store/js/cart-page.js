function renderCart(focusKey) {
  const root = document.getElementById("cart-root");
  const summary = getSummary();
  if (!summary.items.length) {
    root.innerHTML = emptyState("ตะกร้ายังว่างอยู่", "เลือกของจากร้านแล้วกลับมาที่นี่เพื่อสั่งซื้อ", "shop.html", "ไปเลือกสินค้า");
    updateCartBadge();
    return;
  }
  const lines = summary.items.map((item) => {
    const product = item.product;
    return `
      <article class="line">
        <a class="line-media tone-${toneClass(product.tone)}" href="product.html?id=${encodeURIComponent(product.id)}" aria-label="${escapeHtml(product.name)}">${iconSvg(product.icon)}</a>
        <div class="line-main">
          <p class="line-name"><a href="product.html?id=${encodeURIComponent(product.id)}">${escapeHtml(product.name)}</a></p>
          <p class="meta">${escapeHtml(product.weight)} · ${formatBaht(product.price)}</p>
          <div class="line-actions">
            <div class="stepper">
              <button type="button" data-step="-1" data-id="${escapeHtml(product.id)}" data-focus="dec-${escapeHtml(product.id)}" aria-label="ลดจำนวน ${escapeHtml(product.name)}">−</button>
              <input data-qty-input="${escapeHtml(product.id)}" data-focus="qty-${escapeHtml(product.id)}" type="number" min="1" max="${product.stock}" value="${item.qty}" inputmode="numeric" aria-label="จำนวน ${escapeHtml(product.name)}">
              <button type="button" data-step="1" data-id="${escapeHtml(product.id)}" data-focus="inc-${escapeHtml(product.id)}" aria-label="เพิ่มจำนวน ${escapeHtml(product.name)}">+</button>
            </div>
            <button type="button" class="linkish" data-remove="${escapeHtml(product.id)}">เอาออก</button>
          </div>
        </div>
        <p class="price line-total">${formatBaht(item.lineTotal)}</p>
      </article>`;
  }).join("");
  root.innerHTML = `
    <div class="cart-layout">
      <div>${lines}</div>
      <aside class="summary">${summaryHtml(summary, { checkoutLink: true })}</aside>
    </div>`;
  updateCartBadge();
  if (!focusKey) return;
  const target = root.querySelector(`[data-focus="${focusKey}"]`);
  if (target) target.focus();
}

function initCartPage() {
  const root = document.getElementById("cart-root");
  root.addEventListener("click", (event) => {
    const step = event.target.closest("[data-step]");
    const remove = event.target.closest("[data-remove]");
    if (step) {
      const id = step.dataset.id;
      const current = getCart().find((line) => line.id === id);
      const result = setQty(id, (current ? current.qty : 0) + Number(step.dataset.step));
      if (!result.ok) toast(result.message);
      renderCart(step.dataset.focus);
      return;
    }
    if (remove) {
      setQty(remove.dataset.remove, 0);
      renderCart();
    }
  });
  root.addEventListener("change", (event) => {
    const input = event.target.closest("[data-qty-input]");
    if (!input) return;
    const result = setQty(input.dataset.qtyInput, input.value);
    if (!result.ok) toast(result.message);
    renderCart(input.dataset.focus);
  });
  renderCart();
}

if (typeof document !== "undefined") initCartPage();
