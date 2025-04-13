import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../component/layout/header.css"; // Import the CSS file

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {/* Animated Overlay with AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }} // Smooth closing animation
            transition={{ duration: 0.5 }}
          >
            <ul>
              <li>
                <a href="/search" onClick={() => setIsOpen(false)}>
                  🔍 Search
                </a>
              </li>
              <li>
                <a href="/" onClick={() => setIsOpen(false)}>Home</a>
              </li>
              <li>
                <a href="/products" onClick={() => setIsOpen(false)}>Products</a>
              </li>
              <li>
                <a href="/cart" onClick={() => setIsOpen(false)}>Cart</a>
              </li>
              <li>
                <a href="/contact" onClick={() => setIsOpen(false)}>Contact</a>
              </li>
              <li>
                <a href="/login" onClick={() => setIsOpen(false)}>
                  🔑 Login
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
