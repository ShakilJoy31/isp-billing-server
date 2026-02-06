const express = require("express");
const { createTransaction, getTransactionsByUserId, updateTransactionStatus, getAllTransactions, getTransactionById, getTransactionStats, bulkUpdateTransactionStatus, getPaidMonthsForUser } = require("../controller/payment/client-payment.controller");
const { createEmployeePayment, getPaymentsByEmployee, getTodaysCollections, searchClientForPayment, getClientPaymentHistory, getEmployeeCollectionStats, getPaymentDetails, verifyPayment, getAllEmployeeCollections, markAsDeposited, getAllEmployeeCollectionStats, getAllEmployeePerformanceStats, updateEmployeePayment, deleteCollectedBillBySuperAdmin, getClientPaidMonthsHistory } = require("../controller/payment/employee-payment.controller");
const router = express.Router();


//! Client payment routes...........
// Existing routes
router.post("/add-new-payment", createTransaction);
// For dashboard (CurrentPackage component)

router.get("/payment-history/:userId/:clientId", getTransactionsByUserId);

router.get('/user-paid-months/:userId', getPaidMonthsForUser);
// New routes


router.put("/update-status/:transactionId", updateTransactionStatus);
router.get("/transactions", getAllTransactions); // For admin dashboard
router.get("/transaction/:transactionId", getTransactionById);
router.get("/transaction-stats", getTransactionStats);
router.put("/bulk-update-status", bulkUpdateTransactionStatus);








//! The routes for bill payment by employee...........
// Employee routes
router.post("/collect-payment", createEmployeePayment);
router.get("/employee-collections/:employeeId", getPaymentsByEmployee);
router.get("/today-collections/:employeeId", getTodaysCollections);
router.get("/client-search", searchClientForPayment);
router.get("/client-history/:clientUserId", getClientPaymentHistory);
router.get("/collection-stats/:employeeId", getEmployeeCollectionStats);
router.get("/payment-details/:paymentId", getPaymentDetails);
router.put("/update-payment/:paymentId", updateEmployeePayment);



//! Super Admin routes
router.get("/all-collections", getAllEmployeeCollections);
router.put("/verify-payment/:paymentId", verifyPayment);
router.put("/mark-deposited/:paymentId", markAsDeposited);
router.get("/collection-stats-for-super-admin", getAllEmployeeCollectionStats); // Added this
router.get("/employee-performance", getAllEmployeePerformanceStats); // Added this
router.delete("/delete-collected-bill-by-super-admin/:id", deleteCollectedBillBySuperAdmin)



module.exports = paymentRoutes = router;