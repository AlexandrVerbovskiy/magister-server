const PDFDocument = require("pdfkit");
const {
  tenantPaymentCalculate,
  tenantPaymentFeeCalculate,
} = require("./paymentCalculations");
const { shortTimeConverter, getFactOrderDays } = require("./dateHelpers");
const STATIC = require("../static");

baseConvertPaymentProps = (payment) => {
  const offerStartDate = payment.orderOfferStartDate;
  const offerEndDate = payment.orderOfferEndDate;
  const offerPricePerDay = payment.orderOfferPricePerDay;

  const offerTotalPrice = tenantPaymentCalculate(
    offerStartDate,
    offerEndDate,
    payment.tenantFee,
    offerPricePerDay
  );

  const offerSubTotalPrice =
    getFactOrderDays(offerStartDate, offerEndDate) * offerPricePerDay;

  const factTotalFee = tenantPaymentFeeCalculate(
    offerStartDate,
    offerEndDate,
    payment.tenantFee,
    offerPricePerDay
  );

  const duration =
    offerStartDate == offerEndDate
      ? shortTimeConverter(offerStartDate)
      : `${shortTimeConverter(offerStartDate)} - ${shortTimeConverter(
          offerEndDate
        )}`;

  const createdInfo = payment.createdAt
    ? shortTimeConverter(payment.createdAt)
    : "-";

  const dueInfo = payment.createdAt
    ? shortTimeConverter(payment.createdAt)
    : "-";

  return {
    billTo: payment.listingAddress ?? payment.listingCity,
    shipTo: payment.listingAddress ?? payment.listingCity,
    invoiceId: payment.orderId,
    invoiceDate: createdInfo,
    purchaseOrder: payment.orderId,
    dueDate: dueInfo,
    offer: {
      factTotalPrice: offerTotalPrice.toFixed(2),
      fee: payment.tenantFee,
      listingName: payment.listingName,
      pricePerDay: offerPricePerDay.toFixed(2),
      subTotalPrice: offerSubTotalPrice.toFixed(2),
      factTotalFee: factTotalFee.toFixed(2),
      duration,
    },
    payed: payment.adminApproved ? offerTotalPrice.toFixed(2) : (0).toFixed(2),
    currency: STATIC.CURRENCY,
  };
};

const COLORS = {
  BLACK: "#000000",
  GRAY: "#666666",
  BLUE: "#6084a4",
};

const tableColumnsInfo = [
  { width: 60, left: 20 },
  { width: 120, left: 80 },
  { width: 120, left: 200 },
  { width: 150, left: 320 },
  { width: 120, left: 470 },
];

const shortTableColumnsInfo = [
  { width: 450, left: 20 },
  { width: 120, left: 470 },
];

const tableAllBorders = (doc, rows, tableColumnsInfo, currentRowY) => {
  rows.forEach((rowInfo, index) => {
    doc
      .rect(
        tableColumnsInfo[index].left,
        currentRowY - 2,
        tableColumnsInfo[index].width,
        40
      )
      .stroke();
  });
};

const tableBorders = (doc, rows, tableColumnsInfo, currentRowY) => {
  rows.forEach((rowInfo, index) => {
    const { left, width } = tableColumnsInfo[index];
    const top = currentRowY - 3;
    const height = 39;

    doc
      .moveTo(left, top + height)
      .lineTo(left + width, top + height)
      .moveTo(left, top)
      .lineTo(left, top + height)
      .moveTo(left + width, top)
      .lineTo(left + width, top + height)
      .stroke();
  });
};

