const sequelize = require("../../database/connection");
const { Op } = require("sequelize");
const ExpenseCategory = require("../../models/expense/category.model");
const ExpenseSubCategory = require("../../models/expense/sub-category.model");

// Create new expense sub-category
const createExpenseSubCategory = async (req, res, next) => {
  try {
    const {
      subCategoryName,
      subCategoryCode,
      description,
      budgetLimit,
      isActive,
      requiresApproval,
      categoryId
    } = req.body;

    // Validate required fields
    if (!subCategoryName || !subCategoryCode || !categoryId) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields: subCategoryName, subCategoryCode, categoryId" 
      });
    }

    // Check if category exists
    const category = await ExpenseCategory.findOne({ 
      where: { id: categoryId } 
    });

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Parent category not found"
      });
    }

    // Check if sub-category code already exists
    const existingSubCategory = await ExpenseSubCategory.findOne({ 
      where: { subCategoryCode } 
    });

    if (existingSubCategory) {
      return res.status(400).json({
        success: false,
        message: "Sub-category code already exists"
      });
    }

    // Create new expense sub-category
    const newSubCategory = await ExpenseSubCategory.create({
      subCategoryName,
      subCategoryCode,
      description,
      budgetLimit: budgetLimit || 0,
      isActive: isActive !== undefined ? isActive : true,
      requiresApproval: requiresApproval || false,
      categoryId,
      createdBy: req.user?.id || 'admin'
    });

    return res.status(201).json({
      success: true,
      message: "Expense sub-category created successfully",
      data: newSubCategory
    });
  } catch (error) {
    console.error("Error creating expense sub-category:", error);
    next(error);
  }
};

// Get all expense sub-categories with filtering and pagination
const getAllExpenseSubCategories = async (req, res, next) => {
  try {
    const { 
      page = 1,
      limit = 10,
      search,
      isActive,
      requiresApproval,
      categoryId,
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
        { subCategoryName: { [Op.like]: `%${search}%` } },
        { subCategoryCode: { [Op.like]: `%${search}%` } },
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
    
    // Handle categoryId filter
    if (categoryId && categoryId !== '') {
      whereClause.categoryId = parseInt(categoryId);
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
      'subCategoryName', 'subCategoryCode', 'budgetLimit', 
      'createdAt', 'updatedAt'
    ];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'subCategoryName';

    const subCategories = await ExpenseSubCategory.findAndCountAll({
      where: whereClause,
      order: [[finalSortBy, finalSortOrder]],
      limit: parseInt(limit),
      offset: offset,
      include: [
        {
          model: ExpenseCategory,
          as: 'category',
          attributes: ['id', 'categoryName', 'categoryCode']
        }
      ]
    });

    return res.status(200).json({
      success: true,
      message: "Expense sub-categories retrieved successfully!",
      data: subCategories.rows,
      meta: {
        totalItems: subCategories.count,
        totalPages: Math.ceil(subCategories.count / parseInt(limit)),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error retrieving expense sub-categories:", error);
    next(error);
  }
};

// Get expense sub-category by ID
const getExpenseSubCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid sub-category ID" 
      });
    }

    const subCategory = await ExpenseSubCategory.findOne({ 
      where: { id },
      include: [
        {
          model: ExpenseCategory,
          as: 'category',
          attributes: ['id', 'categoryName', 'categoryCode', 'isActive']
        }
      ]
    });

    if (!subCategory) {
      return res.status(404).json({ 
        success: false,
        message: "Expense sub-category not found" 
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense sub-category retrieved successfully!",
      data: subCategory
    });
  } catch (error) {
    console.error("Error retrieving expense sub-category:", error);
    next(error);
  }
};

// Update expense sub-category
const updateExpenseSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid sub-category ID" 
      });
    }

    // Find the sub-category
    const subCategory = await ExpenseSubCategory.findOne({ where: { id } });

    if (!subCategory) {
      return res.status(404).json({ 
        success: false,
        message: "Expense sub-category not found" 
      });
    }

    // Prevent updating id and sub-category code
    delete updateData.id;
    
    // If trying to update sub-category code, check for duplicates
    if (updateData.subCategoryCode && updateData.subCategoryCode !== subCategory.subCategoryCode) {
      const existingSubCategory = await ExpenseSubCategory.findOne({
        where: { 
          subCategoryCode: updateData.subCategoryCode,
          id: { [Op.ne]: id }
        }
      });

      if (existingSubCategory) {
        return res.status(400).json({
          success: false,
          message: "Sub-category code already exists"
        });
      }
    }

    // Validate category if provided
    if (updateData.categoryId && updateData.categoryId !== subCategory.categoryId) {
      const category = await ExpenseCategory.findOne({
        where: { id: updateData.categoryId }
      });
      
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Category not found"
        });
      }
    }

    // Update the sub-category
    await subCategory.update({
      ...updateData,
      updatedBy: req.user?.id || 'admin'
    });

    return res.status(200).json({
      success: true,
      message: "Expense sub-category updated successfully!",
      data: subCategory
    });
  } catch (error) {
    console.error("Error updating expense sub-category:", error);
    next(error);
  }
};

