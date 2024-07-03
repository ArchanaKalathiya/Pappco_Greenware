const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    selectedByUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    skuCode: { 
        type: String, 
        required: [true, "Please add SKU Code"],
        unique: true, 
        trim: true,
    },
    itemName: { 
        type: String, 
        required: [true, "Please add item name"],
        trim: true, 
    },
    hsn: { 
        type: String, 
        required: [true, "Please add HSN Code"],
    },
    image: { 
        type: mongoose.Schema.Types.Mixed, 
        required: false,
    },
    productDimensions: { 
        type: String, 
        required: [true, "Please add product dimensions"], 
    },
    materialSpecs: { 
        type: String, 
        required: [true, "Please add material specs"],
    },
    pcsPerCarton: { 
        type: Number, 
        required: [true, "Please add pcs per carton"],
    },
    cartonDimensions: { 
        type: String, 
        required: [true, "Please add carton dimension"],
    },
    cartonCBM: { 
        type: Number,
        required: [true, "Please add carton CBM"],
    },
    print: { 
        type: Boolean, 
        required: [true, "Please add if print available or not"],
    },
    price: { 
        type: Number,
        required: [true, "Please add plain price"],
    },
    printPrice: { 
        type: Number,
        required: false,
    },
    leadTime: {
         type: String,
         required: [true, "Please add plain lead time"],
    },
    printLeadTime: {
         type: String,
         required: false,
    },
    noOfquantity:{
        type: Number,
        required: [true, "Please add available product quantity"],
    },
    totalAmount: { 
        type: Number,
        required: false,
    },
    totalBox: { 
        type: Number,
        required: false,
    },
    totalCBM: { 
        type: Number,
        required: false,
    },
}, { 
    timestamps: true
});

const userProductSelectionSchema = mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    quantity: {
      type: Number,
      required: true,
    },
    print: {
      type: Boolean,
      required: true,
    },
  }, {
    timestamps: true
  });
  
const Product = mongoose.model("Product", productSchema);
const UserProductSelection = mongoose.model("UserProductSelection", userProductSelectionSchema);

module.exports = { Product, UserProductSelection }; 