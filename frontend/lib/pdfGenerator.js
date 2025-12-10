import jsPDF from 'jspdf';
import { formatCurrency } from './utils';

export const generateInvoicePDF = (invoiceData, invoiceNumber) => {
    const doc = new jsPDF();

    // Calculate totals
    let subtotal = 0;
    let totalWeight = 0;

    invoiceData.lineItems?.forEach(item => {
        const itemSubtotal = item.quantity * item.unitPrice;
        subtotal += itemSubtotal;

        // Add item weight to total
        if (item.weight) {
            totalWeight += item.weight;
        }
    });

    const total = subtotal; // No tax

    // Header - Company Name
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Ocean Gate International', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Live Seafood Export - Lobsters', 105, 27, { align: 'center' });

    // Contact Information
    doc.setFontSize(9);
    doc.text('108,Karungoda,Pannuppitiya, Sri Lanka', 105, 32, { align: 'center' });
    doc.text('Phone: +94711 7469490 | Email: info.dry@gmail.com', 105, 37, { align: 'center' });

    // Invoice Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 105, 50, { align: 'center' });

    // Invoice Details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice #: ${invoiceNumber}`, 20, 62);
    doc.text(`Date: ${invoiceData.date || new Date().toISOString().split('T')[0]}`, 20, 68);

    // Customer and Shipping Details (Two Columns)
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Customer Details:', 20, 80);
    doc.text('Shipping Details:', 120, 80);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    // Customer Info
    doc.text(`Name: ${invoiceData.customer.name}`, 20, 87);

    // Handle multi-line address
    const addressLines = doc.splitTextToSize(invoiceData.customer.address, 80);
    let yPos = 92;
    addressLines.forEach((line, index) => {
        if (index === 0) {
            doc.text(`Address: ${line}`, 20, yPos);
        } else {
            doc.text(`         ${line}`, 20, yPos + (index * 4));
        }
    });
    yPos = 92 + (addressLines.length * 4);
    doc.text(`Phone: ${invoiceData.customer.phone || 'N/A'}`, 20, yPos);
    doc.text(`Email: ${invoiceData.customer.email || 'N/A'}`, 20, yPos + 5);

    // Shipping Info
    doc.text(`AWB: ${invoiceData.shipping.awbNumber}`, 120, 87);
    doc.text(`Flight: ${invoiceData.shipping.flightNumber}`, 120, 92);
    doc.text(`Code: ${invoiceData.shipping.code}`, 120, 97);
    doc.text(`HC Number: ${invoiceData.shipping.hcNumber || 'N/A'}`, 120, 102);
    doc.text(`Parking Center: ${invoiceData.shipping.parkingCenter || 'N/A'}`, 120, 107);

    // Line Items Table
    yPos = 120;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');

    // Table Headers
    doc.text('Item', 20, yPos);
    doc.text('Qty', 120, yPos);
    doc.text('Weight', 138, yPos);
    doc.text('Unit Price', 160, yPos);
    doc.text('Total', 188, yPos, { align: 'right' });

    // Header Line
    doc.setLineWidth(0.5);
    doc.line(20, yPos + 2, 190, yPos + 2);

    yPos += 8;
    doc.setFont('helvetica', 'normal');

    // Line Items
    invoiceData.lineItems?.forEach((item) => {
        const itemTotal = item.quantity * item.unitPrice;
        const itemWeight = item.weight || 0;
        const itemText = doc.splitTextToSize(item.description, 90);

        doc.text(itemText[0], 20, yPos);
        doc.text(item.quantity.toString(), 120, yPos);
        doc.text(`${itemWeight.toFixed(2)} kg`, 138, yPos);
        doc.text(formatCurrency(item.unitPrice), 160, yPos);
        doc.text(formatCurrency(itemTotal), 188, yPos, { align: 'right' });
        yPos += 6;
    });

    // Totals Section
    yPos += 3;
    doc.setLineWidth(0.3);
    doc.line(20, yPos, 190, yPos);
    yPos += 8;

    const totalsX = 155;
    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal:', totalsX, yPos);
    doc.text(formatCurrency(subtotal), 188, yPos, { align: 'right' });

    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('TOTAL:', totalsX, yPos);
    doc.text(formatCurrency(total), 188, yPos, { align: 'right' });

    yPos += 10;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Weight: ${totalWeight.toFixed(2)} kg`, totalsX, yPos);

    // Save PDF with invoice number as filename
    doc.save(`${invoiceNumber}.pdf`);
};
