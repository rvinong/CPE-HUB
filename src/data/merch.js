export const MERCH_STATUS = {
  AVAILABLE: "available",
  ARCHIVED: "archived",
};

export const merchCatalog = [
  {
    productId: 1,
    name: "ICPEP Org Shirt 2022",
    category: "tshirt",
    year: 2022,
    status: MERCH_STATUS.ARCHIVED,
    image: "/images/product1.png",
    price: 500,
    sizes: ["S", "M", "L", "XL"],
    quantity: 0,
    description: "Official computer engineering organization shirt from the 2022 release.",
  },
  {
    productId: 2,
    name: "ICPEP Org Shirt 2023",
    category: "tshirt",
    year: 2023,
    status: MERCH_STATUS.ARCHIVED,
    image: "/images/product2.png",
    price: 500,
    sizes: ["S", "M", "L", "XL"],
    quantity: 0,
    description: "Archived organization shirt from the 2023 CPE merch release.",
  },
  {
    productId: 3,
    name: "ICPEP Org Shirt 2024",
    category: "tshirt",
    year: 2024,
    status: MERCH_STATUS.AVAILABLE,
    image: "/images/product3.png",
    price: 500,
    sizes: ["S", "M", "L", "XL"],
    quantity: 24,
    description: "The latest official ICPEP organization shirt for the current merch drop.",
  },
  {
    productId: 4,
    name: "Relaxed Printed Tee - Black",
    category: "tshirt",
    year: 2024,
    status: MERCH_STATUS.AVAILABLE,
    image: "/images/product4.png",
    price: 250,
    sizes: ["S", "M", "L", "XL"],
    quantity: 18,
    description: "A relaxed black tee for everyday CPE wear.",
  },
  {
    productId: 5,
    name: "ID Lace 2023",
    category: "lace",
    year: 2023,
    status: MERCH_STATUS.ARCHIVED,
    image: "/images/product5.png",
    price: 75,
    sizes: ["One Size"],
    quantity: 0,
    description: "Archived ID lace from the 2023 release.",
  },
  {
    productId: 6,
    name: "ID Lace 2024",
    category: "lace",
    year: 2024,
    status: MERCH_STATUS.AVAILABLE,
    image: "/images/product6.png",
    price: 75,
    sizes: ["One Size"],
    quantity: 40,
    description: "Current drop ID lace for CPE students.",
  },
  {
    productId: 7,
    name: "CPE Tote Bag",
    category: "essential",
    year: 2024,
    status: MERCH_STATUS.AVAILABLE,
    image: "/images/product7.png",
    price: 250,
    sizes: ["One Size"],
    quantity: 20,
    description: "A daily tote for notes, gear, and campus essentials.",
  },
  {
    productId: 8,
    name: "Developer Sticker Pack",
    category: "essential",
    year: 2024,
    status: MERCH_STATUS.AVAILABLE,
    image: "/images/product8.png",
    price: 100,
    sizes: ["One Size"],
    quantity: 35,
    description: "A sticker pack for laptops, bottles, and code-covered spaces.",
  },
];

export const normalizeCategory = (category = "") => {
  const value = String(category).toLowerCase();
  if (value === "hoodie" || value === "lace" || value === "lanyard") return "lace";
  if (value === "essential" || value === "essentials") return "essential";
  return value || "tshirt";
};

const hasEncodingNoise = (value = "") =>
  Array.from(String(value)).some((char) => char.charCodeAt(0) > 127);

export const normalizeMerch = (product = {}) => {
  const productId = Number(product.productId ?? product.id);
  const fallback = merchCatalog.find((item) => item.productId === productId) || {};
  const year = Number(product.year ?? fallback.year ?? new Date().getFullYear());
  const status = product.status || fallback.status || MERCH_STATUS.AVAILABLE;
  const name =
    product.name && !hasEncodingNoise(product.name)
      ? product.name
      : fallback.name || product.name || "";
  const sizes = Array.isArray(product.sizes)
    ? product.sizes
    : typeof product.sizes === "string"
    ? product.sizes.split(",").map((size) => size.trim()).filter(Boolean)
    : fallback.sizes || [];

  return {
    ...fallback,
    ...product,
    id: productId,
    productId,
    name,
    category: normalizeCategory(product.category ?? fallback.category),
    year,
    status,
    sizes,
    image: product.image || fallback.image || "/images/product1.png",
    images: product.images || fallback.images,
    quantity: Number(product.quantity ?? fallback.quantity ?? 0),
    price: Number(product.price ?? fallback.price ?? 0),
    description: product.description || fallback.description || "",
  };
};

export const normalizeMerchList = (products = merchCatalog) =>
  products.map(normalizeMerch).filter((product) => Number.isFinite(product.productId));

export const getFallbackProducts = () => normalizeMerchList(merchCatalog);

export const getProductFromFallback = (productId) =>
  normalizeMerch(merchCatalog.find((product) => product.productId === Number(productId)));

export const isArchivedMerch = (product) =>
  normalizeMerch(product).status === MERCH_STATUS.ARCHIVED;

export const formatPrice = (price) => `PHP ${Number(price || 0).toLocaleString("en-PH")}`;
