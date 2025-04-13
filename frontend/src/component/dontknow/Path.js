import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../function/Home"
import Product from "../Products/Product"
import Search from "../search/Search";

export default function Path() {
  return (
    <div className="page-content">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/products" element={<Product/>} />
        <Route path="/search" element={<Search/>} />
        <Route path="/cart" element={<h1>Cart Page</h1>} />
        <Route path="/contact" element={<h1>Contact Page</h1>} />
      </Routes>
    </div>
  );
}
