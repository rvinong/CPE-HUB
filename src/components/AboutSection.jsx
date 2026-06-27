import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function AboutSection() {
  return (
    <motion.section
      className="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
        <h2 className="text-3xl font-bold mb-4">About CPE HUB</h2>
        <p className="text-gray-600">
          We provide quality products with excellent customer service. Our mission is to offer the best shopping experience.
        </p>
      </div>
      <div className="md:w-1/2">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
          alt="About us"
          className="rounded-lg shadow-lg"
        />
      </div>
    </motion.section>
  );
}

export default AboutSection;
