const asyncHandler = require("express-async-handler");
const { Product, UserProductSelection } = require('../models/productModel');
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
});

const createProduct = asyncHandler(async (req, res) => {
  let { 
    skuCode, 
    itemName, 
    hsn, 
    image, 
    productDimensions, 
    materialSpecs, 
    pcsPerCarton, 
    cartonDimensions, 
    cartonCBM, 
    print, 
    price, 
    leadTime, 
    printPrice, 
    printLeadTime,
    noOfquantity
  } = req.body;

  // Type coercion
  pcsPerCarton = parseInt(pcsPerCarton, 10);
  cartonCBM = parseFloat(cartonCBM);
  print = print === 'true' || print === true;
  price = parseFloat(price);
  printPrice = print ? parseFloat(printPrice) : null;

  // Validation  
  if (!skuCode || 
    !itemName || 
    !hsn || 
    !productDimensions || 
    !materialSpecs || 
    isNaN(pcsPerCarton) || 
    !cartonDimensions || 
    isNaN(cartonCBM) || 
    !noOfquantity ||
    typeof print !== 'boolean' || 
    isNaN(price) || 
    (print && isNaN(printPrice)) ||
    !leadTime || 
    (print && !printLeadTime)) {
      console.log('Validation failed. Missing or invalid fields:', req.body);
      res.status(400);
      throw new Error('Please fill all required fields');
  }

  // Handle Image Upload
  let fileData = {};
  if (req.file) {
    try {
      const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "ExportApp",
        resource_type: "image",
      });
      fileData = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
      };
    } catch (error) {
      console.error("Error uploading image to cloudinary:", error);
      res.status(500);
      throw new Error("Image could not be uploaded");
    }
  }

  // Create Product
  const product = await Product.create({
    user: req.user._id,
    skuCode,
    itemName,
    hsn,
    image: fileData,
    productDimensions,
    materialSpecs,
    pcsPerCarton,
    cartonDimensions,
    cartonCBM,
    noOfquantity,
    print,
    price,
    printPrice: print ? printPrice : null,
    leadTime,
    printLeadTime: print ? printLeadTime : null,
  });

  res.status(201).json(product);
});

// Get all Products
const getProduct = asyncHandler(async (req,res) =>{
  const products = await Product.find({
    $or: [
      { user: req.user.id },
      { selectedByUsers: req.user.id }
    ]
  }).sort("-createdAt");
  res.status(200).json(products);
});

// Get Products which are available
const availableProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort("-createdAt");
  res.status(200).json(products);
});

// Get Single Product
const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  // if product doesn't exist
  if(!product){
    res.status(404)
    throw new Error("Product not found")
  }
  
  // Initialize selectedByUsers array if it doesn't exist
  if (!product.selectedByUsers) {
    product.selectedByUsers = [];
  }

  // match product to its user
  if (product.user.toString() !== req.user.id && !product.selectedByUsers.includes(req.user.id)) {
    res.status(404);
    throw new Error("User not authorized");
  }
  res.status(200).json(product);;
});

// Delete Product
const deleteProduct = asyncHandler(async(req,res)=>{
  const product = await Product.findById(req.params.id);
  // if product doesn't exist
  if(!product){
    res.status(404)
    throw new Error("Product not found")
  }
  // match product to its user
  if(product.user.toString() !== req.user.id){
    res.status(404)
    throw new Error("User not authorized")
  }
  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { 
    itemName, 
    hsn, 
    image, 
    productDimensions, 
    materialSpecs, 
    pcsPerCarton, 
    cartonDimensions, 
    cartonCBM, 
    noOfquantity,
    print, 
    price, 
    printPrice, 
    leadTime, 
    printLeadTime 
  } = req.body;

  const { id } = req.params;

  const product = await Product.findById(req.params.id);

  // if product doesn't exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // match product to its user
  if (product.user.toString() !== req.user.id) {
    res.status(404);
    throw new Error("User not authorized");
  }

  // Handle Image Upload
  let fileData = {};
  if (req.file) {
    // Save image to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "ExportApp",
        resource_type: "image",
      });
    } catch (error) {
      console.error("Error uploading image to cloudinary:", error);
      res.status(500);
      throw new Error("Image could not be uploaded");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  // Update Product
  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: id },
    {
      user: req.user._id,
      itemName,
      hsn,
      image: Object.keys(fileData).length === 0 ? product.image : fileData,
      productDimensions,
      materialSpecs,
      pcsPerCarton,
      cartonDimensions,
      cartonCBM,
      noOfquantity,
      print,
      price,
      printPrice: print ? printPrice : null,
      leadTime,
      printLeadTime: print ? printLeadTime : null,
      $addToSet: { selectedByUsers: req.user._id }, 
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedProduct);
});

// Function to select a product by a user
const selectProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  const { quantity, print } = req.body; // User-specific data

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if user already has a selection for this product
  const existingSelection = await UserProductSelection.findOne({ userId: req.user._id, productId: id });

  if (existingSelection) {
    // Update existing selection
    existingSelection.quantity = quantity;
    existingSelection.print = print;
    await existingSelection.save();
    res.status(200).json(existingSelection);
  } else {
    // Create new selection
    const userProductSelection = await UserProductSelection.create({
      userId: req.user._id,
      productId: id,
      quantity,
      print,
    });
    // Add user to selectedByUsers array if not already present
    if (!product.selectedByUsers.includes(req.user._id)) {
      product.selectedByUsers.push(req.user._id);
      await product.save();
    }
    res.status(201).json(userProductSelection);
  }
});

const deleteUserProductSelection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const selection = await UserProductSelection.findOneAndDelete({
    userId: req.user._id,
    productId: id,
  });

  if (!selection) {
    res.status(404).json({ message: "User product selection not found" });
    return;
  }
  res.status(200).json(selection);
});

const updateUserProductSelection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity, print } = req.body;

  console.log("Updating selection for user:", req.user._id, "and product:", id);

  // Find the user's selection
  const selection = await UserProductSelection.findOneAndUpdate(
    { userId: req.user._id, productId: id },
    { quantity, print },
    { new: true, runValidators: true }
  );

  if (!selection) {
    res.status(404).json({ message: "User product selection not found" });
    return;
  }

  res.status(200).json(selection);
});


module.exports = {
  createProduct,
  getProduct,
  availableProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  selectProduct,
  deleteUserProductSelection,
  updateUserProductSelection
};
