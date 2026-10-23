function initOrder() {
  const root = document.getElementById("order-root");
  const id = new URLSearchParams(location.search).get("id");
  const order = id ? getOrder(id) : null;
  if (!order) {
    root.innerHTML = emptyState("ไม่พบคำสั่งซื้อนี้", "เลขออเดอร์อาจไม่ถูกต้อง หรือถูกลบออกจากเบราว์เซอร์นี้แล้ว", "shop.html", "กลับไปร้านค้า");
    return;
  }
  const items = (order.items || []).map((item) => `
    <li>
      <span>${escapeHtml(item.name)} × ${Number(item.qty) || 0}</span>
      <span>${formatBaht((Number(item.price) || 0) * (Number(item.qty) || 0))}</span>
    </li>`).join("");
  const customer = order.customer || {};
  const note = customer.note ? `<p>หมายเหตุ: ${escapeHtml(customer.note)}</p>` : "";
  const status = order.status === "shipped" ? "จัดส่งแล้ว" : "รับคำสั่งซื้อแล้ว";
  root.innerHTML = `
    <section class="order-banner">
      <p class="eyebrow">คำสั่งซื้อสำเร็จ</p>
      <h1>${escapeHtml(order.id)}</h1>
      <p>${escapeHtml(formatWhen(order.createdAt))} · ${escapeHtml(status)}</p>
    </section>
    <div class="order-grid">
      <section class="panel">
        <h2>รายการ</h2>
        <ul class="order-items">${items}</ul>
        <div class="summary-row"><span>สินค้า</span><span>${formatBaht(order.subtotal || 0)}</span></div>
        <div class="summary-row"><span>ค่าส่ง</span><span>${order.shipping ? formatBaht(order.shipping) : "ฟรี"}</span></div>
        <div class="summary-row total"><span>รวม</span><span>${formatBaht(order.total || 0)}</span></div>
      </section>
      <section class="panel">
        <h2>จัดส่งถึง</h2>
        <p>${escapeHtml(customer.name || "")}</p>
        <p>${escapeHtml(customer.phone || "")}</p>
        <p>${escapeHtml(customer.address || "")}</p>
        <p>${escapeHtml(customer.province || "")}</p>
        ${note}
        <p>ชำระโดย ${escapeHtml(PAYMENT_LABELS[order.payment] || "ไม่ระบุ")}</p>
        <p class="fine">ไม่มีการตัดเงินจากคำสั่งซื้อนี้</p>
      </section>
    </div>
    <div class="hero-actions no-print">
      <button type="button" class="btn btn-ghost" id="print-order">พิมพ์ใบสั่งซื้อ</button>
      <a class="btn" href="shop.html">เลือกซื้อต่อ</a>
      <a class="btn btn-ghost" href="orders.html">ดูออเดอร์ทั้งหมด</a>
    </div>`;
  document.getElementById("print-order").addEventListener("click", () => window.print());
  document.title = `${order.id} — สวนสุข`;
}

if (typeof document !== "undefined") initOrder();
