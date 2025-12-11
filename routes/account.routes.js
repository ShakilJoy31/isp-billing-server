const express = require("express");
const { createBankAccount, getAllBankAccounts, getBankAccountById, updateBankAccount, deleteBankAccount, getBankAccountStats, getAccountsByBranch, getAccountsByType, updateAccountBalance, deleteBankAccountEntry } = require("../controller/account/account.controller");

const router = express.Router();

// Bank Account routes
router.post("/create-account", createBankAccount);
router.get("/get-all-accounts", getAllBankAccounts);
router.get("/get-account/:id", getBankAccountById);
router.put("/update-account/:id", updateBankAccount);
router.delete("/delete-account/:id", deleteBankAccount);

router.delete("/delete-account-entry/:id", deleteBankAccountEntry);

router.get("/account-stats", getBankAccountStats);
router.get("/branch-accounts/:branchId", getAccountsByBranch);
router.get("/accounts-by-type/:type", getAccountsByType);
router.put("/update-balance/:id", updateAccountBalance);

module.exports = bankRoutes = router;