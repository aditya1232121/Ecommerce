const mongoose = require("mongoose");
const Product = require("../model/productmodel");
const ApiFeatures = require("../utils/apiFeatures"); // ✅ Ensure this import exists

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(10);
        const products = await apiFeature.query;

        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

exports.getProductDetails = async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("❌ Error fetching product details:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Create New Product
// ✅ Create New Product
exports.createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({ status: "success", data: newProduct });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// ✅ Update Product
exports.updateProduct = async (req, res) => {
  try {
    // Convert string ID to ObjectId type
    const productId = new mongoose.Types.ObjectId(req.params.id);

    const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ status: "fail", message: "Product not found" });
    }

    res.status(200).json({ status: "success", data: updatedProduct });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// ✅ Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    // Convert string ID to ObjectId type
    const productId = new mongoose.Types.ObjectId(req.params.id);

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ status: "fail", message: "Product not found" });
    }

    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// ✅ Create/Update Product Review
exports.createProductReview = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;

    if (!productId) {
      return res.status(400).json({ status: "fail", message: "Product ID is required" });
    }

    // Convert string Product ID to ObjectId type
    const product = await Product.findById(new mongoose.Types.ObjectId(productId));

    if (!product) {
      return res.status(404).json({ status: "fail", message: "Product not found" });
    }

    // Ensure reviews is an array
    if (!Array.isArray(product.reviews)) {
      product.reviews = [];
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ status: "fail", message: "User not authenticated" });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating,
      comment,
    };

    // Check if user already reviewed
    const existingReview = product.reviews.find(
      (rev) => rev.user && rev.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    // Calculate new average rating
    const totalRating = product.reviews.reduce((acc, rev) => acc + rev.rating, 0);
    product.ratings = totalRating / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Review added successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

// ✅ Get Product Reviews
exports.getProductReviews = async (req, res) => {
  try {
    // Convert string Product ID to ObjectId type
    const product = await Product.findById(new mongoose.Types.ObjectId(req.query.id));

    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: "success",
      reviews: product.reviews,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

// ✅ Delete Product Review
exports.deleteProductReview = async (req, res) => {
  try {
    const { productid, reviewid } = req.query;

    if (!productid || !reviewid) {
      return res.status(400).json({
        status: "fail",
        message: "Product ID and Review ID are required",
      });
    }

    // Convert string Product ID to ObjectId type
    const product = await Product.findById(new mongoose.Types.ObjectId(productid));

    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }

    const updatedReviews = product.reviews.filter(
      (rev) => rev._id.toString() !== reviewid
    );

    const totalRatings = updatedReviews.reduce((acc, rev) => acc + rev.rating, 0);
    const newAvgRating = updatedReviews.length > 0 ? totalRatings / updatedReviews.length : 0;

    await Product.findByIdAndUpdate(
      productid,
      {
        reviews: updatedReviews,
        ratings: newAvgRating,
        numOfReviews: updatedReviews.length,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      message: "Review deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
