const express = require("express");
const { getClientStatusReport, getClientPackageDistributionReport, getClientLocationReport, getReferralClientReport } = require("../controller/reports/clientReport.controller");
const { getRevenueCollectionReport, getPaymentStatusReport, getMonthlyBillingReport, getEmployeeCollectionReport, getTransactionApprovalReport, getBankAccountBalanceReport, getExpenseReport } = require("../controller/reports/finintialReport.controller");
const { getEmployeeAttendanceReport, getSalaryPaymentReport } = require("../controller/reports/attendenceReport.controller");
const { getExpenseCategoryReport, getBankTransactionReport, getAccountReconciliationReport, getAssetManagementReport } = require("../controller/reports/expenseReport.controller");
const { getChatSupportReport, getReminderNotificationReport, getCustomerSupportPerformanceReport, getIssueCategoryReport } = require("../controller/reports/communicationReport.controller");
const router = express.Router();

//! Client Reports
router.get("/client-status", getClientStatusReport);
router.get("/package-distribution", getClientPackageDistributionReport);
router.get("/client-location", getClientLocationReport);
router.get("/referral-clients", getReferralClientReport);










//! Financial Reports
router.get("/revenue-collection", getRevenueCollectionReport);
router.get("/payment-status", getPaymentStatusReport);
router.get("/monthly-billing", getMonthlyBillingReport);
router.get("/employee-collection", getEmployeeCollectionReport);



router.get("/transaction-approval", getTransactionApprovalReport);
router.get("/bank-account-balance", getBankAccountBalanceReport);
router.get("/expenses", getExpenseReport);











//! Other reports.
router.get("/attendance", getEmployeeAttendanceReport);
router.get("/salary-payments", getSalaryPaymentReport);
router.get("/expense-category", getExpenseCategoryReport);
router.get("/bank-transactions", getBankTransactionReport);
router.get("/account-reconciliation", getAccountReconciliationReport);
router.get("/asset-management", getAssetManagementReport);









//! Communication Reports
router.get("/chat-support", getChatSupportReport);
router.get("/reminder-notifications", getReminderNotificationReport);
router.get("/customer-support-performance", getCustomerSupportPerformanceReport);
router.get("/issue-categories", getIssueCategoryReport);

module.exports = router;
