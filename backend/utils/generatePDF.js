const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');
const handlebars = require('handlebars');

const generatePDF = (data, pdfPath, callback) => {
    const templatePath = path.resolve(__dirname, '../utils/quotationTemplate.hbs');

    if (!fs.existsSync(templatePath)) {
        console.error(`Template file not found: ${templatePath}`);
        throw new Error(`Template file not found: ${templatePath}`);
    }

    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);

    // Read the logo file and convert it to a base64 string
    const logoPath = path.resolve(__dirname, '../utils/pappco_logo.png');
    const logoBase64 = fs.readFileSync(logoPath, 'base64');
    data.logoBase64 = `data:image/png;base64,${logoBase64}`;

    const html = template(data);

    const options = { format: 'A4' };

    // Ensure directory exists
    const dir = path.dirname(pdfPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    pdf.create(html, options).toFile(pdfPath, (err, res) => {
        if (err) {
            return callback(err);
        }
        callback(null, pdfPath); // Return the full PDF path
    });
};

module.exports = generatePDF;
