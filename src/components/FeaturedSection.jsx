import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const products = [
  {
    id: 1,
    name: "ICPEP ORG SHIRT – 2022",
    description: "Official ICPEP Organization Shirt for 2022.",
    image: "/images/product1.png",
    price: 500,
  },
  {
    id: 2,
    name: "ICPEP ORG SHIRT – 2023",
    description: "Official ICPEP Organization Shirt for 2023.",
    image: "/images/product2.png",
    price: 500,
  },
  {
    id: 3,
    name: "ICPEP ORG SHIRT – 2024",
    description: "Official ICPEP Organization Shirt for 2024.",
    image: "/images/product3.png",
    price: 500,
  },
];

function FeaturedSection() {
  return (
    <motion.section
      className="w-full max-w-7xl mx-auto px-4 py-8 sm:py-16 text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <h2 className="text-3xl font-bold mb-4">Best Picks</h2>
      <p className="text-gray-600 mb-8">
        Discover our best picks and official organization shirts.
      </p>
      <div className="flex justify-center w-full px-4 sm:px-0 mx-auto">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-7xl w-full mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-gray-100 rounded-lg p-4 sm:p-6 shadow-md flex flex-col items-center cursor-pointer"
              onClick={() => window.location.href = `/products/detail/${product.id}`}
            >
              <img
                src={product.image}
                alt={product.name}
                className="mb-4 rounded-md w-full h-36 sm:h-44 object-contain"
              />
              <h3 className="font-semibold mb-2 text-sm sm:text-base">{product.name}</h3>
              <p className="text-gray-700 mb-4 text-xs sm:text-sm">{product.description}</p>
              <p className="font-bold mb-4 text-sm sm:text-base">₱ {product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default FeaturedSection;
