import React from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-stars";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const productImage = product.images?.[0]?.url || "defaultImage.jpg";

  return (
    <Link className="productCard" to={`/product/${product._id}`}>
      <img src={productImage} alt={product.name} />
      <p>{product.name}</p>
      <div className="ratingContainer">
        <ReactStars
          count={4}
          value={product.ratings} 
          size={20} /* ✅ Adjusted for proper fit */
          color1={"#ccc"} /* Empty star color */
          color2={"#ff9100"} /* Filled star color */
          edit={false}
          className="react-stars" /* ✅ Force inline styling */
        />
        <span className="reviewCount">({product.numOfReviews} Reviews)</span>
      </div>
      <span>{`₹${product.price}`}</span>
    </Link>
  );
};

export default ProductCard;
