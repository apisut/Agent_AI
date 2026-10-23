const CART_KEY = "suansuk-cart";
const ORDERS_KEY = "suansuk-orders";
var FREE_SHIPPING_MIN = 800;
var SHIPPING_FEE = 49;

var PAYMENT_LABELS = {
  cod: "เก็บเงินปลายทาง",
  promptpay: "พร้อมเพย์",
  card: "บัตรเดบิตหรือเครดิต"
};

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    return false;
  }
}

function getCart() {
  const data = readJson(CART_KEY, []);
  if (!Array.isArray(data)) return [];
  return data
    .filter((line) => line && typeof line.id === "string" && Number(line.qty) > 0)
    .map((line) => ({ id: line.id, qty: Math.floor(Number(line.qty)) }));
}

function saveCart(cart) {
  return writeJson(CART_KEY, cart);
}

function clearCart() {
  return saveCart([]);
}

function setQty(id, qty) {
  const product = getProduct(id);
  if (!product) return { ok: false, message: "ไม่พบสินค้า" };
  const nextQty = Math.floor(Number(qty) || 0);
  const cart = getCart();
  const index = cart.findIndex((line) => line.id === id);
  if (nextQty <= 0) {
    if (index >= 0) cart.splice(index, 1);
    if (!saveCart(cart)) return { ok: false, message: "บันทึกตะกร้าไม่สำเร็จ" };
    return { ok: true, removed: true };
  }
  if (nextQty > product.stock) {
    return { ok: false, message: `สั่งได้ไม่เกิน ${product.stock} ชิ้น` };
  }
  if (index >= 0) cart[index].qty = nextQty;
  else cart.push({ id, qty: nextQty });
  if (!saveCart(cart)) return { ok: false, message: "บันทึกตะกร้าไม่สำเร็จ" };
  return { ok: true };
}

function addToCart(id, qty) {
  const product = getProduct(id);
  if (!product) return { ok: false, message: "ไม่พบสินค้า" };
  if (product.stock <= 0) return { ok: false, message: "สินค้าหมด" };
  const add = Math.max(1, Math.floor(Number(qty) || 1));
  const current = getCart().find((line) => line.id === id);
  const next = (current ? current.qty : 0) + add;
  if (next > product.stock) {
    return { ok: false, message: `เหลือสินค้า ${product.stock} ชิ้น` };
  }
  const saved = setQty(id, next);
  if (!saved.ok) return saved;
  return { ok: true, product, qty: next };
}

function normalizeCart() {
  const cart = getCart()
    .map((line) => {
      const product = getProduct(line.id);
      if (!product || product.stock <= 0) return null;
      const qty = Math.min(line.qty, product.stock);
      if (qty < 1) return null;
      return { id: line.id, qty };
    })
    .filter(Boolean);
  saveCart(cart);
  return cart;
}

function shippingFee(subtotal) {
  if (subtotal <= 0 || subtotal >= FREE_SHIPPING_MIN) return 0;
  return SHIPPING_FEE;
}

function amountUntilFreeShipping(subtotal) {
  if (subtotal <= 0) return FREE_SHIPPING_MIN;
  return Math.max(0, FREE_SHIPPING_MIN - subtotal);
}

function getSummary() {
  const items = normalizeCart()
    .map((line) => {
      const product = getProduct(line.id);
      if (!product) return null;
      return { product, qty: line.qty, lineTotal: product.price * line.qty };
    })
    .filter(Boolean);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = shippingFee(subtotal);
  return {
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
    freeRemaining: amountUntilFreeShipping(subtotal)
  };
}

function getOrders() {
  const data = readJson(ORDERS_KEY, []);
  return Array.isArray(data) ? data : [];
}

function getOrder(id) {
  return getOrders().find((order) => order.id === id) || null;
}

function makeOrderId() {
  const orders = getOrders();
  let id = "";
  do {
    const stamp = Date.now().toString().slice(-6);
    const suffix = String(Math.floor(Math.random() * 90) + 10);
    id = `SS-${stamp}${suffix}`;
  } while (orders.some((order) => order.id === id));
  return id;
}

function createOrder(customer) {
  const summary = getSummary();
  if (!summary.items.length) return null;
  const order = {
    id: makeOrderId(),
    createdAt: new Date().toISOString(),
    status: "new",
    customer: {
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      province: customer.province,
      note: customer.note || ""
    },
    payment: customer.payment,
    items: summary.items.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      qty: item.qty
    })),
    subtotal: summary.subtotal,
    shipping: summary.shipping,
    total: summary.total
  };
  const orders = getOrders();
  orders.unshift(order);
  if (!writeJson(ORDERS_KEY, orders)) return null;
  return order;
}

function updateOrderStatus(id, status) {
  if (status !== "new" && status !== "shipped") return null;
  const orders = getOrders();
  const order = orders.find((item) => item.id === id);
  if (!order) return null;
  order.status = status;
  if (!writeJson(ORDERS_KEY, orders)) return null;
  return order;
}

function clearOrders() {
  return writeJson(ORDERS_KEY, []);
}
