var CATEGORIES = [
  { id: "pantry", label: "ของกิน", text: "ข้าว เครื่องปรุง และของว่าง" },
  { id: "drink", label: "เครื่องดื่ม", text: "ชา กาแฟ และน้ำผึ้ง" },
  { id: "home", label: "ของใช้", text: "งานฝีมือใช้ในบ้าน" }
];

var PRODUCTS = [
  {
    id: "jasmine-rice",
    name: "ข้าวหอมมะลิอินทรีย์",
    weight: "5 กิโลกรัม",
    category: "pantry",
    origin: "สุรินทร์",
    price: 289,
    stock: 30,
    badge: "ขายดี",
    featured: true,
    tone: "sand",
    icon: "rice",
    blurb: "เมล็ดยาว หอมนุ่ม จากนาอินทรีย์",
    description: "ข้าวขาวดอกมะลิจากนาอินทรีย์ในสุรินทร์ หุงแล้วเมล็ดเรียงตัว นุ่ม และมีกลิ่นใบเตยจาง ๆ เหมาะกินเปล่าหรือทำข้าวผัด",
    details: ["พันธุ์ขาวดอกมะลิ 105", "ปลูกแบบอินทรีย์", "ถุงซิปล็อก 5 กิโลกรัม"]
  },
  {
    id: "nam-prik",
    name: "น้ำพริกตาแดงโบราณ",
    weight: "120 กรัม",
    category: "pantry",
    origin: "พระนครศรีอยุธยา",
    price: 95,
    stock: 40,
    badge: "ขายดี",
    featured: true,
    tone: "clay",
    icon: "jar",
    blurb: "เผ็ดหอมกระเทียมเจียว ตำตามสูตรบ้าน",
    description: "ตำตามสูตรบ้านอยุธยา เผ็ดหอมกระเทียมเจียว กินกับผักลวก ไข่ต้ม หรือข้าวร้อนได้ทันที",
    details: ["เผ็ดกลาง", "ไม่ใส่ผงชูรส", "เปิดแล้วเก็บเย็นและทานภายใน 14 วัน"]
  },
  {
    id: "butterfly-tea",
    name: "ชาดอกอัญชันมะนาว",
    weight: "20 ซอง",
    category: "drink",
    origin: "เชียงใหม่",
    price: 160,
    stock: 25,
    badge: "ชงง่าย",
    featured: true,
    tone: "bloom",
    icon: "tea",
    blurb: "สีม่วงกลิ่นมะนาว ไม่แต่งสี",
    description: "ดอกอัญชันตากลมผสมผิวมะนาวอบแห้ง ชงแล้วได้สีม่วงกลิ่นสด ไม่แต่งสีและไม่ต้องเติมน้ำตาลก็ดื่มได้",
    details: ["20 ซองเยื่อกระดาษ", "ไม่แต่งสี", "ชงน้ำร้อนประมาณ 3 นาที"]
  },
  {
    id: "coffee",
    name: "กาแฟอราบิก้าคั่วกลาง",
    weight: "250 กรัม",
    category: "drink",
    origin: "เชียงราย",
    price: 320,
    stock: 22,
    badge: "ขายดี",
    featured: true,
    tone: "mist",
    icon: "coffee",
    blurb: "โทนช็อกโกแลตและถั่ว บดสำหรับดริป",
    description: "สารอราบิก้าจากดอยแม่จัน คั่วกลางให้โทนช็อกโกแลตและถั่ว บดหยาบไว้สำหรับดริป",
    details: ["แหล่งปลูกประมาณ 1,200 เมตร", "คั่วภายใน 30 วัน", "ถุงมีวาล์วกันลม"]
  },
  {
    id: "honey",
    name: "น้ำผึ้งดอกลำไย",
    weight: "380 กรัม",
    category: "drink",
    origin: "ลำพูน",
    price: 240,
    stock: 18,
    badge: "",
    featured: false,
    tone: "sand",
    icon: "honey",
    blurb: "หวานละมุน ไม่ผ่านความร้อนสูง",
    description: "น้ำผึ้งดอกลำไยจากช่องเขาลำพูน หวานละมุน ไม่ผ่านความร้อนสูง ทาขนมปังหรือคนในชาร้อนได้",
    details: ["ไม่ผ่านความร้อนสูง", "บรรจุขวดแก้ว", "ผลิตตามฤดูกาล"]
  },
  {
    id: "thong-muan",
    name: "ขนมทองม้วนโบราณ",
    weight: "กล่อง 12 ชิ้น",
    category: "pantry",
    origin: "ราชบุรี",
    price: 120,
    stock: 35,
    badge: "ของใหม่",
    featured: false,
    tone: "clay",
    icon: "snack",
    blurb: "กรอบบาง รสไข่เค็ม ไม่หวานจัด",
    description: "ทองม้วนกรอบบางรสไข่เค็มอ่อน อบวันต่อวัน ไม่หวานจัดและไม่ใส่สี",
    details: ["12 ชิ้นต่อกล่อง", "ไม่ใส่สี", "ควรทานภายใน 10 วัน"]
  },
  {
    id: "shawl",
    name: "ผ้าคลุมไหล่ทอมือ",
    weight: "ผืน",
    category: "home",
    origin: "เชียงใหม่",
    price: 890,
    stock: 3,
    badge: "งานฝีมือ",
    featured: false,
    tone: "mist",
    icon: "cloth",
    blurb: "ฝ้ายย้อมคราม ลายก้างปลา",
    description: "ผ้าฝ้ายทอมือลายก้างปลา ย้อมครามธรรมชาติ ผืนเบา คลุมไหล่หรือปูโต๊ะเตี้ยได้",
    details: ["ขนาดประมาณ 70×180 เซนติเมตร", "ย้อมครามธรรมชาติ", "แต่ละผืนลายต่างกันเล็กน้อย"]
  },
  {
    id: "candle",
    name: "เทียนหอมตะไคร้",
    weight: "180 กรัม",
    category: "home",
    origin: "กรุงเทพฯ",
    price: 180,
    stock: 20,
    badge: "",
    featured: false,
    tone: "bloom",
    icon: "candle",
    blurb: "กลิ่นตะไคร้และมะกรูด ควันน้อย",
    description: "เทียนถั่วเหลืองกลิ่นตะไคร้และผิวมะกรูด ควันน้อย เหมาะจุดหลังทำอาหาร",
    details: ["เผาได้ประมาณ 25 ชั่วโมง", "ไส้ฝ้าย", "แท่งละ 180 กรัม"]
  },
  {
    id: "soap",
    name: "สบู่น้ำมันมะพร้าว",
    weight: "ก้อน 90 กรัม",
    category: "home",
    origin: "สมุทรสงคราม",
    price: 85,
    stock: 50,
    badge: "",
    featured: false,
    tone: "leaf",
    icon: "soap",
    blurb: "สกัดเย็น ฟองละเอียด",
    description: "สบู่สกัดเย็นจากน้ำมันมะพร้าวสมุทรสงคราม ฟองละเอียด ใช้ได้กับผิวธรรมดาทั้งตัว",
    details: ["ไม่มีน้ำหอมสังเคราะห์", "ไม่ทดลองในสัตว์", "พักสบู่ก่อนจำหน่าย 4 สัปดาห์"]
  },
  {
    id: "bowl",
    name: "ชามเซรามิกเคลือบขี้เถ้า",
    weight: "ใบ",
    category: "home",
    origin: "ลำปาง",
    price: 450,
    stock: 14,
    badge: "",
    featured: false,
    tone: "sand",
    icon: "bowl",
    blurb: "ขึ้นรูปด้วยมือ ผิวเคลือบด้าน",
    description: "ชามดินเผาขึ้นรูปด้วยมือจากลำปาง เคลือบขี้เถ้าไม้ให้ผิวด้าน ใส่ข้าวหรือเสิร์ฟขนมได้",
    details: ["เส้นผ่านศูนย์กลาง 15 เซนติเมตร", "เข้าไมโครเวฟได้", "แนะนำให้ล้างมือ"]
  },
  {
    id: "coconut-oil",
    name: "น้ำมันมะพร้าวสกัดเย็น",
    weight: "250 มิลลิลิตร",
    category: "pantry",
    origin: "ประจวบคีรีขันธ์",
    price: 210,
    stock: 26,
    badge: "",
    featured: false,
    tone: "leaf",
    icon: "bottle",
    blurb: "กลิ่นอ่อน ใช้ทั้งครัวและผิว",
    description: "น้ำมันมะพร้าวสกัดเย็นจากประจวบคีรีขันธ์ กลิ่นอ่อน ใช้ผัดไฟอ่อนหรือทาผิวที่แห้ง",
    details: ["ไม่ผ่านความร้อนสูง", "ขวดแก้วทึบแสง", "แข็งตัวได้เมื่ออากาศเย็น"]
  },
  {
    id: "basket",
    name: "ตะกร้าสานไม้ไผ่",
    weight: "ใบ",
    category: "home",
    origin: "อ่างทอง",
    price: 350,
    stock: 11,
    badge: "",
    featured: false,
    tone: "sand",
    icon: "basket",
    blurb: "สานมือ ใส่ผักหรือของบนโต๊ะ",
    description: "ตะกร้าไม้ไผ่สานมือจากอ่างทอง หูสั้น ใส่ผักจากตลาดหรือของใช้บนโต๊ะอาหาร",
    details: ["เส้นผ่านศูนย์กลาง 28 เซนติเมตร", "เช็ดให้แห้งหลังล้าง", "งานแฮนด์เมด"]
  }
];

