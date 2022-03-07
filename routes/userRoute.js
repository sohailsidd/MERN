const express = require("express");
const {isAuthenticatedUser, authorizeRole} = require("../middleware/auth");
const { createUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateRole, deleteUser } = require("../controllers/userController");
const multer = require("multer");
const upload = multer();
const router = express.Router();

router.route("/user/register").post(upload.single("avatar"), createUser);
router.route("/user/login").post(loginUser);
router.route("/user/resetPassword").post(upload.any(), forgotPassword);
router.route("/user/resetPassword/:token").put(upload.any(), resetPassword);
router.route("/user/logout").get(logout);
router.route("/user/getUserDetails").get(isAuthenticatedUser, getUserDetails);
router.route("/user/updatePassword").put(upload.any(), isAuthenticatedUser, updatePassword);
router.route("/user/updateProfile").put(upload.single("avatar"), isAuthenticatedUser, updateProfile);
router.route("/user/admin/getAllUsers").get(isAuthenticatedUser, authorizeRole("admin"), getAllUsers);
router.route("/user/admin/getSingleUser/:id").get(isAuthenticatedUser, authorizeRole("admin"), getSingleUser);
router.route("/user/admin/updateRole/:id").put(upload.any(),isAuthenticatedUser, authorizeRole("admin"), updateRole);
router.route("/user/admin/Delete/:id").delete(isAuthenticatedUser, authorizeRole("admin"), deleteUser);

module.exports =  router;