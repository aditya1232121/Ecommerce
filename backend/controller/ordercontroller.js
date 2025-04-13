const Order = require("../model/ordermodel"); 
const Product = require("../model/productmodel");

exports.neworder = async (req, res) => {
  try {
    const { 
      shippingInfo, 
      orderItems, 
      paymentInfo, 
      itemsPrice, 
      taxPrice, 
      shippingPrice, 
      totalPrice 
    } = req.body;

    // ✅ Create new order
    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id, // id from db coming from a middlewear name user in protect
    });

    // ✅ Send response back to the client
    return res.status(201).json({
      status: "success",
      message: "Order placed successfully",
      order,
    });

  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found with this ID",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ✅ Get logged-in user's orders
exports.myorders = async (req, res, next) => {
  try {
    // ✅ Check if user ID exists
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access. User ID not found.",
      });
    }

    const orders = await Order.find({ user: req.user._id });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user",
      });
    }

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



// get all Orders -- Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });

    res.status(200).json({
      success: true,
      totalAmount,
      orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// only admin ka do it

exports.updateorder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Order is already delivered",
      });
    }

    // ✅ Ensure all products exist before updating stock
    for (let o of order.orderItems) {
      const product = await Product.findById(o.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${o.product} not found`,
        });
      }

      // ✅ Ensure stock doesn't go negative
      if (product.stock < o.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for product ${product.name}`,
        });
      }

      product.stock -= o.quantity;
      await product.save({
        validateBeforeSave: false,
      });
    }

    order.orderStatus = req.body.orderstatus;

    if (req.body.orderstatus === "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save({
      validateBeforeSave: false,
    });

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ✅ Fixed stock update function
async function updatestock(id, quantity) {
  const product = await Product.findById(id);
  
  if (!product) {
    throw new Error("Product not found");
  }

  product.stock -= quantity;

  await product.save({
    validateBeforeSave: false,
  });
}


async function updatestock(id , quantity) {
const product = await Product.findById(id) ;
product.stock = product.stock - quantity ;
await product.save({
  validateBeforeSave: false
}) ;
}

// Delete Order -- Admin
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found with this ID",
      });
    }

    await order.deleteOne(); // `remove()` is deprecated, use `deleteOne()`

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
