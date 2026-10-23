const PROVINCES = [
  "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา",
  "ชลบุรี", "ชัยนาท", "ชัยภูมิ", "ชุมพร", "เชียงราย", "เชียงใหม่", "ตรัง", "ตราด", "ตาก", "นครนายก",
  "นครปฐม", "นครพนม", "นครราชสีมา", "นครศรีธรรมราช", "นครสวรรค์", "นนทบุรี", "นราธิวาส", "น่าน",
  "บึงกาฬ", "บุรีรัมย์", "ปทุมธานี", "ประจวบคีรีขันธ์", "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา",
  "พะเยา", "พังงา", "พัทลุง", "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์", "แพร่", "ภูเก็ต",
  "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน", "ยโสธร", "ยะลา", "ร้อยเอ็ด", "ระนอง", "ระยอง", "ราชบุรี",
  "ลพบุรี", "ลำปาง", "ลำพูน", "เลย", "ศรีสะเกษ", "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ",
  "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", "สระบุรี", "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี",
  "สุราษฎร์ธานี", "สุรินทร์", "หนองคาย", "หนองบัวลำภู", "อ่างทอง", "อำนาจเจริญ", "อุดรธานี",
  "อุตรดิตถ์", "อุทัยธานี", "อุบลราชธานี"
];

function fillProvinces() {
  const list = document.getElementById("provinces");
  list.innerHTML = PROVINCES.map((name) => `<option value="${escapeHtml(name)}"></option>`).join("");
}

function showErrors(form, errors) {
  form.querySelectorAll("[data-field]").forEach((field) => {
    field.classList.remove("is-invalid");
    const slot = field.querySelector(".field-error");
    if (slot) slot.textContent = "";
    field.querySelectorAll("input, textarea, select").forEach((input) => {
      input.removeAttribute("aria-invalid");
    });
  });
  const entries = Object.entries(errors);
  entries.forEach(([key, message]) => {
    const field = form.querySelector(`[data-field="${key}"]`);
    if (!field) return;
    field.classList.add("is-invalid");
    const slot = field.querySelector(".field-error");
    if (slot) slot.textContent = message;
    const input = field.querySelector("input, textarea, select");
    if (input) input.setAttribute("aria-invalid", "true");
  });
  if (!entries.length) return;
  const prefer = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  const first = form.querySelector(".is-invalid");
  if (first) first.scrollIntoView({ behavior: prefer, block: "center" });
}

function syncPayment(form) {
  const payment = form.payment.value;
  document.getElementById("card-box").hidden = payment !== "card";
  document.getElementById("promptpay-box").hidden = payment !== "promptpay";
  form.querySelectorAll(".pay-option").forEach((option) => {
    const input = option.querySelector("input");
    option.classList.toggle("is-selected", Boolean(input && input.checked));
  });
}

function renderCheckoutSummary() {
  document.getElementById("summary").innerHTML = summaryHtml(getSummary(), { showItems: true });
}

function onCheckoutSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const result = validateCustomer(data);
  showErrors(form, result.errors);
  if (!result.value) return;
  const summary = getSummary();
  if (!summary.items.length) {
    toast("ตะกร้าว่าง");
    return;
  }
  const button = form.querySelector("[type=submit]");
  button.disabled = true;
  const saved = createOrder(result.value);
  if (!saved) {
    button.disabled = false;
    toast("บันทึกคำสั่งซื้อไม่สำเร็จ");
    return;
  }
  form.reset();
  clearCart();
  updateCartBadge();
  location.href = `order.html?id=${encodeURIComponent(saved.id)}`;
}

function initCheckout() {
  const layout = document.getElementById("checkout-layout");
  const empty = document.getElementById("checkout-empty");
  if (!getSummary().items.length) {
    layout.hidden = true;
    empty.hidden = false;
    empty.innerHTML = emptyState("ยังไม่มีสินค้าให้ชำระ", "เลือกสินค้าใส่ตะกร้าก่อน แล้วค่อยมากรอกที่อยู่", "shop.html", "ไปเลือกสินค้า");
    return;
  }
  fillProvinces();
  renderCheckoutSummary();
  const form = document.getElementById("checkout-form");
  form.addEventListener("change", () => syncPayment(form));
  form.addEventListener("submit", onCheckoutSubmit);
  syncPayment(form);
}

if (typeof document !== "undefined") initCheckout();