const ICONS = {
  rice: `
    <path d="M66 44c3-8 25-8 28 0"/>
    <path d="M58 58h44c5 0 8 5 8 10v44c0 16-14 26-30 26s-30-10-30-26V68c0-5 3-10 8-10z"/>
    <path d="M58 74c14 8 30 8 44 0"/>
    <circle cx="74" cy="98" r="2.2" fill="currentColor" stroke="none"/>
    <circle cx="88" cy="108" r="2.2" fill="currentColor" stroke="none"/>
    <circle cx="78" cy="118" r="2.2" fill="currentColor" stroke="none"/>
  `,
  jar: `
    <path d="M58 46h44v12H58z"/>
    <path d="M62 58h36l8 58H54l8-58z"/>
    <path d="M60 86c12 8 28 8 40 0"/>
  `,
  tea: `
    <path d="M48 72h50l-6 40H54L48 72z"/>
    <path d="M98 78c14 2 16 24 2 28"/>
    <path d="M46 122h68"/>
    <path d="M70 58c0-8 6-8 6-16"/>
    <path d="M84 56c0-8 6-8 6-14"/>
  `,
  honey: `
    <path d="M60 50h40v10H60z"/>
    <path d="M64 60h32l6 56H58l6-56z"/>
    <path d="M80 34c8 8 8 8 0 16"/>
    <path d="M66 88h28"/>
  `,
  coffee: `
    <path d="M62 42h36l10 16v60H52V58l10-16z"/>
    <path d="M62 70h46"/>
    <path d="M70 86c8 10 8 10 20 0"/>
    <path d="M78 28c6 6 4 10 0 14"/>
  `,
  soap: `
    <rect x="46" y="62" width="68" height="46" rx="12"/>
    <path d="M46 74c16-8 52-8 68 0"/>
    <path d="M62 96h22"/>
  `,
  cloth: `
    <path d="M46 58h68v52H46z"/>
    <path d="M46 74h68"/>
    <path d="M62 74l8 36"/>
    <path d="M80 74l8 36"/>
    <path d="M98 74l8 36"/>
  `,
  bowl: `
    <path d="M42 78c0-14 16-24 38-24s38 10 38 24"/>
    <path d="M50 78c6 30 54 30 60 0"/>
    <path d="M64 96h32"/>
  `,
  candle: `
    <path d="M80 36c8 8 8 14 0 20-8-6-8-12 0-20z" fill="currentColor" stroke="none"/>
    <rect x="68" y="58" width="24" height="58" rx="4"/>
    <path d="M58 124h44"/>
  `,
  bottle: `
    <path d="M72 36h16v16"/>
    <path d="M68 52h24l8 70H60l8-70z"/>
    <path d="M66 84h28"/>
  `,
  snack: `
    <rect x="40" y="68" width="80" height="28" rx="14"/>
    <path d="M58 68c0 16 0 16 0 28"/>
    <path d="M80 68c0 16 0 16 0 28"/>
    <path d="M102 68c0 16 0 16 0 28"/>
  `,
  basket: `
    <path d="M50 70h60l-8 48H58L50 70z"/>
    <path d="M48 86h64"/>
    <path d="M62 70c0-16 36-16 36 0"/>
    <path d="M70 86l-4 32"/>
    <path d="M90 86l4 32"/>
  `
};

function categoryLabel(id) {
  const found = CATEGORIES.find((category) => category.id === id);
  return found ? found.label : "";
}

function getProduct(id) {
  return PRODUCTS.find((product) => product.id === id) || null;
}

function haystack(product) {
  return [product.name, product.blurb, product.origin, product.description, product.weight, categoryLabel(product.category)]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("th");
}

function filterProducts(options) {
  const tokens = (options.q || "").trim().toLocaleLowerCase("th").split(/\s+/).filter(Boolean);
  const category = options.cat || "all";
  const items = PRODUCTS.filter((product) => {
    if (category !== "all" && product.category !== category) return false;
    if (!tokens.length) return true;
    const text = haystack(product);
    return tokens.every((token) => text.includes(token));
  });
  const sort = options.sort || "featured";
  if (sort === "price-asc") items.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") items.sort((a, b) => b.price - a.price);
  else if (sort === "name") items.sort((a, b) => a.name.localeCompare(b.name, "th"));
  return items;
}

function iconSvg(name) {
  const body = ICONS[name] || ICONS.basket;
  return `<svg viewBox="0 0 160 160" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}
