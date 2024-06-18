const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const Quotation = require('../models/quotationModel');
const generatePDF = require('../utils/generatePDF');
const sendEmail = require('../utils/sendEmail');
const path = require('path');
const { format } = require('date-fns');

let quotationCounter = 0;

const quotation = asyncHandler(async (req, res) => {
    const userId = req.user && req.user._id;

    if (!userId) {
        res.status(401);
        throw new Error('User not authenticated');
    }

    const productUpdates = req.body;

    if (!Array.isArray(productUpdates) || productUpdates.length === 0) {
        res.status(400);
        throw new Error('Please provide an array of product updates');
    }

    let totalCBM = 0;
    let totalAmount = 0;

    const productsWithQuotation = await Promise.all(productUpdates.map(async (update) => {
        const { productId, quantity, rate } = update;

        if (!productId || !quantity || !rate) {
            res.status(400);
            throw new Error('Each product update must include productId, quantity, and rate');
        }

        const product = await Product.findOne({ _id: productId, user: userId });

        if (!product) {
            res.status(404);
            throw new Error(`Product not found or does not belong to user: ${productId}`);
        }

        const totalCBMProduct = quantity * product.cartonCBM;
        const totalAmountProduct = quantity * rate;

        product.quantity = quantity;
        product.rate = rate;
        product.totalCBM = totalCBMProduct;
        product.totalAmount = totalAmountProduct;

        totalCBM += totalCBMProduct;
        totalAmount += totalAmountProduct;

        await product.save();

        return {
            skuCode: product.skuCode,
            itemName: product.itemName,
            hsn: product.hsn,
            productDimensions: product.productDimensions,
            pcsPerCarton: product.pcsPerCarton,
            cartonDimensions: product.cartonDimensions,
            cartonCBM: product.cartonCBM,
            rate: rate,
            plainLeadTime: product.plainLeadTime,
            quantity: quantity,
            amount: totalAmountProduct,
        };
    }));

    quotationCounter += 1;
    const quotationNumber = `Q${quotationCounter.toString().padStart(4, '0')}`;

    const userName = req.user.name || 'N/A';
    const userAddress = req.user.address || 'N/A';
    const userPostcode = req.user.postcode || 'N/A';
    const userEmail = req.user.email || 'N/A';
    const userContact = req.user.contact || 'N/A';

    const formattedDate = format(new Date(), 'dd/MM/yyyy');

    const data = {
        date: formattedDate,
        quotationNumber,
        user: {
            id: userId,
            name: userName,
            address: userAddress,
            postcode: userPostcode,
            email: userEmail,
            contact: userContact
        },
        products: productsWithQuotation,
        totalCBM,
        totalQty: productUpdates.reduce((total, update) => total + update.quantity, 0),
        totalAmount
    };

    const pdfName = `${userName}_quotation_${quotationNumber}.pdf`;

    generatePDF(data, pdfName, async (err, pdfFileName) => {
        if (err) {
            res.status(500);
            throw new Error('Failed to generate PDF');
        }

        const emailSubject = `Quotation from Pappco Greenware - ${formattedDate}`;
        const emailMessage = `
            <p>Dear ${userName},</p>
            <p>Please find the attached quotation PDF generated on ${formattedDate}.</p>
            <p>Thank you for considering our products.</p>
            <p>Best regards,</p>
            <p>Pappco Greenware</p>
        `;

        //Email to user
        await sendEmail(
            emailSubject,
            emailMessage,
            req.user.email,
            process.env.EMAIL_USER,
            process.env.EMAIL_USER,
            path.resolve(__dirname, '../uploads', pdfName)
        );

        //Email to inventory Staff
        const inventoryEmailSubject = `${userName} - Generated Quotation - ${formattedDate}`;
        const inventoryEmailMessage = `
            <p>User Name: ${userName}</p>
            <p>Email ID: ${userEmail}</p>
            <p>Contact NO: ${userContact}</p>
            <p>Post Code: ${userPostcode}</p>
            <p>Address: ${userAddress}</p>
            <p>${userName} has generated the attached Quotation ${quotationNumber}.</p>
            <p>Please find the attached quotation PDF for details.</p>
        `;

        await sendEmail(
            inventoryEmailSubject,
            inventoryEmailMessage,
            process.env.EMAIL_USER,
            process.env.EMAIL_USER,
            process.env.EMAIL_USER,
            path.resolve(__dirname, '../uploads', pdfName)
        );

        // await Quotation.create({
        //     date: formattedDate,
        //     quotationNumber,
        //     user: {
        //       id: userId,
        //       name: userName,
        //       address: userAddress,
        //       postcode: userPostcode,
        //       email: userEmail,
        //       contact: userContact
        //     },
        //     products: productsWithQuotation,
        //     totalCBM,
        //     totalQty: productUpdates.reduce((total, update) => total + update.quantity, 0),
        //     totalAmount
        //   });

        res.status(200).json({
            message: 'Quotation generated and email sent successfully',
            products: productsWithQuotation,
            totalCBM,
            totalAmount,
        });
    });
});

const getQuotation = asyncHandler(async (req, res) => {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
        res.status(404);
        throw new Error('Quotation not found');
    }
    res.status(200).json(quotation);
});

const deleteQuotation = asyncHandler(async (req, res) => {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
        res.status(404);
        throw new Error('Quotation not found');
    }
    await quotation.remove();
    res.status(200).json({ message: 'Quotation removed' });
});

module.exports = {
    quotation,
    getQuotation,
    deleteQuotation
};
