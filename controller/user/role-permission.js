const RolePermission = require("../../models/Authentication/permission.model");


// Role and permission
const addRolePermissions = async (req, res, next) => {
    try {
      // Get role name and permissions data from the request body
      const { roleName, permissions } = req.body;
  
      // Validate the input
      if (!roleName || typeof roleName !== "string") {
        return res.status(400).json({ message: "Invalid roleName. Expected a string." });
      }
  
      if (!permissions || !Array.isArray(permissions)) {
        return res.status(400).json({ message: "Invalid permissions data. Expected an array of permissions." });
      }
  
      // Check if the role already exists
      const existingRole = await RolePermission.findOne({ where: { roleName } });
  
      if (existingRole) {
        // If the role exists, update its permissions
        existingRole.permissions = permissions;
        await existingRole.save();
      } else {
        // If the role does not exist, create a new entry
        await RolePermission.create({
          roleName,
          permissions, // Store permissions as a JSON array
        });
      }
  
      return res.status(201).json({ message: "Permissions added successfully!" });
    } catch (error) {
      next(error);
    }
  };
  
  
  
  const getPermissionsForRole = async (req, res, next) => {
    try {
      const { roleName } = req.params;
  
      // Validate the input
      if (!roleName || typeof roleName !== "string") {
        return res.status(400).json({ message: "Invalid roleName. Expected a string." });
      }
  
      // Normalize the role name (e.g., convert to lowercase and remove spaces/hyphens)
      const normalizedRoleName = roleName.toLowerCase().replace(/[\s-]+/g, '');
  
      // Find the role in the database
      const role = await RolePermission.findOne({
        where: Sequelize.where(
          Sequelize.fn(
            'LOWER', // Convert to lowercase
            Sequelize.fn(
              'REPLACE', // Replace spaces and hyphens
              Sequelize.fn('REPLACE', Sequelize.col('roleName'), ' ', ''),
              '-',
              ''
            )
          ),
          '=',
          normalizedRoleName
        )
      });
  
      if (!role) {
        return res.status(404).json({ message: "Role not found." });
      }
  
      // Parse the permissions if it's stored as a JSON string
      const permissions = Array.isArray(role.permissions) ? role.permissions : JSON.parse(role.permissions);
  
      // Return the permissions for the role
      return res.status(200).json({
        roleName: role.roleName,
        permissions: permissions, // Directly return the array of strings
      });
    } catch (error) {
      next(error);
    }
  };
  
  
  const getPermissions = async (req, res, next) => {
    try {
      // Find all roles in the database
      const roles = await RolePermission.findAll();
  
      // If no roles are found, return a 404 error
      if (!roles || roles.length === 0) {
        return res.status(404).json({ message: "No roles found." });
      }
  
      // Check if the query parameter onlyRole is set to 'yes'
      if (req.query.onlyRole === 'yes') {
        // Extract only the roleNames
        const roleNames = roles.map(role => role.roleName);
        return res.status(200).json(roleNames);
      }
  
      // Map through the roles and parse the permissions if necessary
      const rolesWithPermissions = roles.map((role) => {
        return {
          id: role.id,
          roleName: role.roleName,
          permissions: Array.isArray(role.permissions) ? role.permissions : JSON.parse(role.permissions),
        };
      });
  
      // Return all roles with their permissions
      return res.status(200).json(rolesWithPermissions);
    } catch (error) {
      next(error);
    }
  };
  
  
  
  // Update permission
  const updatePermission = async (req, res, next) => {
    try {
      const { id } = req.params; // Get id from the URL parameters
      const { permissions, roleName } = req.body; // Get permissions array from the request body
  
      // Validate the input
      if (!id || isNaN(id)) {
        return res.status(400).json({ message: "Invalid id. Expected a number." });
      }
  
      if (!permissions || !Array.isArray(permissions)) {
        return res.status(400).json({ message: "Invalid permissions. Expected an array." });
      }
  
      // Debug: Log the permissions data
      console.log("Permissions data received:", permissions);
  
      // Find the role in the database by id
      const role = await RolePermission.findOne({ where: { id } });
  
      if (!role) {
        return res.status(404).json({ message: "Role not found." });
      }
  
      // Update the permissions
      role.permissions = permissions; // The setter will automatically stringify this
      role.roleName = roleName;
  
      // Debug: Log the role data before saving
      console.log("Role data before saving:", role);
  
      // Save the updated role
      await role.save();
  
      return res.status(200).json({ message: "Permissions updated successfully!" });
    } catch (error) {
      console.error("Error updating permissions:", error);
      next(error);
    }
  };
  
  
  
  const roleAccordingToId = async (req, res, next) => {
    try {
      const { id } = req.params; // Get id from the URL parameters
  
      // Validate the input
      if (!id || isNaN(id)) {
        return res.status(400).json({ message: "Invalid id. Expected a number." });
      }
  
      // Find the role in the database by id
      const role = await AuthorityUser.findOne({ where: { id } });
  
      if (!role) {
        return res.status(404).json({ message: "Role not found." });
      }
  
      // Return the role data
      return res.status(200).json({
        message: "Role retrieved successfully!",
        role: role.role,
      });
    } catch (error) {
      console.error("Error retrieving role:", error);
      next(error);
    }
  };
  

  module.exports = { addRolePermissions, getPermissionsForRole, updatePermission, getPermissions, roleAccordingToId};