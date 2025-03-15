const express = require("express");
const { createClient, checkUserCredentials, getClientsByReferCode, createAuthority, getAllClients, getAllAuthorities, updateClient, deleteClient } = require("../controller/auth/signup");
const { addRolePermissions, getPermissionsForRole, getPermissions, updatePermission, roleAccordingToId } = require("../controller/user/role-permission");
const router = express.Router();


router.post("/register-new-client", createClient);
router.put("/update-client/:id", updateClient)
router.delete("/delete-client/:id", deleteClient)
router.post("/register-new-authority-user",createAuthority)
router.post("/login", checkUserCredentials);
router.get("/get-refered-users-according-to-userId/:userId", getClientsByReferCode);



// Getting clients and authority informations
router.get("/get-clients", getAllClients);
router.get("/get-authority", getAllAuthorities);




router.post("/add-role-permission", addRolePermissions);
router.get("/get-role-permission/:roleName", getPermissionsForRole);
router.get("/get-role-permissions", getPermissions);
router.put("/update-role-permission/:id", updatePermission);
router.get("/role-according-to-id/:id", roleAccordingToId);



module.exports = authenticationRoutes = router;