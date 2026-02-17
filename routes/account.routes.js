const express = require("express");
const { createBankAccount, getAllBankAccounts, getBankAccountById, updateBankAccount, deleteBankAccount, getBankAccountStats, getAccountsByBranch, getAccountsByType, updateAccountBalance, deleteBankAccountEntry, checkCombination } = require("../controller/account/account.controller");
const { getAllPaymentMethods, getPaymentMethodById, upsertPaymentMethod, updatePaymentMethodStatus, deletePaymentMethod } = require("../controller/account/paymentMethod.controller");

const router = express.Router();

//! Bank Account routes
router.post("/create-account", createBankAccount);
router.get("/get-all-accounts", getAllBankAccounts);
router.get("/check-combination",checkCombination)
router.get("/get-account/:id", getBankAccountById);
router.put("/update-account/:id", updateBankAccount);
router.delete("/delete-account/:id", deleteBankAccount);

router.delete("/delete-account-entry/:id", deleteBankAccountEntry);

router.get("/account-stats", getBankAccountStats);
router.get("/branch-accounts/:branchId", getAccountsByBranch);
router.get("/accounts-by-type/:type", getAccountsByType);
router.put("/update-balance/:id", updateAccountBalance);









//! Payment Method routes
// Public routes (for frontend)
router.get("/get-payment-methods", getAllPaymentMethods);
router.get("/get-payment-method/:id", getPaymentMethodById);

// Admin routes
router.post("/upsert-payment-method", upsertPaymentMethod);

router.patch("/update-payment-method-status/:id", updatePaymentMethodStatus);

router.delete("/delete-payment-method/:id", deletePaymentMethod);

module.exports = bankRoutes = router;