const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '90d' });
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, contact, address, postcode,bio  } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be up to 6 characters");
  }

  // Check if user email already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Email has already been registered");
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
    contact,
    address,
    postcode,
    bio,
  });

  //   Generate Token
  const token = generateToken(user._id);

  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400 * 90), // 90 day
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, email, contact, address, postcode, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      contact,
      address,
      postcode,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});


// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate Request
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add email and password");
  }

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found, please signup");
  }

  // User exists, check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  //   Generate Token
  const token = generateToken(user._id);
  
  if(passwordIsCorrect){
   // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400 * 90), // 90 day
    sameSite: "none",
    secure: true,
  });
}
  if (user && passwordIsCorrect) {
    const { _id, name, email, contact, address,postcode, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      contact,
      address,
      postcode,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

  // Logout user
  const logout = asyncHandler(async(req, res) => {
    res.cookie("token", "", {
      path: "/",
      httpOnly: true,
      expires: new Date(0), 
      sameSite: "none",
      secure: true,
    });
    return res.status(200).json({message: " Successfully Logged Out!"})
  });

module.exports = {
  registerUser,
  loginUser,
  logout,
};
