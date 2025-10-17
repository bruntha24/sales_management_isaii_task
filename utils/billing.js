const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

exports.sendInvoice = async ({ clientName, clientEmail, salespersonName, location, products }) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const fileName = `invoice_${Date.now()}.pdf`;
      const filePath = path.join(__dirname, "../invoices", fileName);

      if (!fs.existsSync(path.join(__dirname, "../invoices"))) {
        fs.mkdirSync(path.join(__dirname, "../invoices"));
      }

      doc.pipe(fs.createWriteStream(filePath));

      // Header
      doc.fontSize(20).text("Sales Invoice", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Client: ${clientName}`);
      doc.text(`Salesperson: ${salespersonName}`);
      doc.text(`Location: ${location}`);
      doc.text(`Date: ${new Date().toLocaleString()}`);
      doc.moveDown();

      // Products
      doc.fontSize(14).text("Products:");
      doc.moveDown(0.5);
      products.forEach((p, i) => {
        doc.fontSize(12).text(`${i + 1}. ${p.name} - Qty: ${p.quantity} - Price: ₹${p.price}`);
      });

      const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
      doc.moveDown();
      doc.fontSize(14).text(`Total: ₹${total}`, { align: "right" });

      doc.end();

      // Send email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: clientEmail,
        subject: "Your Invoice",
        text: `Dear ${clientName},\n\nPlease find attached the invoice for your purchase.\n\nRegards,\n${salespersonName}`,
        attachments: [{ filename: fileName, path: filePath }]
      };

      transporter.sendMail(mailOptions, (err, info) => {
        fs.unlinkSync(filePath); // delete file after sending
        if (err) return reject(err);
        resolve(info);
      });
    } catch (err) {
      reject(err);
    }
  });
};
