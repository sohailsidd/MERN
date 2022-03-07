const express = require("express");
const multer = require("multer");
const upload = multer();
const { getAllAdminProducts, getAllProducts, createProduct, updateProduct, deletProduct, getProduct, createProductReview, getAllReviews, deleteReview} = require("../controllers/productController");
const {isAuthenticatedUser, authorizeRole} = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/products/:id").get(getProduct);
router.route("/admin/products").get(isAuthenticatedUser, authorizeRole("admin"), getAllAdminProducts);
router.route("/admin/products").post(upload.any() ,isAuthenticatedUser, authorizeRole("admin"), createProduct);
router.route("/admin/products/:id").put(upload.any(), isAuthenticatedUser, authorizeRole("admin"), updateProduct);
router.route("/admin/products/:id").delete(isAuthenticatedUser, authorizeRole("admin"), deletProduct);
router.route("/products/reviews").put(upload.any(), isAuthenticatedUser, createProductReview);
router.route("/product/getAllReviews").get(getAllReviews);
router.route("/product/deleteProduct").delete(isAuthenticatedUser, deleteReview);

module.exports =  router ;