import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      id="footer"
      className="bg-linear-to-br from-[#F8F4E1] to-[#AF8F6F] text-[#543310] w-full py-16 px-6 md:px-20 font-poppins"
    >
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-4">The Fudge Lab</h2>
            <p className="text-[#74512D] max-w-md text-lg leading-relaxed">
              Freshly baked happiness delivered to your doorstep. Premium
              handmade brownies crafted with love and the finest ingredients.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="https://instagram.com/thefudgelab._"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#74512D] hover:bg-[#543310] text-white px-4 py-2 rounded-lg transition duration-300"
              >
                Instagram
              </a>
              <a
                href="https://wa.me/+918660374131"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#74512D] hover:bg-[#543310] text-white px-4 py-2 rounded-lg transition duration-300"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#543310]">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/products"
                  className="text-[#74512D] hover:text-[#543310] transition duration-300 text-lg">Menu</Link>
              </li>
              <li>
                <a href="https://maps.app.goo.gl/mChJGBcczVpU5hyu7" target="_blank">Location</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#543310]">
              Contact Us
            </h3>
            <div className="space-y-3 text-[#74512D] text-lg">
              <p>+91 866 037 4131 </p>
              <p>thefudgelab@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#AF8F6F] pt-8">
          <p className="text-[#74512D] text-lg text-center">
            © 2024 thefudgelab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
