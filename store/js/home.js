function initHome() {
  document.querySelectorAll("[data-icon]").forEach((el) => {
    el.innerHTML = iconSvg(el.dataset.icon);
  });
  document.querySelectorAll("[data-price-for]").forEach((el) => {
    const product = getProduct(el.dataset.priceFor);
    if (product) el.textContent = formatBaht(product.price);
  });
  const count = document.getElementById("product-count");
  if (count) count.textContent = String(PRODUCTS.length);
  document.getElementById("featured").innerHTML = PRODUCTS.filter((product) => product.featured).map(productCard).join("");
  document.getElementById("fresh").innerHTML = PRODUCTS.filter((product) => !product.featured).slice(0, 4).map(productCard).join("");
}

if (typeof document !== "undefined") initHome();
