const express = require("express");
const { getActiveClientsReport, getClientDueReport, getClientListReport } = require("../controller/reports/clientReport.controller");
const { getInvoiceSummaryReport, getInvoiceDetailsReport } = require("../controller/reports/invoiceReport.controller");
const { getExpenseReport } = require("../controller/reports/paymentReport.controller");
const { getMasterReport, getNewConnectionReport } = require("../controller/reports/masterReport.controller");
const router = express.Router();

//! New Client Reports for Ring Tel
router.get("/active-clients", getActiveClientsReport);
router.get("/client-due", getClientDueReport);
router.get("/client-list", getClientListReport);


//! Invoice reports
router.get("/invoices/summary", getInvoiceSummaryReport);
router.get("/invoices/details", getInvoiceDetailsReport);
router.get("/payments/expenses", getExpenseReport);





//! Other report or the master report. 
router.get("/master", getMasterReport);
router.get("/new-connections", getNewConnectionReport);



module.exports = router;