const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const Quotation = require('../models/quotationModel');
const generatePDF = require('../utils/generatePDF');
const sendEmail = require('../utils/sendEmail');
const path = require('path');
const { format } = require('date-fns');

const quotation = asyncHandler(async (req, res) => {
    try {
        const userId = req.user && req.user._id;

        if (!userId) {
            res.status(401);
            throw new Error('User not authenticated');
        }

        const { productUpdates, terms, portName } = req.body;

        if (!Array.isArray(productUpdates) || productUpdates.length === 0) {
            res.status(400);
            throw new Error('Please provide an array of product updates');
        }

        if (!terms) {
            res.status(400);
            throw new Error('Terms are required');
        }
        if (!portName) {
            res.status(400);
            throw new Error('Port name is required');
        }

        let totalCBM = 0;
        let totalAmount = 0;        
        
        const productsWithQuotation = await Promise.all(productUpdates.map(async (update) => {
            const { productId, quantity } = update;
        
            if (!productId || !quantity) {
                res.status(400);
                throw new Error('Each product update must include productId, quantity, and price');
            }
            const product = await Product.findOne({ _id: productId });

            if (!product) {
                    res.status(404);
                    throw new Error(`Product not found for ID: ${productId}`);
            }

            if (!product.selectedByUsers.includes(userId.toString())) {
                    res.status(403);
                    throw new Error(`Product does not belong to user: ${productId}`);
            }

            // Calculate total CBM for the product
            const totalCBMProduct = quantity * product.cartonCBM;
            totalCBM += parseFloat(totalCBMProduct.toFixed(4));

            let totalAmountProduct = 0;

            // Determine the perCartonRate based on print status
            const perCartonRate = product.pcsPerCarton * (product.print ? product.printPrice : product.price);

            // product.leadTime = product.print && product.print === "true" ? product.printLeadTime : product.leadTime;
            
            // Calculate total amount of the product
            totalAmountProduct = quantity * perCartonRate;
            totalAmountProduct = parseFloat(totalAmountProduct.toFixed(2));

            // Update price and lead time based on print status
            const price = product.print ? product.printPrice : product.price;
            const leadTime = product.print ? product.printLeadTime : product.leadTime;

            // Assign common attributes to product
            product.quantity = quantity;
            product.totalCBM = totalCBMProduct;
            product.totalAmount = totalAmountProduct;

            // Calculate Grand Total Amount
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
                    print: product.print,
                    price: price,
                    leadTime: leadTime,
                    quantity: quantity,
                    amount: totalAmountProduct,
                    imageUrl: product.image.filePath 
                };
        }));

        // Find the highest current quotationNumber and increment it
        const lastQuotation = await Quotation.findOne().sort({ quotationNumber: -1 });
        const lastQuotationNumber = lastQuotation ? parseInt(lastQuotation.quotationNumber.replace('Q', ''), 10) : 0;
        const quotationNumber = `Q${(lastQuotationNumber + 1).toString().padStart(4, '0')}`;
        
        const userName = req.user.name || 'N/A';
        const userAddress = req.user.address || 'N/A';
        const userPostcode = req.user.postcode || 'N/A';
        const userEmail = req.user.email || 'N/A';
        const userContact = req.user.contact || 'N/A';

        const formattedDate = format(new Date(), 'dd/MM/yyyy');
        
        const data = {
            date: formattedDate,
            quotationNumber,
            terms: terms, 
            portName: portName,
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
        
        const pdfPath = path.resolve(__dirname, '../uploads', pdfName);
        
        generatePDF(data, pdfPath, async (err) => {
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
 

            // Email to user
            await sendEmail(
                emailSubject,
                emailMessage,
                req.user.email,
                process.env.EMAIL_USER,
                process.env.EMAIL_USER,
                {
                    path: pdfPath,
                    filename: pdfName
                  }                
            );

            // Email to inventory Staff
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

            // await sendEmail(
            //     inventoryEmailSubject,
            //     inventoryEmailMessage,
            //     process.env.EMAIL_USER,
            //     process.env.EMAIL_USER,
            //     process.env.EMAIL_USER,
            //     // path.resolve(__dirname, '../uploads', pdfName)
            //     {
            //     path: pdfPath,
            //     filename: pdfName
            //     }
            // );

            await Quotation.create({
                date: formattedDate,
                quotationNumber,
                terms, 
                portName,
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
            });

            res.status(200).json({
                message: 'Quotation generated and email sent successfully',
                products: productsWithQuotation,
                totalCBM,
                totalAmount,
            });
        });
    } catch (error) {
        console.error('Error generating quotation:', error.message);
        res.status(500).json({ message: 'Failed to generate quotation', error: error.message });
    }
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
