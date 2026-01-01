const express = require("express");
const { createClient, checkUserCredentials, getClientsByReferCode, createAuthority, getAllClients, getAllAuthorities, updateClient, deleteClient, getClientById, getEmployeeById, updateEmployee, deleteEmployee, searchEmployeeAdvanced, getEmployeeByUserId } = require("../controller/auth/signup");
const { addRolePermissions, getPermissionsForRole, getPermissions, updatePermission, roleAccordingToId } = require("../controller/user/role-permission");
const { getSuperAdminDashboard,  getClientGrowthData, getDashboardStats, getRecentActivities, getFinancialOverview, getEmployeePerformance, createSuperAdmin } = require("../controller/auth/superAdminDashboard.controller");
const router = express.Router();



//! Client routes
router.post("/register-new-client", createClient);
router.put("/update-client/:id", updateClient);
router.delete("/delete-client/:id", deleteClient);
router.get("/get-refered-users-according-to-userId/:userId", getClientsByReferCode);
router.get("/get-clients", getAllClients);
router.get("/get-client-according-to-id/:id", getClientById);
// router.get("/get-client-dashboard-data", getDataById);




router.post("/login", checkUserCredentials);




//! Employee routes
router.post("/register-new-authority-user",createAuthority);
router.get("/get-authority", getAllAuthorities);
router.get("/get-employee-according-to-id/:id", getEmployeeById);
router.get('/search', searchEmployeeAdvanced);
router.get('/user/:userId', getEmployeeByUserId);
router.put("/update-employee/:id", updateEmployee);
router.delete("/delete-employee/:id", deleteEmployee);








//! Super-Admin Routes
router.post("/register-new-super-admin", createSuperAdmin); // not being used till now. if you need to use this make another table for the super-admins creation. 
router.get("/super-admin-dashboard", getSuperAdminDashboard);
router.get("/dashboard-stats", getDashboardStats);
router.get("/recent-activities", getRecentActivities);
router.get("/financial-overview", getFinancialOverview);
router.get("/employee-performance", getEmployeePerformance);
router.get("/client-growth", getClientGrowthData);






//! Permissions
router.post("/add-role-permission", addRolePermissions);
router.get("/get-role-permission/:roleName", getPermissionsForRole);
router.get("/get-role-permissions", getPermissions);
router.put("/update-role-permission/:id", updatePermission);
router.get("/role-according-to-id/:id", roleAccordingToId);


module.exports = authenticationRoutes = router;