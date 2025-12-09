const sequelize = require("../../database/connection");
const ClientInformation = require("../../models/Authentication/client.model");
const Package = require("../../models/package/package.model");

const createPackage = async (req, res, next) => {
  try {
    const {
      packageName,
      packageBandwidth,
      packagePrice,
      packageDetails,
      packageFeatures,
      packageType,
      duration,
      downloadSpeed,
      uploadSpeed,
      dataLimit,
      installationFee,
      discount,
      status,
    } = req.body;

    // Create a new package entry
    const newPackage = await Package.create({
      packageName,
      packageBandwidth,
      packagePrice: parseFloat(packagePrice),
      packageDetails,
      packageFeatures,
      packageType,
      duration,
      downloadSpeed,
      uploadSpeed,
      dataLimit,
      installationFee: parseFloat(installationFee) || 0,
      discount: parseFloat(discount) || 0,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Package created successfully!",
      data: newPackage,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPackages = async (req, res, next) => {
  try {
    // Extract pagination and filter parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Filter parameters
    const search = req.query.search || "";
    const status = req.query.status || "";
    const packageType = req.query.packageType || "";
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;

    // Build where clause
    let whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { packageName: { [Op.like]: `%${search}%` } },
        { packageBandwidth: { [Op.like]: `%${search}%` } },
        { packageDetails: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    if (packageType) {
      whereClause.packageType = packageType;
    }

    if (minPrice || maxPrice) {
      whereClause.packagePrice = {};
      if (minPrice) {
        whereClause.packagePrice[Op.gte] = parseFloat(minPrice);
      }
      if (maxPrice) {
        whereClause.packagePrice[Op.lte] = parseFloat(maxPrice);
      }
    }

    // Fetch paginated packages
    const { count, rows: packages } = await Package.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    // Get package statistics
    const totalPackages = await Package.count();
    const activePackages = await Package.count({ where: { status: "Active" } });
    const inactivePackages = await Package.count({
      where: { status: "Inactive" },
    });

    // Get package types statistics
    const packageTypes = await Package.findAll({
      attributes: [
        "packageType",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["packageType"],
    });

    if (!packages || packages.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No packages found.",
        data: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalItems: 0,
        },
        stats: {
          totalPackages: 0,
          activePackages: 0,
          inactivePackages: 0,
          packageTypes: [],
        },
      });
    }

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      success: true,
      message: "Packages retrieved successfully!",
      data: packages,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
      },
      stats: {
        totalPackages,
        activePackages,
        inactivePackages,
        packageTypes,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getPackageStats = async (req, res, next) => {
  try {
    const totalPackages = await Package.count();
    const activePackages = await Package.count({ where: { status: "Active" } });
    const inactivePackages = await Package.count({
      where: { status: "Inactive" },
    });

    const packageTypes = await Package.findAll({
      attributes: [
        "packageType",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["packageType"],
    });

    const priceStats = await Package.findOne({
      attributes: [
        [sequelize.fn("MIN", sequelize.col("packagePrice")), "minPrice"],
        [sequelize.fn("MAX", sequelize.col("packagePrice")), "maxPrice"],
        [sequelize.fn("AVG", sequelize.col("packagePrice")), "avgPrice"],
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Package statistics retrieved successfully!",
      data: {
        totalPackages,
        activePackages,
        inactivePackages,
        packageTypes,
        priceStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getPackageById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const package = await Package.findByPk(id);

    if (!package) {
      return res.status(404).json({
        success: false,
        message: "Package not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Package retrieved successfully!",
      data: package,
    });
  } catch (error) {
    next(error);
  }
};

const deletePackage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const packageToDelete = await Package.findByPk(id);

    if (!packageToDelete) {
      return res.status(404).json({
        success: false,
        message: "Package not found!",
      });
    }

    // Check if package is being used by clients
    const clientCount = await ClientInformation.count({
      where: { package: packageToDelete.packageName },
    });

    if (clientCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete package. It is being used by ${clientCount} client(s).`,
      });
    }

    await packageToDelete.destroy();

    return res.status(200).json({
      success: true,
      message: "Package deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

const updatePackage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      packageName,
      packageBandwidth,
      packagePrice,
      packageDetails,
      packageFeatures,
      packageType,
      duration,
      downloadSpeed,
      uploadSpeed,
      dataLimit,
      installationFee,
      discount,
      status,
    } = req.body;

    const packageToUpdate = await Package.findByPk(id);

    if (!packageToUpdate) {
      return res.status(404).json({
        success: false,
        message: "Package not found!",
      });
    }

    // Check if the new packageName already exists
    if (packageName && packageName !== packageToUpdate.packageName) {
      const existingPackage = await Package.findOne({ where: { packageName } });
      if (existingPackage) {
        return res.status(409).json({
          success: false,
          message:
            "A package with this name already exists! Try a different name.",
        });
      }
    }

    // Update package fields
    if (packageName) packageToUpdate.packageName = packageName;
    if (packageBandwidth) packageToUpdate.packageBandwidth = packageBandwidth;
    if (packagePrice) packageToUpdate.packagePrice = parseFloat(packagePrice);
    if (packageDetails !== undefined)
      packageToUpdate.packageDetails = packageDetails;
    if (packageFeatures !== undefined)
      packageToUpdate.packageFeatures = packageFeatures;
    if (packageType) packageToUpdate.packageType = packageType;
    if (duration) packageToUpdate.duration = duration;
    if (downloadSpeed !== undefined)
      packageToUpdate.downloadSpeed = downloadSpeed;
    if (uploadSpeed !== undefined) packageToUpdate.uploadSpeed = uploadSpeed;
    if (dataLimit !== undefined) packageToUpdate.dataLimit = dataLimit;
    if (installationFee !== undefined)
      packageToUpdate.installationFee = parseFloat(installationFee) || 0;
    if (discount !== undefined)
      packageToUpdate.discount = parseFloat(discount) || 0;
    if (status) packageToUpdate.status = status;

    await packageToUpdate.save();

    return res.status(200).json({
      success: true,
      message: "Package updated successfully!",
      data: packageToUpdate,
    });
  } catch (error) {
    next(error);
  }
};

const bulkUpdateStatus = async (req, res, next) => {
  try {
    const { ids, status } = req.body;

    if (!ids || !status) {
      return res.status(400).json({
        success: false,
        message: "Package IDs and status are required!",
      });
    }

    const packages = await Package.findAll({ where: { id: ids } });

    if (packages.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No packages found with the provided IDs!",
      });
    }

    // Update all packages
    await Package.update({ status }, { where: { id: ids } });

    return res.status(200).json({
      success: true,
      message: `Successfully updated ${packages.length} package(s) status to ${status}`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPackage,
  getAllPackages,
  getPackageStats,
  getPackageById,
  deletePackage,
  updatePackage,
  bulkUpdateStatus,
};
