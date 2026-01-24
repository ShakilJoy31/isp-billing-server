const express = require("express");
const { getClientRegistrationReport, getClientStatusReport, getClientPackageDistributionReport, getClientLocationReport, getReferralClientReport, getEmployeeReport, getUserGrowthReport, getRevenueCollectionReport, getPaymentStatusReport, getMonthlyBillingReport, getEmployeeCollectionReport, getTransactionApprovalReport, getBankAccountBalanceReport, getExpenseReport, getEmployeeAttendanceReport, getSalaryPaymentReport, getLeaveAttendanceSummary, getExpenseCategoryReport, getBankTransactionReport, getAccountReconciliationReport, getAssetManagementReport } = require("../controller/reports/super-adminReports.controller");
const router = express.Router();


// Client Reports
router.get("/client-registration", getClientRegistrationReport);
router.get("/client-status", getClientStatusReport);
router.get("/package-distribution", getClientPackageDistributionReport);
router.get("/client-location", getClientLocationReport);
router.get("/referral-clients", getReferralClientReport);
router.get("/employees", getEmployeeReport);
router.get("/user-growth", getUserGrowthReport);





// Financial Reports
router.get("/revenue-collection", getRevenueCollectionReport);
router.get("/payment-status", getPaymentStatusReport);
router.get("/monthly-billing", getMonthlyBillingReport);
router.get("/employee-collection", getEmployeeCollectionReport);
router.get("/transaction-approval", getTransactionApprovalReport);
router.get("/bank-account-balance", getBankAccountBalanceReport);
router.get("/expenses", getExpenseReport);







// Attendence
router.get("/attendance", getEmployeeAttendanceReport);
router.get("/salary-payments", getSalaryPaymentReport);
router.get("/leave-attendance-summary", getLeaveAttendanceSummary);




// Category
router.get("/expense-category", getExpenseCategoryReport);
router.get("/bank-transactions", getBankTransactionReport);
router.get("/account-reconciliation", getAccountReconciliationReport);
router.get("/asset-management", getAssetManagementReport);








// Communication Reports
router.get("/chat-support", getChatSupportReport);
router.get("/reminder-notifications", getReminderNotificationReport);
router.get("/customer-support-performance", getCustomerSupportPerformanceReport);
router.get("/issue-categories", getIssueCategoryReport);

module.exports = router;