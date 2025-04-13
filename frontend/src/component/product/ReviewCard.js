import React from "react";
import ReactStars from "react-rating-stars-component";
import "./ProductDetail.css";

export default function ReviewCard({ review }) {
  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "tomato",
    size: 20,
    value: review?.ratings || 0,
    isHalf: true,
  };

  return (
    <div className="reviewCard">
      <img src="/Profile.png" alt="User Profile" />
      <p>{review?.name || "Anonymous"}</p>
      <ReactStars {...options} />
      <p>{review?.comment || "No comment available"}</p>
    </div>
  );
}
