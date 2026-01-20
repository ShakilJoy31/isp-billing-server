const express = require("express");
const { createWithdrawRequest, getMyWithdrawals, getAllWithdrawals, getPendingWithdrawals, getWithdrawStats, getUserWithdrawals, getWithdrawalById, updateWithdrawal, deleteWithdrawal, approveWithdrawal, rejectWithdrawal, completeWithdrawal } = require("../controller/account/Withdraw.controller");
const router = express.Router();

// Public routes (users submit their own withdrawals)
router.post("/request", createWithdrawRequest);
router.get("/my-withdrawals", getMyWithdrawals);

// Admin routes
router.get("/all", getAllWithdrawals);
router.get("/pending", getPendingWithdrawals);
router.get("/stats", getWithdrawStats);
router.get("/user/:email", getUserWithdrawals);
router.get("/:id", getWithdrawalById);
router.put("/:id", updateWithdrawal);
router.delete("/:id", deleteWithdrawal);
router.put("/approve/:id", approveWithdrawal);
router.put("/reject/:id", rejectWithdrawal);
router.put("/complete/:id", completeWithdrawal);

module.exports = router;