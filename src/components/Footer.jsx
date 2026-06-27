import React from "react";

function Footer() {
  return (
    <footer className="bg-white text-gray-800 py-16 mt-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <h3 className="text-2xl font-extrabold mb-6">CPE HUB</h3>
          <p className="text-gray-600 leading-relaxed">
            Premium streetwear and accessories. Stay fresh with our exclusive collections.
          </p>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-5 border-b border-gray-300 pb-2">Shop</h4>
          <ul className="space-y-3 text-gray-700">
<li><a href="#" className="hover:text-primary transition-colors duration-200">New Arrivals</a></li>
<li><a href="#" className="hover:text-primary transition-colors duration-200">Best Sellers</a></li>
<li><a href="#" className="hover:text-primary transition-colors duration-200">Collections</a></li>
<li><a href="#" className="hover:text-primary transition-colors duration-200">Sale</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-5 border-b border-gray-300 pb-2">Customer Service</h4>
          <ul className="space-y-3 text-gray-700">
<li><a href="#" className="hover:text-primary transition-colors duration-200">Contact Us</a></li>
<li><a href="#" className="hover:text-primary transition-colors duration-200">Shipping & Returns</a></li>
<li><a href="#" className="hover:text-primary transition-colors duration-200">FAQ</a></li>
<li><a href="#" className="hover:text-primary transition-colors duration-200">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-5 border-b border-gray-300 pb-2">Follow Us</h4>
          <div className="flex space-x-6 text-gray-700">
<a href="#" aria-label="Facebook" className="hover:text-primary transition-colors duration-200">Facebook</a>
<a href="#" aria-label="Instagram" className="hover:text-primary transition-colors duration-200">Instagram</a>
<a href="#" aria-label="Twitter" className="hover:text-primary transition-colors duration-200">Twitter</a>
<a href="#" aria-label="TikTok" className="hover:text-primary transition-colors duration-200">TikTok</a>
          </div>
        </div>
      </div>
      <div className="mt-12 text-center text-gray-500 text-sm border-t border-gray-200 pt-6">
        © {new Date().getFullYear()} CPE HUB. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
