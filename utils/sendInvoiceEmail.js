// utils/sendInvoiceEmail.js
const nodemailer = require("nodemailer");
const { jsPDF } = require("jspdf");
const autoTable = require("jspdf-autotable");
const fs = require("fs");

// Attach autoTable to jsPDF prototype
jsPDF.prototype.autoTable = autoTable;

const sendInvoiceEmail = async (invoice) => {
  try {
    // 1️⃣ Generate PDF
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("SalesManager Invoice", 14, 20);
    doc.setFontSize(12);
    doc.text(`Client: ${invoice.customerName}`, 14, 30);
    doc.text(
      `Location: ${
        invoice.location
          ? `${invoice.location.latitude}, ${invoice.location.longitude}`
          : "N/A"
      }`,
      14,
      38
    );
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleString()}`, 14, 46);

    const tableData = invoice.items.map((item, i) => [
      i + 1,
      item.description,
      item.quantity,
      `₹${item.price}`,
      `₹${item.quantity * item.price}`,
    ]);

    doc.autoTable({
      startY: 55,
      head: [["#", "Product", "Qty", "Unit Price", "Total"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [30, 144, 255], textColor: 255 },
    });

    const total = invoice.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    doc.text(`Total: ₹${total}`, 14, doc.lastAutoTable.finalY + 10);

    // 2️⃣ Add uploaded images to PDF
    if (invoice.media && invoice.media.images && invoice.media.images.length > 0) {
      doc.text("Uploaded Images:", 14, doc.lastAutoTable.finalY + 20);
      let yPos = doc.lastAutoTable.finalY + 25;
      for (let i = 0; i < invoice.media.images.length; i++) {
        const imgPath = invoice.media.images[i];
        if (fs.existsSync(imgPath)) {
          try {
            const imgData = fs.readFileSync(imgPath).toString("base64");
            doc.addImage(
              `data:image/jpeg;base64,${imgData}`,
              "JPEG",
              14,
              yPos,
              50,
              50
            );
            yPos += 55;
          } catch (err) {
            console.warn("Could not add image to PDF:", imgPath, err.message);
          }
        }
      }
    }

    const pdfBuffer = doc.output("arraybuffer");

    // 3️⃣ Prepare email attachments
    const attachments = [
      {
        filename: `Invoice_${invoice.customerName}.pdf`,
        content: Buffer.from(pdfBuffer),
      },
    ];

    // Attach original uploaded files (images, videos, voice notes)
    if (invoice.media) {
      ["images", "videos", "voiceNotes"].forEach((type) => {
        if (invoice.media[type] && invoice.media[type].length > 0) {
          invoice.media[type].forEach((filePath) => {
            if (fs.existsSync(filePath)) {
              attachments.push({
                filename: filePath.split("/").pop(),
                path: filePath,
              });
            }
          });
        }
      });
    }

    // 4️⃣ Send email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"SalesManager" <${process.env.EMAIL_USER}>`,
      to: invoice.email || "client@example.com",
      subject: `Invoice for ${invoice.customerName}`,
      text: `Dear ${invoice.customerName},\n\nPlease find your invoice attached along with any media files.\n\nRegards,\nSalesManager`,
      attachments,
    });

    console.log("✅ Invoice email sent successfully to:", invoice.email);
  } catch (err) {
    console.error("❌ Error sending invoice email:", err);
  }
};

module.exports = sendInvoiceEmail;
