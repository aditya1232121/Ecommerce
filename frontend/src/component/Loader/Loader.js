import React from "react";
import "./Loader.css";

const Loader = () => {
  console.log("✅ Loader Component Rendered!"); // Debugging

  return (
    <div className="home-loading">
      <div className="home-loader"></div>
      <div className="home-loading-text">
        <span>L</span>
        <span>O</span>
        <span>A</span>
        <span>D</span>
        <span>I</span>
        <span>N</span>
        <span>G</span>
      </div>
    </div>
  );
};

export default Loader;
