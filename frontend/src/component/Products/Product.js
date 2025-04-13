import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getProduct } from "../../actions/productAction";
import Loader from "../Loader/Loader";
import ProductCard from "../function/ProductCard";
import MetaData from "../layout/MetaData";
import { useParams } from "react-router-dom";
import { Typography, Slider } from "@mui/material"; // ✅ Import from MUI
import "./Product.css";

const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Clothing",
  "SmartPhones",
];

const Products = () => {
  const dispatch = useDispatch();
  const { keyword } = useParams(); // ✅ Get search keyword from URL

  // ✅ State for filters
  const [price, setPrice] = useState([0, 25000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);

  const { products, loading, error } = useSelector((state) => state.products);

  // ✅ Handle price change
  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  // ✅ Fetch products when filters change
  useEffect(() => {
    dispatch(getProduct(keyword, price, category, ratings));
  }, [dispatch, keyword, price, category, ratings]);

  // ✅ Show error if API fails
  useEffect(() => {
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

      dispatch({ type: "CLEAR_ERRORS" }); // ✅ Clear error after showing toast
    }
  }, [error, dispatch]);

  return (    
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="PRODUCTS -- ECOMMERCE" />
          <h2 className="productsHeading">Products</h2>

          <div className="products">
            {products && products.length > 0 ? (
              products.map((product) => <ProductCard key={product._id} product={product} />)
            ) : (
              <p>No products found</p>
            )}
          </div>

          {/* ✅ Filter Section */}
          <div className="filterBox">
            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              min={0}
              max={25000}
              step={0.1}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
            />

            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((categoryItem) => (
                <li
                  className="category-link"
                  key={categoryItem}
                  onClick={() => setCategory(categoryItem)} // ✅ Fixed this
                >
                  {categoryItem}
                </li>
              ))}
            </ul>

            {/* ✅ Ratings Filter */}
            <fieldset>
              <Typography>Rating</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => setRatings(newRating)}
                min={0}
                max={5}
                step={0.1}
                aria-labelledby="continuous-slider"
              />
            </fieldset>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;
