const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getUser, loginStatus, updateUser, changePassword } = require('../controllers/userController');
const protect = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout',logoutUser);
router.get("/getuser", protect, getUser);
router.get("/loggedin", loginStatus);
router.patch("/update", protect, updateUser);
router.patch("/changePassword", protect,changePassword);

module.exports = router;