const invoicePdfGeneration = async (payment, res) => {
  const invoiceData = baseConvertPaymentProps(payment);

  const doc = new PDFDocument({
    margins: { top: 50, left: 20, bottom: 50, right: 20 },
  });

  doc.pipe(res);
  doc.registerFont(
    "WorkSans",
    "public/static/fonts/WorkSans/WorkSans-Regular.ttf"
  );
  doc.registerFont(
    "WorkSans-Bold",
    "public/static/fonts/WorkSans/WorkSans-Bold.ttf"
  );
  doc.registerFont(
    "WorkSans-SemiBold",
    "public/static/fonts/WorkSans/WorkSans-SemiBold.ttf"
  );

  doc
    .font("WorkSans-SemiBold")
    .fontSize(18)
    .text("Indice Admin", { align: "left" })
    .font("WorkSans")
    .moveDown(0.25)
    .fontSize(12)
    .fillColor(COLORS.GRAY)
    .text("RentAbout", { align: "left" })
    .fillColor(COLORS.BLACK);

  doc
    .font("WorkSans-SemiBold")
    .fontSize(18)
    .text("INVOICE", 20, 50, { align: "right" });

  doc.moveDown(2);

  let currentRowY = doc.y;

  doc
    .fontSize(14)
    .text(`Bill To ${invoiceData.billTo}`, 20, currentRowY, { align: "left" })
    .text(`Ship To ${invoiceData.shipTo}`, 160, currentRowY, {
      align: "left",
    })
    .font("WorkSans");

  doc
    .fontSize(12)
    .text(`Invoice #`, 350, currentRowY, { align: "right", width: 100 })
    .moveDown(0.5)
    .text(`Invoice Date #`, 350, doc.y, { align: "right", width: 100 })
    .moveDown(0.5)
    .text(`P.O #`, 350, doc.y, { align: "right", width: 100 })
    .moveDown(0.5)
    .text(`Due Date #`, 350, doc.y, { align: "right", width: 100 });

  doc
    .fontSize(12)
    .fillColor(COLORS.BLUE)
    .text(`Inv-${invoiceData.invoiceId}`, 400, currentRowY, {
      align: "right",
    })
    .moveDown(0.5)
    .text(`${invoiceData.invoiceDate}`, 400, doc.y, { align: "right" })
    .moveDown(0.5)
    .text(`${invoiceData.purchaseOrder}`, 400, doc.y, { align: "right" })
    .moveDown(0.5)
    .text(`${invoiceData.dueDate}`, 400, doc.y, { align: "right" })
    .fillColor(COLORS.BLACK);

  doc.moveDown(3);

  currentRowY = doc.y;

  const tableTitleRowInfo = [
    "#",
    "Description",
    "Per Day",
    "Rental Duration",
    "Total",
  ];

  tableTitleRowInfo.forEach((rowInfo, index) => {
    doc
      .font("WorkSans-SemiBold")
      .text(rowInfo, tableColumnsInfo[index].left, currentRowY + 10, {
        width: tableColumnsInfo[index].width,
        align: "center",
      })
      .font("WorkSans");
  });

  tableAllBorders(doc, tableTitleRowInfo, tableColumnsInfo, currentRowY);

  doc.moveDown();

  currentRowY = doc.y;

  let tableRowInfo = [
    "01",
    invoiceData.offer.listingName,
    `${invoiceData.currency}${invoiceData.offer.pricePerDay}`,
    invoiceData.offer.duration,
    `${invoiceData.currency}${invoiceData.offer.subTotalPrice}`,
  ];

  tableRowInfo.forEach((rowInfo, index) => {
    doc
      .fillColor(COLORS.BLUE)
      .fontSize(12)
      .text(rowInfo, tableColumnsInfo[index].left, currentRowY + 10, {
        width:
          index == 0
            ? tableColumnsInfo[index].width
            : tableColumnsInfo[index].width - 20,
        align: index == 0 ? "center" : "right",
      })
      .fillColor(COLORS.BLACK);
  });

  tableBorders(doc, tableRowInfo, tableColumnsInfo, currentRowY);

  doc.moveDown();

  currentRowY = doc.y;

  doc
    .font("WorkSans-SemiBold")
    .fontSize(12)
    .text("Subtotal", shortTableColumnsInfo[0].left, currentRowY + 10, {
      width: shortTableColumnsInfo[0].width - 20,
      align: "right",
    })
    .font("WorkSans")
    .fillColor(COLORS.BLUE)
    .text(
      `${invoiceData.currency}${invoiceData.offer.subTotalPrice}`,
      shortTableColumnsInfo[1].left,
      currentRowY + 10,
      {
        width: shortTableColumnsInfo[1].width - 20,
        align: "right",
      }
    )
    .fillColor(COLORS.BLACK);

  tableBorders(doc, [0, 1], shortTableColumnsInfo, currentRowY);

  doc.moveDown();

  currentRowY = doc.y;

  doc
    .font("WorkSans-SemiBold")
    .fontSize(12)
    .text(
      `Sales Tax ${invoiceData.offer.fee}%`,
      shortTableColumnsInfo[0].left,
      currentRowY + 10,
      {
        width: shortTableColumnsInfo[0].width - 20,
        align: "right",
      }
    )
    .font("WorkSans")
    .fillColor(COLORS.BLUE)
    .text(
      `${invoiceData.currency}${invoiceData.offer.factTotalFee}`,
      shortTableColumnsInfo[1].left,
      currentRowY + 10,
      {
        width: shortTableColumnsInfo[1].width - 20,
        align: "right",
      }
    )
    .fillColor(COLORS.BLACK);

  tableBorders(doc, [0, 1], shortTableColumnsInfo, currentRowY);

  doc.moveDown();

  currentRowY = doc.y;

  doc
    .font("WorkSans-SemiBold")
    .fontSize(12)
    .text(`Total`, shortTableColumnsInfo[0].left, currentRowY + 10, {
      width: shortTableColumnsInfo[0].width - 20,
      align: "right",
    })
    .text(
      `${invoiceData.currency}${invoiceData.offer.factTotalPrice}`,
      shortTableColumnsInfo[1].left,
      currentRowY + 10,
      {
        width: shortTableColumnsInfo[1].width - 20,
        align: "right",
      }
    )
    .font("WorkSans");

  tableBorders(doc, [0, 1], shortTableColumnsInfo, currentRowY);

  doc.moveDown();

  currentRowY = doc.y;

  doc
    .font("WorkSans-SemiBold")
    .fontSize(12)
    .text(`Payed`, shortTableColumnsInfo[0].left, currentRowY + 10, {
      width: shortTableColumnsInfo[0].width - 20,
      align: "right",
    })
    .text(
      `${invoiceData.currency}${invoiceData.payed}`,
      shortTableColumnsInfo[1].left,
      currentRowY + 10,
      {
        width: shortTableColumnsInfo[1].width - 20,
        align: "right",
      }
    )
    .font("WorkSans");

  tableBorders(doc, [0, 1], shortTableColumnsInfo, currentRowY);

  doc.end();

  return doc;
};

module.exports = { invoicePdfGeneration };
