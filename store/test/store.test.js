const fs = require("fs");
const path = require("path");
const vm = require("vm");

const memory = {};
const localStorage = {
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(memory, key) ? memory[key] : null;
  },
  setItem(key, value) {
    memory[key] = String(value);
  },
  removeItem(key) {
    delete memory[key];
  },
  clear() {
    Object.keys(memory).forEach((key) => delete memory[key]);
  }
};

const context = vm.createContext({ localStorage, console });
const root = path.join(__dirname, "..");

function load(rel) {
  vm.runInContext(fs.readFileSync(path.join(root, rel), "utf8"), context, { filename: rel });
}

load("js/catalog.js");
load("js/validate.js");
load("js/storage.js");

const failures = [];
let passed = 0;

function assert(condition, message) {
  if (!condition) failures.push(message);
  else passed += 1;
}

function reset() {
  localStorage.clear();
}

reset();
assert(context.PRODUCTS.length === 12, "catalog has 12 products");
assert(context.getProduct("soap").price === 85, "soap price");
assert(context.filterProducts({ q: "เชียง" }).some((item) => item.id === "coffee"), "search chiang finds coffee");
assert(context.filterProducts({ cat: "drink" }).every((item) => item.category === "drink"), "drink filter");
assert(!context.filterProducts({ cat: "pantry" }).some((item) => item.id === "coffee"), "pantry excludes coffee");
const cheapest = context.filterProducts({ sort: "price-asc" })[0];
assert(cheapest.id === "soap", "cheapest is soap");

assert(context.shippingFee(0) === 0, "no fee on empty");
assert(context.shippingFee(799) === 49, "fee under 800");
assert(context.shippingFee(800) === 0, "free at 800");
assert(context.shippingFee(801) === 0, "free over 800");

const added = context.addToCart("jasmine-rice", 1);
assert(added.ok && added.qty === 1, "add rice");
let summary = context.getSummary();
assert(summary.subtotal === 289, "rice subtotal");
assert(summary.shipping === 49, "rice shipping");
assert(summary.total === 338, "rice total");
assert(summary.freeRemaining === 511, "remaining to free shipping");

assert(!context.addToCart("shawl", 5).ok, "cannot exceed shawl stock");
assert(context.getCart().every((line) => line.id !== "shawl"), "failed add does not insert shawl");
assert(context.addToCart("shawl", 2).ok, "add two shawls");
assert(!context.addToCart("shawl", 2).ok, "second shawl add exceeds stock");
assert(context.getCart().find((line) => line.id === "shawl").qty === 2, "shawl qty stays 2");

context.setQty("shawl", 0);
assert(!context.getCart().some((line) => line.id === "shawl"), "zero qty removes shawl");

reset();
context.addToCart("jasmine-rice", 3);
summary = context.getSummary();
assert(summary.subtotal === 867 && summary.shipping === 0 && summary.total === 867, "three bags ship free");

reset();
localStorage.setItem("suansuk-cart", "{");
assert(context.getCart().length === 0, "bad cart json is empty");
localStorage.setItem("suansuk-cart", JSON.stringify([{ id: "missing", qty: 2 }, { id: "soap", qty: 2 }]));
context.normalizeCart();
assert(context.getCart().length === 1 && context.getCart()[0].id === "soap", "unknown ids dropped");

reset();
const missing = context.validateCustomer({});
assert(missing.errors.name && missing.errors.phone && missing.errors.payment && !missing.value, "empty form errors");
const dashed = context.validateCustomer({
  name: "สมชาย ใจดี",
  phone: "081-234-5678",
  address: "123 ถนนสุขุมวิท แขวงคลองเตย",
  province: "กรุงเทพมหานคร",
  note: "",
  payment: "cod"
});
assert(dashed.value && dashed.value.phone === "0812345678", "phone keeps digits only");
assert(!("cardNumber" in dashed.value), "cod value has no card");

const badCard = context.validateCustomer({
  name: "สมชาย",
  phone: "0812345678",
  address: "123 ถนนสุขุมวิท แขวงคลองเตย",
  province: "เชียงใหม่",
  payment: "card",
  cardNumber: "4242424242424243",
  cardExpiry: "13/35",
  cardName: "A"
});
assert(badCard.errors.cardNumber && badCard.errors.cardExpiry && badCard.errors.cardName, "bad card errors");

const goodCard = context.validateCustomer({
  name: "สมชาย",
  phone: "0812345678",
  address: "123 ถนนสุขุมวิท แขวงคลองเตย",
  province: "เชียงใหม่",
  payment: "card",
  cardNumber: "4242 4242 4242 4242",
  cardExpiry: "12 / 35",
  cardName: "SOMCHAI"
});
assert(goodCard.value && goodCard.value.payment === "card" && goodCard.value.cardNumber === undefined, "valid card is not returned");

const longNote = context.validateCustomer({
  name: "สมชาย",
  phone: "021234567",
  address: "123 ถนนสุขุมวิท แขวงคลองเตย",
  province: "เชียงใหม่",
  payment: "promptpay",
  note: "ก".repeat(301)
});
assert(longNote.errors.note, "note limit");

reset();
context.addToCart("soap", 2);
const soap = context.getProduct("soap");
const originalPrice = soap.price;
const order = context.createOrder(dashed.value);
assert(order && order.total === 219, "soap order total includes shipping");
assert(order.customer.phone === "0812345678", "order stores normalized phone");
assert(!Object.prototype.hasOwnProperty.call(order, "cardNumber"), "order has no card field");
soap.price = 1;
assert(context.getOrders()[0].items[0].price === 85, "order snapshots price");
soap.price = originalPrice;
assert(context.getOrders()[0].id === order.id, "order is saved");
context.updateOrderStatus(order.id, "shipped");
assert(context.getOrder(order.id).status === "shipped", "status updates");
context.clearCart();
assert(context.getCart().length === 0, "cart clears");
assert(/^SS-\d{8}$/.test(order.id), "order id shape");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`ok ${passed}`);
