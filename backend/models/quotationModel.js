const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
    date: { type: String, required: true },
    quotationNumber: { type: String, required: true, unique: true },
    user: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        name: { type: String, required: true },
        address: { type: String, required: true },
        postcode: { type: String, required: true },
        email: { type: String, required: true },
        contact: { type: String, required: true }
    },
    products: [
        {
            skuCode: { type: String, required: true },
            itemName: { type: String, required: true },
            hsn: { type: String, required: true },
            productDimensions: { type: String, required: true },
            pcsPerCarton: { type: Number, required: true },
            cartonDimensions: { type: String, required: true },
            cartonCBM: { type: Number, required: true },
            rate: { type: Number, required: true },
            plainLeadTime: { type: String, required: true },
            quantity: { type: Number, required: true },
            amount: { type: Number, required: true }
        }
    ],
    totalCBM: { type: Number, required: true },
    totalQty: { type: Number, required: true },
    totalAmount: { type: Number, required: true }
}, {
    timestamps: true
});

const Quotation = mongoose.model('Quotation', quotationSchema);
module.exports = Quotation;
