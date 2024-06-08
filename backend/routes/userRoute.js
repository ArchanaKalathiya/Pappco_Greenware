const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getUser, loginStatus, updateUser, changePassword, forgotPassword, resetPassword } = require('../controllers/userController');
const protect = require('../middlewares/authMiddleware');
const nodemailer = require("nodemailer");

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout',logoutUser);
router.get("/getuser", protect, getUser);
router.get("/loggedin", loginStatus);
router.patch("/update", protect, updateUser);
router.patch("/changePassword", protect,changePassword);
router.post("/forgotPassword",forgotPassword);
router.put("/resetPassword/:resetToken", resetPassword);

module.exports = router;
