import React from "react";
import { motion } from "framer-motion";
import aboutImage1 from "../assets/images/1.jpg";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
      <motion.section
        className="flex flex-col md:flex-row items-center gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="md:w-1/2">
          <h1 className="text-4xl font-extrabold mb-4">Our Story</h1>
          <p className="text-gray-700 mb-4">
            CPE MERCH is a lifestyle brand dedicated to quality, style, and authenticity. We started with a vision to create apparel that resonates with the culture and spirit of our community.
          </p>
          <p className="text-gray-700">
            Our mission is to provide premium products that combine comfort and fashion, empowering our customers to express themselves confidently.
          </p>
        </div>
        <div className="md:w-1/2">
          <img
            src={aboutImage1}
            alt="Our Story"
            className="rounded-lg shadow-lg object-cover w-full h-64 md:h-80"
          />
        </div>
      </motion.section>

      <motion.section
        className="flex flex-col md:flex-row-reverse items-center gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold mb-4">Quality & Craftsmanship</h2>
          <p className="text-gray-700 mb-4">
            Every product is crafted with attention to detail and made from high-quality materials. We believe in durability and timeless design.
          </p>
          <p className="text-gray-700">
            Our team works closely with manufacturers to ensure that each item meets our standards and exceeds customer expectations.
          </p>
        </div>
        <div className="md:w-1/2">
          <img
            src="/images/product2.png"
            alt="Quality & Craftsmanship"
            className="rounded-lg shadow-lg object-cover w-full h-64 md:h-80"
          />
        </div>
      </motion.section>

      <motion.section
        className="text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
        <p className="max-w-3xl mx-auto text-gray-700">
          We invite you to be part of the CPE MERCH community. Follow us on social media, share your style, and stay connected for the latest releases and events.
        </p>
      </motion.section>
    </div>
  );
}
