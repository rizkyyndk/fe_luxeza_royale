const IMAGE_PARAMS = "?auto=format&fit=crop&w=900&q=80";

// JACKET IMAGES
const URL_GAMBAR_JACKET_1 =
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b" + IMAGE_PARAMS;

const URL_GAMBAR_JACKET_2 =
  "https://images.unsplash.com/photo-1551028719-00167b16eac5" + IMAGE_PARAMS;

const URL_GAMBAR_JACKET_3 =
  "https://images.unsplash.com/photo-1523398002811-999ca8dec234" + IMAGE_PARAMS;

// HOODIE IMAGES
const URL_GAMBAR_HOODIE_1 =
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f" + IMAGE_PARAMS;

const URL_GAMBAR_HOODIE_2 =
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7" + IMAGE_PARAMS;

const URL_GAMBAR_HOODIE_3 =
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c" + IMAGE_PARAMS;

// T-SHIRT IMAGES
const URL_GAMBAR_TSHIRT_1 =
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c" + IMAGE_PARAMS;

const URL_GAMBAR_TSHIRT_2 =
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" + IMAGE_PARAMS;

const URL_GAMBAR_TSHIRT_3 =
  "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2" + IMAGE_PARAMS;

// SHOES IMAGES
const URL_GAMBAR_SHOES_1 =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff" + IMAGE_PARAMS;

const URL_GAMBAR_SHOES_2 =
  "https://images.unsplash.com/photo-1460353581641-37baddab0fa2" + IMAGE_PARAMS;

const URL_GAMBAR_SHOES_3 =
  "https://images.unsplash.com/photo-1549298916-b41d501d3772" + IMAGE_PARAMS;

// PANTS IMAGES
const URL_GAMBAR_PANTS_1 =
  "https://images.unsplash.com/photo-1473966968600-fa801b869a1a" + IMAGE_PARAMS;

const URL_GAMBAR_PANTS_2 =
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246" + IMAGE_PARAMS;

const URL_GAMBAR_PANTS_3 =
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f" + IMAGE_PARAMS;

export const products = [
  {
    id: 1,
    title: "Minimalist Luxury Jacket",
    category: "Jacket",
    price: 1299000,
    image: URL_GAMBAR_JACKET_1,
    images: [URL_GAMBAR_JACKET_1, URL_GAMBAR_JACKET_2, URL_GAMBAR_JACKET_3],
    description: "Premium minimalist jacket with modern oversized silhouette.",
    sizes: ["S", "M", "L", "XL"],
    stock: 12,
  },
  {
    id: 2,
    title: "Oversized Hoodie",
    category: "Hoodie",
    price: 899000,
    image: URL_GAMBAR_HOODIE_1,
    images: [URL_GAMBAR_HOODIE_1, URL_GAMBAR_HOODIE_2, URL_GAMBAR_HOODIE_3],
    description: "Luxury oversized hoodie for modern streetwear aesthetics.",
    sizes: ["S", "M", "L", "XL"],
    stock: 8,
  },
  {
    id: 3,
    title: "Luxury T-Shirt",
    category: "T-Shirt",
    price: 499000,
    image: URL_GAMBAR_TSHIRT_1,
    images: [URL_GAMBAR_TSHIRT_1, URL_GAMBAR_TSHIRT_2, URL_GAMBAR_TSHIRT_3],
    description: "Premium cotton t-shirt with minimalist modern fit.",
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
  },
  {
    id: 4,
    title: "Royal Leather Sneakers",
    category: "Shoes",
    price: 1799000,
    image: URL_GAMBAR_SHOES_1,
    images: [URL_GAMBAR_SHOES_1, URL_GAMBAR_SHOES_2, URL_GAMBAR_SHOES_3],
    description: "Premium leather sneakers with a clean royal luxury finish.",
    sizes: ["39", "40", "41", "42", "43"],
    stock: 5,
  },
  {
    id: 5,
    title: "Royal Black Jacket",
    category: "Jacket",
    price: 1499000,
    image: URL_GAMBAR_JACKET_2,
    images: [URL_GAMBAR_JACKET_2, URL_GAMBAR_JACKET_3, URL_GAMBAR_JACKET_1],
    description: "Elegant black jacket designed for refined evening styling.",
    sizes: ["S", "M", "L", "XL"],
    stock: 3,
  },
  {
    id: 6,
    title: "Ivory Luxe Hoodie",
    category: "Hoodie",
    price: 959000,
    image: URL_GAMBAR_HOODIE_2,
    images: [URL_GAMBAR_HOODIE_2, URL_GAMBAR_HOODIE_1, URL_GAMBAR_HOODIE_3],
    description: "Soft premium hoodie with a clean ivory luxury finish.",
    sizes: ["S", "M", "L", "XL"],
    stock: 9,
  },
  {
    id: 7,
    title: "Essential Black Tee",
    category: "T-Shirt",
    price: 459000,
    image: URL_GAMBAR_TSHIRT_2,
    images: [URL_GAMBAR_TSHIRT_2, URL_GAMBAR_TSHIRT_1, URL_GAMBAR_TSHIRT_3],
    description: "Minimal black t-shirt crafted for everyday premium wear.",
    sizes: ["S", "M", "L", "XL"],
    stock: 20,
  },
  {
    id: 8,
    title: "Tailored Luxe Pants",
    category: "Pants",
    price: 1099000,
    image: URL_GAMBAR_PANTS_1,
    images: [URL_GAMBAR_PANTS_1, URL_GAMBAR_PANTS_2, URL_GAMBAR_PANTS_3],
    description: "Tailored pants with a premium silhouette and modern comfort.",
    sizes: ["28", "30", "32", "34", "36"],
    stock: 7,
  },
  {
    id: 9,
    title: "Monochrome Court Sneakers",
    category: "Shoes",
    price: 1599000,
    image: URL_GAMBAR_SHOES_2,
    images: [URL_GAMBAR_SHOES_2, URL_GAMBAR_SHOES_1, URL_GAMBAR_SHOES_3],
    description: "Minimalist monochrome sneakers for elevated casual styling.",
    sizes: ["39", "40", "41", "42", "43", "44"],
    stock: 0,
  },
  {
    id: 10,
    title: "Relaxed Premium Pants",
    category: "Pants",
    price: 899000,
    image: URL_GAMBAR_PANTS_2,
    images: [URL_GAMBAR_PANTS_2, URL_GAMBAR_PANTS_1, URL_GAMBAR_PANTS_3],
    description:
      "Relaxed luxury pants designed for comfort and clean structure.",
    sizes: ["28", "30", "32", "34", "36"],
    stock: 4,
  },
];
