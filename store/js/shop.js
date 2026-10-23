function readShopState() {
  const params = new URLSearchParams(location.search);
  const knownSort = new Set(["featured", "price-asc", "price-desc", "name"]);
  const cat = params.get("cat") || "all";
  const validCat = cat === "all" || CATEGORIES.some((category) => category.id === cat);
  const sort = params.get("sort") || "featured";
  return {
    q: params.get("q") || "",
    cat: validCat ? cat : "all",
    sort: knownSort.has(sort) ? sort : "featured"
  };
}

function shopState() {
  return shopState.current;
}

function buildChips() {
  const chips = document.getElementById("chips");
  const all = [{ id: "all", label: "ทั้งหมด" }].concat(CATEGORIES);
  chips.innerHTML = all.map((category) => {
    const count = category.id === "all"
      ? PRODUCTS.length
      : PRODUCTS.filter((product) => product.category === category.id).length;
    return `<button type="button" class="chip" data-cat="${category.id}">${escapeHtml(category.label)} ${count}</button>`;
  }).join("");
}

function updateChips() {
  const state = shopState.current;
  document.querySelectorAll("#chips [data-cat]").forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.cat === state.cat ? "true" : "false");
  });
}

function syncShopUrl() {
  const state = shopState.current;
  const params = new URLSearchParams();
  if (state.q.trim()) params.set("q", state.q.trim());
  if (state.cat !== "all") params.set("cat", state.cat);
  if (state.sort !== "featured") params.set("sort", state.sort);
  const query = params.toString();
  history.replaceState(null, "", query ? `shop.html?${query}` : "shop.html");
}

function renderShopResults() {
  const state = shopState.current;
  const items = filterProducts(state);
  const grid = document.getElementById("grid");
  const count = document.getElementById("shop-count");
  const query = state.q.trim();
  if (!items.length) {
    grid.innerHTML = `
      <div class="empty" style="grid-column: 1 / -1">
        <h2>ไม่พบสินค้า</h2>
        <p>${query ? `ไม่มีรายการที่ตรงกับ “${escapeHtml(query)}”` : "ไม่มีสินค้าในหมวดนี้"}</p>
        <p><button type="button" class="btn" data-clear>ล้างตัวกรอง</button></p>
      </div>`;
  } else {
    grid.innerHTML = items.map(productCard).join("");
  }
  const suffix = query ? ` สำหรับ “${query}”` : "";
  count.textContent = items.length ? `พบ ${items.length} รายการ${suffix}` : `ไม่พบสินค้า${suffix}`;
  syncShopUrl();
}

function initShop() {
  shopState.current = readShopState();
  buildChips();
  updateChips();
  const sort = document.getElementById("sort");
  sort.value = shopState.current.sort;
  sort.addEventListener("change", () => {
    shopState.current.sort = sort.value;
    renderShopResults();
  });
  document.getElementById("chips").addEventListener("click", (event) => {
    const button = event.target.closest("[data-cat]");
    if (!button) return;
    shopState.current.cat = button.dataset.cat;
    updateChips();
    renderShopResults();
  });
  document.getElementById("grid").addEventListener("click", (event) => {
    if (!event.target.closest("[data-clear]")) return;
    shopState.current = { q: "", cat: "all", sort: "featured" };
    const input = document.querySelector(".search input");
    if (input) input.value = "";
    sort.value = "featured";
    updateChips();
    renderShopResults();
  });
  document.addEventListener("shop-query", (event) => {
    shopState.current.q = event.detail;
    renderShopResults();
  });
  renderShopResults();
}

if (typeof document !== "undefined") initShop();
