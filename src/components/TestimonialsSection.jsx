import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function TestimonialsSection() {
  return (
    <motion.section
      className="max-w-7xl mx-auto px-4 py-16 text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <h2 className="text-3xl font-bold mb-8">What Our Customers Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gray-100 rounded-lg p-6 shadow-md">
          <p className="italic mb-4">
            "Great products and excellent customer service!"
          </p>
          <p className="font-semibold">- Customer A</p>
        </div>
        <div className="bg-gray-100 rounded-lg p-6 shadow-md">
          <p className="italic mb-4">
            "Fast shipping and quality items. Highly recommend."
          </p>
          <p className="font-semibold">- Customer B</p>
        </div>
        <div className="bg-gray-100 rounded-lg p-6 shadow-md">
          <p className="italic mb-4">
            "Amazing selection and easy to navigate website."
          </p>
          <p className="font-semibold">- Customer C</p>
        </div>
      </div>
    </motion.section>
  );
}

export default TestimonialsSection;
