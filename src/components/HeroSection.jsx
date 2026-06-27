import React from "react";
import { motion } from "framer-motion";
import heroBackground from "../assets/images/hero-background.jpg";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function HeroSection() {
  return (
    <section
      className="relative w-full h-screen bg-cover bg-center flex flex-col justify-center items-center text-white rounded-lg overflow-hidden"
      style={{ backgroundImage: `url(${heroBackground})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
      <motion.div
        className="relative z-10 max-w-4xl text-center px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Removed introduction text and Shop Now button */}
      </motion.div>
    </section>
  );
}

export default HeroSection;
