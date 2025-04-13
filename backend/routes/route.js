const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,  // Renamed for clarity
  deleteProductReview,
  getProductDetails,
} = require("../controller/productcontroller");
const { control, restrictedto } = require("../controller/authcontroller");

const router = express.Router();

// Get all products and create a new product (restricted to admins)
router
  .route("/products")
  .get(getAllProducts)
  .post( createProduct);  // Admin restriction for creating products

// Update and delete a product by id (restricted to admins)
router
  .route("/products/:id")
  .get(getProductDetails)  // Corrected GET route for product details
  .patch(control, restrictedto("admin"), updateProduct)
  .delete(control, restrictedto("admin"), deleteProduct);

// Routes for reviews (creating, getting, and deleting reviews)
router.route("/product/:id/review").put(control, createProductReview);  // Review route with product ID
router.route("/product/:id/reviews").get(getProductReviews).delete(control, restrictedto("admin"), deleteProductReview);  // Get and delete reviews for a specific product

module.exports = router;
