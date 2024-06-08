const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Token=require('../models/tokenModel');
const crypto = require("crypto");
const nodemailer = require('nodemailer');

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
  const logoutUser = asyncHandler(async(req, res) => {
    res.cookie("token", "", {
      path: "/",
      httpOnly: true,
      expires: new Date(0), 
      sameSite: "none",
      secure: true,
    });
    return res.status(200).json({message: " Successfully Logged Out!"})
  });

  // Get User Data
  const getUser = asyncHandler( async(req, res)=>{
    const user = await User.findById(req.user._id);

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
      });
    } else {
      res.status(400);
      throw new Error("User not found");
    }
  });


  // Get Login Status
  const loginStatus = asyncHandler(async(req,res)=>{
    const token = req.cookies.token;
    if (!token) {
      return res.json(false);
    }
    // Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified) {
      return res.json(true);
    }
    return res.json(false);
  });

  // Update User
  const updateUser = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id);

    if(user){
    const { name, email, contact, address, postcode, bio } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.contact = req.body.contact || contact;
    user.address = req.body.address || address;
    user.postcode = req.body.postcode || postcode;
    user.bio = req.body.bio || bio;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      contact: updatedUser.contact,
      bio: updatedUser.bio,
    });
  }else {
    res.status(404);
    throw new Error("User not found");
  }
  });

  // Change Password 
  const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { oldPassword, newPassword } = req.body; // Change password to newPassword

  if (!user) {
    res.status(400);
    throw new Error("User not found, please sign up");
  }

  // Validate 
  if (!oldPassword || !newPassword) { // Change password to newPassword
    res.status(400);
    throw new Error("Please add old and new Password");
  }

  // Check if old password matches password in DB 
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  // Save new password
  if (user && passwordIsCorrect) {
    user.password = newPassword; // Change password to newPassword
    await user.save();
    res.status(200).send("Password changed successfully");
  } else {
    res.status(400);
    throw new Error("Old password is incorrect");
  }
});

  // Forgot Password
  
  // Create transporter object
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
  });
  const forgotPassword = asyncHandler(async(req,res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
      res.status(404);
      throw new Error("User does not exist");
  }
  // Delete token if exists in the DB
  let token = await Token.findOne({userId: user._id})
  if(token){
    await token.deleteOne();
  }
  // Create Reset Token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;

  // Hash token before saving to DB
  const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

  // Save token to DB
  await new Token({
      userId: user._id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * (60 * 1000), // 30 minutes
  }).save();

  // Construct Reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  // Email Template
  const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333333;">Password Reset</h2>
          <h4> Hello ${user.name} </h4>
          <p style="color: #666666;">You have requested to reset your password. Click the button below to reset it:</p>
          <a href="${resetUrl}" clicktracking=off style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Reset Password</a>
          <p style="color: #666666;">If you didn't request this, you can safely ignore this email.</p>
          <div style="margin-top: 20px; text-align: center; color: #999999;">
              <p>This email was sent automatically. Please do not reply.</p>
          </div>
      </div>
  `;

  // Email Options
  const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: emailTemplate,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error('Error sending email:', error);
          res.status(500);
          throw new Error('Failed to send password reset email');
      } else {
          console.log('Password reset email sent:', info.response);
          res.status(200).json({ message: 'Password reset email sent successfully' });
      }
  });
});

  //Reset Password
  const  resetPassword = asyncHandler(async(req,res)=>{
    const {password} = req.body
    const {resetToken} = req.params

    // Hash token, then comare to TOken in DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    
    // Find token in the DB
    const userToken = await Token.findOne({
      token: hashedToken, 
      expiresAt: {$gt: Date.now()}
    })

    if(!userToken){
      res.status(404);
      throw new Error("Invalid or Expired Token");
    }

    // Find User
    const user = await User.findOne({_id: userToken.userId})
    user.password = password
    await user.save()

    res.status(200).json({
      message: "Password Reset Successful, Please Login",
    })
  });

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  transporter,
  resetPassword,
};
