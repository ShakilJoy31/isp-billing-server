const express = require("express");
const { createExpenseCategory, getAllExpenseCategories, getExpenseCategoryById, updateExpenseCategory, deleteExpenseCategory, getExpenseCategoryStats, toggleCategoryStatus } = require("../controller/expense/category.controller");
const { createExpenseSubCategory, getAllExpenseSubCategories, getExpenseSubCategoryById, updateExpenseSubCategory, deleteExpenseSubCategory, getExpenseSubCategoryStats, toggleSubCategoryStatus, getSubCategoriesByCategoryId } = require("../controller/expense/sub-category.controller");
const { createExpense, getAllExpenses, getExpenseById, updateExpense, deleteExpense, approveExpense, rejectExpense, getExpenseStats, getExpensesByCategory, getExpensesByAccount, toggleExpenseStatus } = require("../controller/expense/expense.controller");

const router = express.Router();

//! Expense Category routes
router.post("/create-category", createExpenseCategory);
router.get("/get-all-categories", getAllExpenseCategories);
router.get("/get-category/:id", getExpenseCategoryById);
router.put("/update-category/:id", updateExpenseCategory);
router.delete("/delete-category/:id", deleteExpenseCategory);
// Additional routes
router.get("/category-stats", getExpenseCategoryStats);
router.put("/toggle-status/:id", toggleCategoryStatus);











//! Expense Sub-Category routes
router.post("/create-sub-category", createExpenseSubCategory);
router.get("/get-all-sub-categories", getAllExpenseSubCategories);
router.get("/get-sub-category/:id", getExpenseSubCategoryById);
router.put("/update-sub-category/:id", updateExpenseSubCategory);
router.delete("/delete-sub-category/:id", deleteExpenseSubCategory);
// Additional routes
router.get("/sub-category-stats", getExpenseSubCategoryStats);
router.put("/toggle-sub-category-status/:id", toggleSubCategoryStatus);
router.get("/by-category/:categoryId", getSubCategoriesByCategoryId);












//! Expense Routes
router.post("/create-expense", createExpense);
router.get("/get-all-expenses", getAllExpenses);
router.get("/get-expense/:id", getExpenseById);
router.put("/update-expense/:id", updateExpense);
router.delete("/delete-expense/:id", deleteExpense);
// Expense approval/rejection routes
router.put("/approve-expense/:id", approveExpense);
router.put("/reject-expense/:id", rejectExpense);
// Additional expense routes
router.get("/expense-stats", getExpenseStats);
router.get("/by-category/:categoryId", getExpensesByCategory);
router.get("/by-account/:accountId", getExpensesByAccount);
router.put("/toggle-expense-status/:id", toggleExpenseStatus);

module.exports = expenseRoutes = router;