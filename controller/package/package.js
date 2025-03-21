const Package = require("../../models/package/package.model");

const createPackage = async (req, res, next) => {
    try {
      const {
        packageName,
        packageBandwidth,
        packagePrice,
        packageDetails,
        status,
      } = req.body;
  
      // Check if the package already exists based on packageName
      const existingPackage = await Package.findOne({ where: { packageName } });
      if (existingPackage) {
        return res.status(409).json({
          message: "This package already exists! Try a different name.",
        });
      }
  
      // Create a new package entry
      const newPackage = await Package.create({
        packageName,
        packageBandwidth,
        packagePrice,
        packageDetails,
        status,
      });
  
      return res.status(201).json({
        message: "Package created successfully!",
        data: newPackage,
      });
    } catch (error) {
      next(error);
    }
  };


  const getAllPackages = async (req, res, next) => {
    try {
        // Extract pagination parameters from the query string
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided
        const offset = (page - 1) * limit; // Calculate the offset

        // Fetch paginated packages from the database
        const { count, rows: packages } = await Package.findAndCountAll({
            limit, // Number of records to fetch
            offset, // Starting point for fetching records
        });

        // If no packages are found, return a 404 response
        if (!packages || packages.length === 0) {
            return res.status(404).json({
                message: "No packages found in the database.",
            });
        }

        // Calculate total pages
        const totalPages = Math.ceil(count / limit);

        // Return the paginated list of packages
        return res.status(200).json({
            message: "Packages retrieved successfully!",
            data: packages,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: count,
            },
        });
    } catch (error) {
        next(error);
    }
};


const deletePackage = async (req, res, next) => {
  try {
      const { id } = req.params; // Extract the package ID from the request parameters

      // Find the package by ID
      const packageToDelete = await Package.findOne({ where: { id } });

      // If the package doesn't exist, return a 404 response
      if (!packageToDelete) {
          return res.status(404).json({
              message: "Package not found!",
          });
      }

      // Delete the package
      await packageToDelete.destroy();

      return res.status(200).json({
          message: "Package deleted successfully!",
      });
  } catch (error) {
      next(error);
  }
};


const updatePackage = async (req, res, next) => {
  try {
      const { id } = req.params; // Extract the package ID from the request parameters
      const { packageName, packageBandwidth, packagePrice, packageDetails, status } = req.body; // Extract updated fields from the request body

      // Find the package by ID
      const packageToUpdate = await Package.findOne({ where: { id } });

      // If the package doesn't exist, return a 404 response
      if (!packageToUpdate) {
          return res.status(404).json({
              message: "Package not found!",
          });
      }

      // Check if the new packageName already exists (if it's being updated)
      if (packageName && packageName !== packageToUpdate.packageName) {
          const existingPackage = await Package.findOne({ where: { packageName } });
          if (existingPackage) {
              return res.status(409).json({
                  message: "A package with this name already exists! Try a different name.",
              });
          }
      }

      // Update the package fields
      if (packageName) packageToUpdate.packageName = packageName;
      if (packageBandwidth) packageToUpdate.packageBandwidth = packageBandwidth;
      if (packagePrice) packageToUpdate.packagePrice = packagePrice;
      if (packageDetails) packageToUpdate.packageDetails = packageDetails;
      if (status) packageToUpdate.status = status;

      // Save the updated package
      await packageToUpdate.save();

      return res.status(200).json({
          message: "Package updated successfully!",
          data: packageToUpdate,
      });
  } catch (error) {
      next(error);
  }
};

module.exports = { updatePackage, deletePackage, createPackage, getAllPackages };
