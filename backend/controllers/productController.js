const asyncHandler = require("express-async-handler");
const Product = require('../models/productModel');
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
});


const createProduct = asyncHandler(async (req, res)=>{
    const { skuCode, itemName, hsn, image, productDimensions, materialSpecs, pcsPerCarton, cartonDimensions, cartonCBM, plainPrice, printPrice, plainLeadTime, printLeadTime, rate } = req.body;

  // Validation  
  if (!skuCode || !itemName || !hsn || !productDimensions || !materialSpecs || !pcsPerCarton || !cartonDimensions || !cartonCBM || !plainPrice || !printPrice || !plainLeadTime || !printLeadTime || !rate) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }
  // Handle Image Upload
  let fileData = {}
  if(req.file){
    //Save image to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "ExportApp",
        resource_type: "image",
      });
    } catch (error) {
      console.error("Error uploading image to cloudinary:",error);
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
    plainPrice,
    printPrice,
    plainLeadTime,
    printLeadTime,
    rate,
  });

  res.status(201).json(product);
});

  // Get all Products
  const getProduct = asyncHandler(async (req,res) =>{
    const products = await Product.find({user: req.user.id}).sort("-createdAt");
    res.status(200).json(products)
  });

  // Get Single Product

  const getSingleProduct = asyncHandler(async(req,res) => {
    const product = await Product.findById(req.params.id)

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

  // Update the Product 
  
const updateProduct = asyncHandler(async (req, res)=>{
  const { itemName, hsn, image, productDimensions, materialSpecs, pcsPerCarton, cartonDimensions, cartonCBM, plainPrice, printPrice, plainLeadTime, printLeadTime, rate } = req.body;

  const{id} = req.params

  const product = await Product.findById(req.params.id)

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

  // Handle Image Upload
  let fileData = {}
  if(req.file){
    //Save image to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "ExportApp",
        resource_type: "image",
      });
    } catch (error) {
      console.error("Error uploading image to cloudinary:",error);
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
    {_id:id},
    {user: req.user._id,
    itemName,
    hsn,
    image: Object.keys(fileData).length === 0 ?product.image : fileData,
    productDimensions,
    materialSpecs,
    pcsPerCarton,
    cartonDimensions,
    cartonCBM,
    plainPrice,
    printPrice,
    plainLeadTime,
    printLeadTime,
    rate,
  },
  {
    new: true,
    runValidators:true,
  }
);

  res.status(200).json(updatedProduct);
  });


module.exports = {
    createProduct,
    getProduct,
    getSingleProduct,
    deleteProduct,
    updateProduct,
};
