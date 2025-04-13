import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProductDetails } from "../../actions/productAction";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ReactStars from "react-rating-stars-component";
import Loader from "../Loader/Loader";
import MetaData from "../layout/MetaData";
import ReviewCard from "../product/ReviewCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProductDetail.css";
import {additem} from "../../actions/cartaction"

export default function ProductDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { product, loading, error } = useSelector((state) => state.productDetails);
  const [quantity, setQuantity] = useState(1);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setImageLoading(true);
      dispatch(getProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (!loading) {
      setImageLoading(false);
    }
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [loading, error]);

  const increaseQuantity = () => {
    if(product.stock <=quantity)
      return  ;
    const qty = quantity + 1; 
    setQuantity(qty);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) return;
    const qty = quantity - 1; 
    if (qty < 1) return;
    setQuantity(qty);
  };

  const addToCartHandler = () => {
    dispatch(additem(id, quantity));
    toast.success("Item Added To Cart") 
  };

  if (loading || imageLoading || !product) return <Loader />;

  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "tomato",
    size: 20,
    value: product?.ratings || 4, // Default rating if product.ratings is undefined
    isHalf: true,
  };

  return (
    <Fragment>
      <MetaData title={`${product?.name} -- ECOMMERCE`} />
      <div className="ProductDetails">
        <div>
          <Carousel>
            {product?.images?.map((item, i) => (
              <img
                className="CarouselImage"
                key={i}
                src={item.url}
                alt={`${i} Slide`}
                onLoad={() => setImageLoading(false)} // Proper image loading handling
              />
            ))}
          </Carousel>
        </div>

        <div>
          <div className="detailsBlock-1">
            <h2>{product?.name}</h2>
            <p>Product # {product?._id}</p>
          </div>
          <div className="detailsBlock-2">
            <ReactStars {...options} />
            <span className="detailsBlock-2-span"> ({product?.numOfReviews} Reviews)</span>
          </div>
          <div className="detailsBlock-3">
            <h1>{`₹${product?.price}`}</h1>
            <div className="detailsBlock-3-1">
              <div className="detailsBlock-3-1-1">
                <button onClick={decreaseQuantity}>-</button>
                <input 
                  readOnly // canot directly edit the input field
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Number(e.target.value))} // Handle quantity change
                />
                <button onClick={increaseQuantity}>+</button>
              </div>
              <button disabled={product?.Stock < 1} onClick={addToCartHandler}>
                Add to Cart
              </button>
            </div>
            <p>
              Status:
              <b className={product?.Stock < 1 ? "redColor" : "greenColor"}>
                {product?.Stock < 1 ? "OutOfStock" : "InStock"}
              </b>
            </p>
          </div>

          <div className="detailsBlock-4">
            Description : <p>{product?.description}</p>
          </div>

          <button className="submitReview">Submit Review</button>
        </div>
      </div>

      {/* Only render reviews if they exist */}
      <h3 className="reviewsHeading">REVIEWS</h3>
      {product?.reviews?.length > 0 ? (
        <div className="reviews">
          {product.reviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>
      ) : (
        <p className="noReviews">No reviews</p>
      )}
    </Fragment>
  );
}
