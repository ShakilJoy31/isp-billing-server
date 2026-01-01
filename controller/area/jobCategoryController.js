const { Op } = require("sequelize");
const JobCategory = require("../../models/area/jobCategory.model");

const createJobCategory = async (req, res, next) => {
  try {
    const { categoryName, categoryDetails, status } = req.body;

    // Check if the job category already exists
    const existingCategory = await JobCategory.findOne({ where: { categoryName } });
    if (existingCategory) {
      return res.status(409).json({
        message: "This job category already exists! Try a different name.",
      });
    }

    // Create a new job category
    const newJobCategory = await JobCategory.create({
      categoryName,
      categoryDetails,
      status: status || "Active",
    });

    return res.status(201).json({
      message: "Job category created successfully!",
      data: newJobCategory,
    });
  } catch (error) {
    next(error);
  }
};

const getAllJobCategories = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Extract filters
    const { search, status } = req.query;
    let whereCondition = {};

    // Add search filter
    if (search) {
      whereCondition = {
        ...whereCondition,
        [Op.or]: [
          { categoryName: { [Op.like]: `%${search}%` } },
          { categoryDetails: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    // Add status filter
    if (status) {
      whereCondition.status = status;
    }

    // Fetch paginated job categories
    const { count, rows: jobCategories } = await JobCategory.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    if (!jobCategories || jobCategories.length === 0) {
      return res.status(404).json({
        message: "No job categories found in the database.",
      });
    }

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      message: "Job categories retrieved successfully!",
      data: jobCategories,
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

const updateJobCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { categoryName, categoryDetails, status } = req.body;

    // Find the job category by ID
    const categoryToUpdate = await JobCategory.findOne({ where: { id } });

    if (!categoryToUpdate) {
      return res.status(404).json({
        message: "Job category not found!",
      });
    }

    // Check if the new categoryName already exists (if it's being updated)
    if (categoryName && categoryName !== categoryToUpdate.categoryName) {
      const existingCategory = await JobCategory.findOne({ where: { categoryName } });
      if (existingCategory) {
        return res.status(409).json({
          message: "A job category with this name already exists! Try a different name.",
        });
      }
    }

    // Update the job category fields
    if (categoryName) categoryToUpdate.categoryName = categoryName;
    if (categoryDetails !== undefined) categoryToUpdate.categoryDetails = categoryDetails;
    if (status) categoryToUpdate.status = status;

    // Save the updated job category
    await categoryToUpdate.save();

    return res.status(200).json({
      message: "Job category updated successfully!",
      data: categoryToUpdate,
    });
  } catch (error) {
    next(error);
  }
};

const deleteJobCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the job category by ID
    const categoryToDelete = await JobCategory.findOne({ where: { id } });

    if (!categoryToDelete) {
      return res.status(404).json({
        message: "Job category not found!",
      });
    }

    // Delete the job category
    await categoryToDelete.destroy();

    return res.status(200).json({
      message: "Job category deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

const getJobCategoryNames = async (req, res, next) => {
  try {
    const jobCategories = await JobCategory.findAll({
      attributes: ['categoryName'],
      where: { status: 'Active' },
      group: ['categoryName'],
      order: [['categoryName', 'ASC']],
    });

    const categoryNames = jobCategories.map(category => category.categoryName);

    if (!categoryNames || categoryNames.length === 0) {
      return res.status(404).json({
        message: "No job category names found in the database.",
      });
    }

    return res.status(200).json({
      message: "Job category names retrieved successfully!",
      data: categoryNames,
    });
  } catch (error) {
    next(error);
  }
};

const getJobCategoryStats = async (req, res, next) => {
  try {
    // Get total job categories count
    const totalCategories = await JobCategory.count();
    
    // Get active job categories count
    const activeCategories = await JobCategory.count({ where: { status: 'Active' } });
    
    // Get inactive job categories count
    const inactiveCategories = await JobCategory.count({ where: { status: 'Inactive' } });

    return res.status(200).json({
      message: "Job category statistics retrieved successfully!",
      data: {
        totalCategories,
        activeCategories,
        inactiveCategories,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJobCategory,
  getAllJobCategories,
  deleteJobCategory,
  updateJobCategory,
  getJobCategoryNames,
  getJobCategoryStats
};