const sequelize = require("../../database/connection");
const { Op } = require("sequelize");
const ExpenseCategory = require("../../models/expense/category.model");

// Create new expense category
const createExpenseCategory = async (req, res, next) => {
  try {
    const {
      categoryName,
      categoryCode,
      description,
      budgetLimit,
      isActive,
      requiresApproval
    } = req.body;

    // Validate required fields
    if (!categoryName || !categoryCode) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields: categoryName, categoryCode" 
      });
    }

    // Check if category code already exists
    const existingCategory = await ExpenseCategory.findOne({ 
      where: { categoryCode } 
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category code already exists"
      });
    }

    // Create new expense category
    const newCategory = await ExpenseCategory.create({
      categoryName,
      categoryCode,
      description,
      budgetLimit: budgetLimit || 0,
      isActive: isActive !== undefined ? isActive : true,
      requiresApproval: requiresApproval || false,
      createdBy: req.user?.id || 'admin'
    });

    return res.status(201).json({
      success: true,
      message: "Expense category created successfully",
      data: newCategory
    });
  } catch (error) {
    console.error("Error creating expense category:", error);
    next(error);
  }
};

// Get all expense categories with filtering and pagination
const getAllExpenseCategories = async (req, res, next) => {
  try {
    const { 
      page = 1,
      limit = 10,
      search,
      isActive,
      requiresApproval,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'ASC'
    } = req.query;

    // Build where clause for filtering
    const whereClause = {};
    
    // Handle search filter
    if (search && search !== '') {
      whereClause[Op.or] = [
        { categoryName: { [Op.like]: `%${search}%` } },
        { categoryCode: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Handle isActive filter
    if (isActive !== undefined && isActive !== '') {
      whereClause.isActive = isActive === 'true';
    }
    
    // Handle requiresApproval filter
    if (requiresApproval !== undefined && requiresApproval !== '') {
      whereClause.requiresApproval = requiresApproval === 'true';
    }
    
    // Date range filter for creation date
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate && startDate !== '') {
        whereClause.createdAt[Op.gte] = new Date(startDate);
      }
      if (endDate && endDate !== '') {
        whereClause.createdAt[Op.lte] = new Date(endDate);
      }
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Validate and set sort order
    const validSortOrders = ['ASC', 'DESC'];
    const finalSortOrder = validSortOrders.includes(sortOrder.toUpperCase()) 
      ? sortOrder.toUpperCase() 
      : 'ASC';

    // Validate sortBy field
    const validSortFields = [
      'categoryName', 'categoryCode', 'budgetLimit', 
      'createdAt', 'updatedAt'
    ];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'categoryName';

    const categories = await ExpenseCategory.findAndCountAll({
      where: whereClause,
      order: [[finalSortBy, finalSortOrder]],
      limit: parseInt(limit),
      offset: offset
    });

    return res.status(200).json({
      success: true,
      message: "Expense categories retrieved successfully!",
      data: categories.rows,
      meta: {
        totalItems: categories.count,
        totalPages: Math.ceil(categories.count / parseInt(limit)),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error retrieving expense categories:", error);
    next(error);
  }
};

// Get expense category by ID
const getExpenseCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid category ID" 
      });
    }

    const category = await ExpenseCategory.findOne({ 
      where: { id }
    });

    if (!category) {
      return res.status(404).json({ 
        success: false,
        message: "Expense category not found" 
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense category retrieved successfully!",
      data: category
    });
  } catch (error) {
    console.error("Error retrieving expense category:", error);
    next(error);
  }
};

// Update expense category
const updateExpenseCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid category ID" 
      });
    }

    // Find the category
    const category = await ExpenseCategory.findOne({ where: { id } });

    if (!category) {
      return res.status(404).json({ 
        success: false,
        message: "Expense category not found" 
      });
    }

    // Prevent updating id and category code
    delete updateData.id;
    
    // If trying to update category code, check for duplicates
    if (updateData.categoryCode && updateData.categoryCode !== category.categoryCode) {
      const existingCategory = await ExpenseCategory.findOne({
        where: { 
          categoryCode: updateData.categoryCode,
          id: { [Op.ne]: id }
        }
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Category code already exists"
        });
      }
    }

    // Update the category
    await category.update({
      ...updateData,
      updatedBy: req.user?.id || 'admin'
    });

    return res.status(200).json({
      success: true,
      message: "Expense category updated successfully!",
      data: category
    });
  } catch (error) {
    console.error("Error updating expense category:", error);
    next(error);
  }
};

// Delete expense category (soft delete by setting isActive to false)
const deleteExpenseCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid category ID" 
      });
    }

    const category = await ExpenseCategory.findOne({ where: { id } });

    if (!category) {
      return res.status(404).json({ 
        success: false,
        message: "Expense category not found" 
      });
    }

    await category.destroy();
    return res.status(200).json({
      success: true,
      message: "Expense category deactivated successfully!"
    });
  } catch (error) {
    console.error("Error deleting expense category:", error);
    next(error);
  }
};

// Toggle category status
const toggleCategoryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid category ID" 
      });
    }

    if (isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: "isActive field is required"
      });
    }

    const category = await ExpenseCategory.findOne({ where: { id } });

    if (!category) {
      return res.status(404).json({ 
        success: false,
        message: "Expense category not found" 
      });
    }

    await category.update({
      isActive: isActive,
      updatedBy: req.user?.id || 'admin'
    });

    return res.status(200).json({
      success: true,
      message: `Category ${isActive ? 'activated' : 'deactivated'} successfully!`,
      data: { isActive: category.isActive }
    });
  } catch (error) {
    console.error("Error toggling category status:", error);
    next(error);
  }
};

// Get expense category statistics
const getExpenseCategoryStats = async (req, res, next) => {
  try {
    const totalCategories = await ExpenseCategory.count();
    const activeCategories = await ExpenseCategory.count({ where: { isActive: true } });

    const approvalStats = await ExpenseCategory.findAll({
      attributes: [
        'requiresApproval',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['requiresApproval']
    });

    // Get categories with budget limit
    const budgetCategories = await ExpenseCategory.count({
      where: { 
        budgetLimit: { [Op.gt]: 0 }
      }
    });

    // Get most recent categories
    const recentCategories = await ExpenseCategory.findAll({
      where: { isActive: true },
      order: [['updatedAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'categoryName', 'categoryCode', 'budgetLimit', 'updatedAt']
    });

    return res.status(200).json({
      success: true,
      message: "Expense category statistics retrieved successfully!",
      data: {
        totalCategories,
        activeCategories,
        inactiveCategories: totalCategories - activeCategories,
        approvalRequiredBreakdown: approvalStats,
        budgetCategories,
        categoriesWithoutBudget: activeCategories - budgetCategories,
        recentCategories
      }
    });
  } catch (error) {
    console.error("Error retrieving expense category statistics:", error);
    next(error);
  }
};

module.exports = {
  createExpenseCategory,
  getAllExpenseCategories,
  getExpenseCategoryById,
  updateExpenseCategory,
  deleteExpenseCategory,
  getExpenseCategoryStats,
  toggleCategoryStatus
};