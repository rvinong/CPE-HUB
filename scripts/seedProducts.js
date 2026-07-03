const axios = require('axios');

const products = [
  {
    productId: 1,
    name: "ICPEP Org Shirt 2022",
    category: "tshirt",
    status: "archived",
    year: 2022,
    price: 0,
    sizes: [],
    image: "/images/product1.png",
    quantity: 0
  },
  {
    productId: 2,
    name: "ICPEP Org Shirt 2023",
    category: "tshirt",
    status: "archived",
    year: 2023,
    price: 0,
    sizes: [],
    image: "/images/product2.png",
    quantity: 0
  },
  {
    productId: 3,
    name: "ICPEP Org Shirt 2024",
    category: "tshirt",
    status: "available",
    year: 2024,
    price: 500,
    sizes: ["S", "M", "L", "XL"],
    image: "/images/product3.png",
    quantity: 24
  },
  {
    productId: 4,
    name: "Relaxed Printed Tee - Black",
    category: "tshirt",
    status: "available",
    year: 2024,
    price: 250,
    sizes: ["S", "M", "L", "XL"],
    image: "/images/product4.png",
    quantity: 18
  },
  {
    productId: 5,
    name: "ID Lace 2023",
    category: "lace",
    status: "archived",
    year: 2023,
    price: 0,
    sizes: [],
    image: "/images/product5.png",
    quantity: 0
  },
  {
    productId: 6,
    name: "ID Lace 2024",
    category: "lace",
    status: "available",
    year: 2024,
    price: 75,
    sizes: ["One Size"],
    image: "/images/product6.png",
    quantity: 40
  },
  {
    productId: 7,
    name: "CPE Tote Bag",
    category: "essential",
    status: "available",
    year: 2024,
    price: 250,
    sizes: ["One Size"],
    image: "/images/product7.png",
    quantity: 20
  },
  {
    productId: 8,
    name: "Developer Sticker Pack",
    category: "essential",
    status: "available",
    year: 2024,
    price: 100,
    sizes: ["One Size"],
    image: "/images/product8.png",
    quantity: 35
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
