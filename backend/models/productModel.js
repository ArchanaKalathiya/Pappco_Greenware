const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
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
        required: [false, "Please add image"],
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
    plainPrice: { 
        type: Number,
         required: [true, "Please add plain price"],
    },
    printPrice: { 
        type: Number,
         required: [true, "Please add print price"],
    },
    plainLeadTime: {
         type: String,
         required: [true, "Please add plain lead time"],
    },
    printLeadTime: {
         type: String,
         required: [true, "Please add print lead time"],
    },
    rate: { 
        type: Number,
         required: [true, "Please add rate"],
    },
    quantity: { 
        type: Number,
        required: false,
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
    }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
