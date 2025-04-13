const express = require("express");
const { control, restrictedto } = require("../controller/authcontroller");
const { neworder, getSingleOrder, myorders, getAllOrders, updateorder, deleteOrder } = require("../controller/ordercontroller");

const router = express.Router();

router.post("/order/new", control, neworder);
router.get("/order/me", control, myorders); // ✅ FIX: Place this before /order/:id
router.route("/order/:id").get(control, restrictedto("admin"), getSingleOrder);

router.route("/admin/order").get(control , restrictedto("admin") , getAllOrders )

router.route("/admin/order/:id").put(control , restrictedto("admin") , updateorder)


router.route("/admin/order/:id").delete(control , restrictedto("admin") , deleteOrder)

module.exports = router; 