// Delete expense sub-category (hard delete)
const deleteExpenseSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid sub-category ID" 
      });
    }

    const subCategory = await ExpenseSubCategory.findOne({ where: { id } });

    if (!subCategory) {
      return res.status(404).json({ 
        success: false,
        message: "Expense sub-category not found" 
      });
    }

    await subCategory.destroy();
    return res.status(200).json({
      success: true,
      message: "Expense sub-category deleted successfully!"
    });
  } catch (error) {
    console.error("Error deleting expense sub-category:", error);
    next(error);
  }
};

// Toggle sub-category status
const toggleSubCategoryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid sub-category ID" 
      });
    }

    if (isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: "isActive field is required"
      });
    }

    const subCategory = await ExpenseSubCategory.findOne({ 
      where: { id },
      include: [
        {
          model: ExpenseCategory,
          as: 'category',
          attributes: ['id', 'isActive']
        }
      ]
    });

    if (!subCategory) {
      return res.status(404).json({ 
        success: false,
        message: "Expense sub-category not found" 
      });
    }

    // If activating, check if parent category is active
    if (isActive === true && subCategory.category && !subCategory.category.isActive) {
      return res.status(400).json({
        success: false,
        message: "Cannot activate sub-category with inactive parent category"
      });
    }

    await subCategory.update({
      isActive: isActive,
      updatedBy: req.user?.id || 'admin'
    });

    return res.status(200).json({
      success: true,
      message: `Sub-category ${isActive ? 'activated' : 'deactivated'} successfully!`,
      data: { isActive: subCategory.isActive }
    });
  } catch (error) {
    console.error("Error toggling sub-category status:", error);
    next(error);
  }
};

// Get sub-category statistics
const getExpenseSubCategoryStats = async (req, res, next) => {
  try {
    const totalSubCategories = await ExpenseSubCategory.count();
    const activeSubCategories = await ExpenseSubCategory.count({ where: { isActive: true } });

    const approvalStats = await ExpenseSubCategory.findAll({
      attributes: [
        'requiresApproval',
        [sequelize.fn('COUNT', sequelize.col('ExpenseSubCategory.id')), 'count']
      ],
      group: ['requiresApproval']
    });

    // Get sub-categories with budget limit
    const budgetSubCategories = await ExpenseSubCategory.count({
      where: { 
        budgetLimit: { [Op.gt]: 0 }
      }
    });

    // Get count by category
    const categoryStats = await ExpenseSubCategory.findAll({
      attributes: [
        'categoryId',
        [sequelize.fn('COUNT', sequelize.col('ExpenseSubCategory.id')), 'count']
      ],
      group: ['categoryId'],
      include: [
        {
          model: ExpenseCategory,
          as: 'category',
          attributes: ['categoryName', 'categoryCode']
        }
      ]
    });

    // Get most recent sub-categories
    const recentSubCategories = await ExpenseSubCategory.findAll({
      where: { isActive: true },
      order: [['updatedAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'subCategoryName', 'subCategoryCode', 'budgetLimit', 'updatedAt'],
      include: [
        {
          model: ExpenseCategory,
          as: 'category',
          attributes: ['categoryName']
        }
      ]
    });

    return res.status(200).json({
      success: true,
      message: "Expense sub-category statistics retrieved successfully!",
      data: {
        totalSubCategories,
        activeSubCategories,
        inactiveSubCategories: totalSubCategories - activeSubCategories,
        approvalRequiredBreakdown: approvalStats,
        budgetSubCategories,
        subCategoriesWithoutBudget: activeSubCategories - budgetSubCategories,
        categoryBreakdown: categoryStats,
        recentSubCategories
      }
    });
  } catch (error) {
    console.error("Error retrieving expense sub-category statistics:", error);
    next(error);
  }
};

// Get sub-categories by category ID
const getSubCategoriesByCategoryId = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    
    if (!categoryId || isNaN(categoryId)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid category ID" 
      });
    }

    // Check if category exists
    const category = await ExpenseCategory.findOne({
      where: { id: parseInt(categoryId) }
    });

    if (!category) {
      return res.status(404).json({ 
        success: false,
        message: "Category not found" 
      });
    }

    const subCategories = await ExpenseSubCategory.findAll({
      where: { 
        categoryId: parseInt(categoryId),
        isActive: true 
      },
      order: [['subCategoryName', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      message: `Sub-categories for ${category.categoryName} retrieved successfully!`,
      parentCategory: {
        id: category.id,
        categoryName: category.categoryName,
        categoryCode: category.categoryCode
      },
      data: subCategories,
      count: subCategories.length
    });
  } catch (error) {
    console.error("Error retrieving sub-categories by category:", error);
    next(error);
  }
};

module.exports = {
  createExpenseSubCategory,
  getAllExpenseSubCategories,
  getExpenseSubCategoryById,
  updateExpenseSubCategory,
  deleteExpenseSubCategory,
  getExpenseSubCategoryStats,
  toggleSubCategoryStatus,
  getSubCategoriesByCategoryId
};