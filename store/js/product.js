function stockLabel(product) {
  if (product.stock <= 0) return "สินค้าหมด";
  if (product.stock <= 5) return `เหลือน้อย เหลือ ${product.stock} ชิ้น`;
  return "มีสินค้าพร้อมส่ง";
}

function relatedProducts(product) {
  const same = PRODUCTS.filter((item) => item.category === product.category && item.id !== product.id);
  const rest = PRODUCTS.filter((item) => item.category !== product.category);
  return same.concat(rest).slice(0, 3);
}

function renderProduct(root, product) {
  const soldOut = product.stock <= 0;
  const details = product.details.map((line) => `<li>${escapeHtml(line)}</li>`).join("");
  const related = relatedProducts(product).map(productCard).join("");
  root.innerHTML = `
    <p class="crumbs"><a href="index.html">หน้าแรก</a> · <a href="shop.html?cat=${encodeURIComponent(product.category)}">${escapeHtml(categoryLabel(product.category))}</a> · ${escapeHtml(product.name)}</p>
    <div class="product-layout">
      <div class="product-visual tone-${toneClass(product.tone)}">${iconSvg(product.icon)}</div>
      <div class="product-copy">
        <p class="eyebrow">${escapeHtml(product.origin)} · ${escapeHtml(product.weight)}</p>
        <h1>${escapeHtml(product.name)}</h1>
        <p class="price">${formatBaht(product.price)}</p>
        <p>${escapeHtml(product.description)}</p>
        <p class="meta" id="stock-label">${escapeHtml(stockLabel(product))}</p>
        <ul class="specs">${details}</ul>
        <div class="buy-row">
          <div class="stepper">
            <button type="button" data-step="-1" aria-label="ลดจำนวน">−</button>
            <input id="qty" type="number" min="1" max="${product.stock}" value="1" inputmode="numeric" aria-label="จำนวน">
            <button type="button" data-step="1" aria-label="เพิ่มจำนวน">+</button>
          </div>
          <button type="button" class="btn" id="add-btn" data-add="${escapeHtml(product.id)}" data-qty="1"${soldOut ? " disabled" : ""}>${soldOut ? "สินค้าหมด" : "ใส่ตะกร้า"}</button>
        </div>
      </div>
    </div>
    <section class="section">
      <div class="section-head"><h2>ดูเพิ่ม</h2></div>
      <div class="grid">${related}</div>
    </section>`;
  document.title = `${product.name} — สวนสุข`;
}

function bindProduct(root, product) {
  const input = root.querySelector("#qty");
  const addBtn = root.querySelector("#add-btn");

  function syncQty(next) {
    const max = Math.max(product.stock, 1);
    const qty = Math.min(max, Math.max(1, Math.floor(Number(next) || 1)));
    input.value = String(product.stock <= 0 ? 0 : qty);
    if (addBtn) addBtn.dataset.qty = String(product.stock <= 0 ? 1 : qty);
  }

  root.addEventListener("click", (event) => {
    const step = event.target.closest("[data-step]");
    if (!step || product.stock <= 0) return;
    syncQty(Number(input.value) + Number(step.dataset.step));
  });
  input.addEventListener("change", () => syncQty(input.value));
}

function initProduct() {
  const root = document.getElementById("product-root");
  const id = new URLSearchParams(location.search).get("id");
  const product = id ? getProduct(id) : null;
  if (!product) {
    root.innerHTML = emptyState("ไม่พบสินค้านี้", "ลิงก์อาจเก่า หรือสินค้าถูกนำออกจากร้านแล้ว", "shop.html", "กลับไปร้านค้า");
    return;
  }
  renderProduct(root, product);
  bindProduct(root, product);
}

if (typeof document !== "undefined") initProduct();
