const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

// Generate and send invoice
exports.generateInvoice = async (req, res) => {
  try {
    const { clientName, clientEmail, products, salespersonName, location } = req.body;

    // Create PDF
    const doc = new PDFDocument();
    const fileName = `invoice_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, "../invoices", fileName);

    // Ensure invoices folder exists
    if (!fs.existsSync(path.join(__dirname, "../invoices"))) {
      fs.mkdirSync(path.join(__dirname, "../invoices"));
    }

    doc.pipe(fs.createWriteStream(filePath));

    // Invoice Header
    doc.fontSize(20).text("Sales Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Client: ${clientName}`);
    doc.text(`Salesperson: ${salespersonName}`);
    doc.text(`Location: ${location}`);
    doc.text(`Date: ${new Date().toLocaleString()}`);
    doc.moveDown();

    // Table Header
    doc.fontSize(14).text("Products:");
    doc.moveDown(0.5);

    products.forEach((product, index) => {
      doc.fontSize(12).text(`${index + 1}. ${product.name} - Qty: ${product.quantity} - Price: ₹${product.price}`);
    });

    // Total
    const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    doc.moveDown();
    doc.fontSize(14).text(`Total: ₹${total}`, { align: "right" });

    doc.end();

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your email provider
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // email app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: clientEmail,
      subject: "Your Invoice",
      text: `Dear ${clientName},\n\nPlease find attached the invoice for your purchase.\n\nRegards,\n${salespersonName}`,
      attachments: [{ filename: fileName, path: filePath }],
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Error sending email" });
      }
      // Optionally delete PDF after sending
      fs.unlinkSync(filePath);

      res.status(200).json({ success: true, message: "Invoice sent successfully!" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
