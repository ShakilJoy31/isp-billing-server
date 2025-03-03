

const AuthorityUser = require("../../models/authorityUser");
const DoctorsInformation = require("../../models/doctor");
const RolePermission = require("../../models/rolePermission");
const User = require("../../models/User");

const { Op, Sequelize } = require("sequelize");

const loginFunction = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || (password !== user.password)) throw new Error("Invalid Credentials!");
    return res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};


const authorityLoginFunction = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the user with authority roles
    const user = await AuthorityUser.findOne({
      where: {
        email,
        role: { [Op.in]: ["admin", "doctor", "doctor-assistant", "super-admin"] },
      },
    });

    if (!user || password !== user.password) {
      throw new Error("Invalid Credentials for Authority User!");
    }

    let doctorInfo = null;

    // Fetch doctor information if the user is a doctor
    if (user.role === "doctor" || user.role === 'doctor-assistant') {
      doctorInfo = await DoctorsInformation.findOne({
        where: { id: user.doctorId },
      });
    }

    return res.status(200).json({ user, doctorInfo });
  } catch (error) {
    next(error);
  }
};



// Getting all authority users from database
const getAllAuthorityUsers = async (req, res, next) => {
  try {
    // Fetch all users from the database
    const users = await AuthorityUser.findAll();

    // Return the list of users
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Deleting authority user according to the id
const deleteAuthorityUser = async (req, res, next) => {
  try {
    const { id } = req.params; // Extract the id from the request parameters

    // Find the user by id and delete them
    const user = await AuthorityUser.destroy({
      where: { id }
    });

    // Check if the user was found and deleted
    if (user === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return a success message
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};





























































// Getting all patient users
const getAllPatientUsers = async (req, res, next) => {
  try {
    // Fetch all users from the database
    const users = await User.findAll();

    // Return the list of users
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Delete patient user
const deletePatientUser = async (req, res, next) => {
  try {
    const { id } = req.params; // Extract the id from the request parameters

    // Find the user by id and delete them
    const user = await User.destroy({
      where: { id }
    });

    // Check if the user was found and deleted
    if (user === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return a success message
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};





























































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


module.exports = {loginFunction, authorityLoginFunction, getAllAuthorityUsers, getAllPatientUsers, addRolePermissions, getPermissionsForRole, updatePermission, getPermissions, deleteAuthorityUser,deletePatientUser, roleAccordingToId};
