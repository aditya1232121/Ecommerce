import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WebFont from "webfontloader";
import { useDispatch, useSelector } from "react-redux";
import Header from "./component/layout/Header";
import Footer from "./component/layout/Footer";
import ProductDetails from "./component/product/ProductDetails";
import Product from "./component/Products/Product"; // Ensure correct path
import Home from "./component/function/Home";
import Search from "./component/search/Search";
import Login from "./component/user/login"; // Ensure correct casing
import Profile from "./component/user/Profile";

import { loadUser } from "./actions/useraction";

import UserOptions from "./component/layout/Header/UserOptions";

import ProtectedRoute from "./component/Route/ProtectedRoute";

import UpdateProfile from "./component/user/UpdateProfile";

import UpdatePassword from "./component/user/UpdatePassword";

import ForgotPassword from "./component/user/ForgotPassword"

import ResetPassword from "./component/user/ResetPassword"
 
import Cart from "./component/cart/Cart";

export default function App() {
  const dispatch = useDispatch(); // ✅ Use dispatch inside function

  const { user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    dispatch(loadUser()); // ✅ Dispatch inside useEffect
  }, [dispatch]);
  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}{" "}
      {/* ✅ Move it outside Routes */}
      <div className="page-content">
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/products"
            element={<Product />}
          />
          <Route
            path="/products/:keyword"
            element={<Product />}
          />
          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />
          <Route
            path="/search"
            element={<Search />}
          />
          <Route
            path="/cart"
            element={<Cart/>}
          />
          <Route
            path="/contact"
            element={<h1>Contact Page</h1>}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/me/update"
            element={
              <ProtectedRoute>
                <UpdateProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/password/update"
            element={
              <ProtectedRoute>
                <UpdatePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/password/forgot"
            element={
                <ForgotPassword />
            }
          />
          <Route path ="/password/reset/:token" element={<ResetPassword/>} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}
