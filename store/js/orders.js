function renderOrders() {
  const root = document.getElementById("orders-root");
  const orders = getOrders();
  if (!orders.length) {
    root.innerHTML = emptyState("ยังไม่มีออเดอร์", "เมื่อมีคนสั่งซื้อจากหน้าชำระเงิน รายการจะมาอยู่ที่นี่", "shop.html", "ไปหน้าร้าน");
    return;
  }
  const cards = orders.map((order) => {
    const shipped = order.status === "shipped";
    const customer = order.customer || {};
    const count = (order.items || []).reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
    return `
      <article class="order-card">
        <header>
          <div>
            <strong><a href="order.html?id=${encodeURIComponent(order.id)}">${escapeHtml(order.id)}</a></strong>
            <p class="meta">${escapeHtml(formatWhen(order.createdAt))}</p>
          </div>
          <span class="pill${shipped ? " shipped" : ""}">${shipped ? "จัดส่งแล้ว" : "ออเดอร์ใหม่"}</span>
        </header>
        <p>${escapeHtml(customer.name || "ไม่ระบุชื่อ")} · ${escapeHtml(customer.province || "")}</p>
        <p class="meta">${count} ชิ้น · ${escapeHtml(PAYMENT_LABELS[order.payment] || "")}</p>
        <div class="row-between">
          <strong>${formatBaht(order.total || 0)}</strong>
          <button type="button" class="btn btn-small btn-ghost" data-status="${escapeHtml(order.id)}" data-next="${shipped ? "new" : "shipped"}">${shipped ? "เปลี่ยนกลับเป็นออเดอร์ใหม่" : "ทำเครื่องหมายว่าจัดส่งแล้ว"}</button>
        </div>
      </article>`;
  }).join("");
  root.innerHTML = `
    <div class="row-between no-print">
      <p class="meta">${orders.length} คำสั่งซื้อ</p>
      <button type="button" class="linkish" id="clear-orders">ล้างออเดอร์ตัวอย่าง</button>
    </div>
    <div class="orders">${cards}</div>`;
}

function initOrders() {
  const root = document.getElementById("orders-root");
  root.addEventListener("click", (event) => {
    const statusBtn = event.target.closest("[data-status]");
    if (statusBtn) {
      updateOrderStatus(statusBtn.dataset.status, statusBtn.dataset.next);
      renderOrders();
      return;
    }
    if (event.target.closest("#clear-orders")) {
      const ok = window.confirm("ล้างออเดอร์ทั้งหมดในเบราว์เซอร์นี้?");
      if (!ok) return;
      clearOrders();
      renderOrders();
    }
  });
  renderOrders();
}

if (typeof document !== "undefined") initOrders();
