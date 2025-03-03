const express = require("express");
const { loginFunction, authorityLoginFunction, getAllAuthorityUsers, getAllPatientUsers, addRolePermissions, getAllPermissions, updatePermission, getPermissionsForRole, getPermissions, deleteAuthorityUser, deletePatientUser, roleAccordingToId } = require("../controller/auth/signin");
const { createUser, createAuthorityUser, updateAuthorityUserAccount } = require("../controller/auth/signup");
const { updateUserAccount } = require("../controller/auth/update_user");
const router = express.Router();

// Patient user.
router.post("/login", loginFunction);
router.get("/patient-users", getAllPatientUsers);
router.post("/signup", createUser);
router.put("/update-user-account/:id", updateUserAccount);
router.delete("/patient-delete/:id", deletePatientUser)

// Auhority user
router.post("/authority-login", authorityLoginFunction);
router.get("/authority-users", getAllAuthorityUsers);
router.post("/authority-signup", createAuthorityUser);
router.put("/authority-update-account/:id", updateAuthorityUserAccount);
router.delete("/authority-delete/:id", deleteAuthorityUser)


// Permission management
router.post("/add-role-permission", addRolePermissions);
router.get("/get-role-permission/:roleName", getPermissionsForRole);
router.get("/get-role-permissions", getPermissions);
router.put("/update-role-permission/:id", updatePermission);
router.get("/role-according-to-id/:id", roleAccordingToId);


module.exports = authenticationRoutes = router;