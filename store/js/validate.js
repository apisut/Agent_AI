function luhn(num) {
  let sum = 0;
  let alt = false;
  for (let i = num.length - 1; i >= 0; i -= 1) {
    let digit = parseInt(num[i], 10);
    if (alt) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function validExpiry(raw) {
  const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec((raw || "").trim());
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const expires = new Date(year, month, 1);
  return expires > new Date();
}

function validateCustomer(input) {
  const errors = {};
  const name = (input.name || "").trim();
  const phone = (input.phone || "").replace(/[\s-]/g, "");
  const address = (input.address || "").trim();
  const province = (input.province || "").trim();
  const note = (input.note || "").trim();
  const payment = input.payment || "";

  if (name.length < 2) errors.name = "ใส่ชื่อผู้รับอย่างน้อย 2 ตัวอักษร";
  if (!/^0\d{8,9}$/.test(phone)) errors.phone = "ใส่เบอร์โทร 9–10 หลัก ขึ้นต้นด้วย 0";
  if (address.length < 10) errors.address = "ใส่ที่อยู่ให้ครบ เช่น บ้านเลขที่ ถนน แขวงหรือตำบล";
  if (province.length < 2) errors.province = "ใส่จังหวัด";
  if (!["cod", "promptpay", "card"].includes(payment)) errors.payment = "เลือกวิธีชำระเงิน";
  if (note.length > 300) errors.note = "หมายเหตุยาวเกิน 300 ตัวอักษร";

  if (payment === "card") {
    const digits = (input.cardNumber || "").replace(/\s/g, "");
    if (!/^\d{16}$/.test(digits) || !luhn(digits)) errors.cardNumber = "เลขบัตรไม่ถูกต้อง";
    if (!validExpiry(input.cardExpiry)) errors.cardExpiry = "วันหมดอายุไม่ถูกต้อง";
    if ((input.cardName || "").trim().length < 2) errors.cardName = "ใส่ชื่อบนบัตร";
  }

  if (Object.keys(errors).length) {
    return { errors, value: null };
  }

  return {
    errors,
    value: { name, phone, address, province, note, payment }
  };
}
