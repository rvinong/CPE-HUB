const axios = require('axios');

const products = [
  {
    productId: 1,
    name: "ICPEP ORG SHIRT – 2022",
    category: "tshirt",
    price: 500,
    sizes: ["S", "M", "L", "XL"],
    image: "/images/product1.png",
    quantity: 0
  },
  {
    productId: 2,
    name: "ICPEP ORG SHIRT – 2023",
    category: "tshirt",
    price: 500,
    sizes: ["S", "M", "L", "XL"],
    image: "/images/product2.png",
    quantity: 0
  },
  {
    productId: 3,
    name: "ICPEP ORG SHIRT – 2024",
    category: "tshirt",
    price: 500,
    sizes: ["S", "M", "L", "XL"],
    image: "/images/product3.png",
    quantity: 0
  },
  {
    productId: 4,
    name: "RELAXED PRINTED TEE – BLACK",
    category: "tshirt",
    price: 250,
    sizes: ["S", "M", "L", "XL"],
    image: "/images/product4.png",
    quantity: 0
  },
  {
    productId: 5,
    name: "ID LACE 2023",
    category: "hoodie",
    price: 75,
    sizes: ["S", "M", "L"],
    image: "/images/product5.png",
    quantity: 0
  },
  {
    productId: 6,
    name: "ID LACE 2024",
    category: "hoodie",
    price: 75,
    sizes: ["S", "M", "L"],
    image: "/images/product6.png",
    quantity: 0
  },
  {
    productId: 7,
    name: "TOTE BAGS",
    category: "essential",
    price: 250,
    sizes: ["One Size"],
    image: "/images/product7.png",
    quantity: 0
  },
  {
    productId: 8,
    name: "STICKERS",
    category: "essential",
    price: 100,
    sizes: ["One Size"],
    image: "/images/product8.png",
    quantity: 0
  }
];

const API_URL = 'http://localhost:5000/api/products';

async function seedProducts() {
  for (const product of products) {
    try {
      await axios.post(API_URL, product);
      console.log(`Added product: ${product.name}`);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.log(`Product already exists: ${product.name}`);
      } else {
        console.error(`Failed to add product: ${product.name}`, error.message);
      }
    }
  }
}

seedProducts();
