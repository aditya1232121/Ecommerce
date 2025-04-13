import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import ProductCard from "./ProductCard";
import MetaData from "../layout/MetaData";
import { getProduct } from "../../actions/productAction";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ✅ Import Toastify CSS

export default function Home() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    dispatch(getProduct());

    if (error) {
      toast.error(`🚨 Error: ${error}`, {
        position: "top-right",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });

      // Clear the error after showing the toast
      dispatch({ type: "CLEAR_ERRORS" });
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (!loading) {
      setShowLoader(false);
    }
  }, [loading]);

  console.log("Products in Frontend:", products); // Debugging line

  return (
    <>
      {/* ✅ Add ToastContainer to display errors */}
      <ToastContainer />

      {showLoader ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Ecommerce" />
          <div className="banner">
            <p>Welcome to Ecommerce</p>
            <h1>FIND AMAZING PRODUCTS</h1>
            <Link to="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </Link>
          </div>
          <h2 className="homeHeading">Featured Products</h2>
          <div className="container" id="container">
  {loading ? (
    <Loader />
  ) : products?.length > 0 ? (
    products.map((product) => (
      <ProductCard key={product._id} product={product} />
    ))
  ) : (
    <h2>No Products Found</h2>
  )}
</div>

        </>
      )}
    </>
  );
}
