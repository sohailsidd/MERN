const express = require("express");
const multer = require("multer");
const upload = multer();
const { newOrder, getSingleOrder, myOrders, getAllOrders, deleteOrder, updateOrderStatus } = require("../controllers/orderController");
const {isAuthenticatedUser, authorizeRole} = require("../middleware/auth");

const router = express.Router();

router.route("/order").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/orders/myOrders").get(isAuthenticatedUser, myOrders);
router.route("/admin/orders").get(isAuthenticatedUser, authorizeRole("admin"), getAllOrders);
router.route("/admin/orders/:id").put(upload.any(), isAuthenticatedUser, authorizeRole("admin"), updateOrderStatus);
router.route("/admin/orders/:id").delete(isAuthenticatedUser, authorizeRole("admin"), deleteOrder);


module.exports = router;