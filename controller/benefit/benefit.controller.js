const sequelize = require("../../database/connection");
const Benefit = require("../../models/benefit/benefit.model");
const { Op } = require("sequelize");

//! Create new benefit

const createBenefit = async (req, res, next) => {
  try {
    const {
      name,
      description,
      type,
      category,
      basePrice,
      discountPrice,
      currency,
      billingCycle,
      internetSpeed,
      dataLimit,
      uploadSpeed,
      downloadSpeed,
      includesTv,
      includesPhone,
      includesWifi,
      tvChannels,
      phoneMinutes,
      contractLength,
      installationFee,
      equipmentFee,
      startDate,
      endDate,
      isActive,
      isFeatured,
      minContractLength,
      eligibilityCriteria,
      features,
      termsConditions
    } = req.body;

    // Validate required fields
    if (!name || !type || !basePrice || !startDate) {
      return res.status(400).json({ 
        message: "Missing required fields: name, type, basePrice, startDate" 
      });
    }

    // Check if benefit with same name already exists
    const existingBenefit = await Benefit.findOne({
      where: { name }
    });

    if (existingBenefit) {
      return res.status(400).json({ 
        message: "Benefit with this name already exists" 
      });
    }

    // Create new benefit
    const newBenefit = await Benefit.create({
      name,
      description,
      type,
      category: category || 'General',
      basePrice,
      discountPrice,
      currency: currency || 'BDT',
      billingCycle: billingCycle || 'Monthly',
      internetSpeed,
      dataLimit,
      uploadSpeed,
      downloadSpeed,
      includesTv: includesTv || false,
      includesPhone: includesPhone || false,
      includesWifi: includesWifi !== undefined ? includesWifi : true,
      tvChannels,
      phoneMinutes,
      contractLength,
      installationFee,
      equipmentFee,
      startDate,
      endDate,
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured || false,
      minContractLength,
      eligibilityCriteria,
      features,
      termsConditions,
      createdBy: req.user?.id || 'admin'
    });

    return res.status(201).json({
      message: "Benefit created successfully!",
      data: newBenefit
    });
  } catch (error) {
    console.error("Error creating benefit:", error);
    next(error);
  }
};





//! Get all benefits with filtering and pagination

const getAllBenefits = async (req, res, next) => {
  try {
    const { 
      page = 1,
      limit = 10,
      search,
      type,
      category,
      isActive,
      isFeatured,
      minPrice,
      maxPrice,
      billingCycle,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    // Build where clause for filtering
    const whereClause = {};
    
    // Handle type filter (ignore empty strings)
    if (type && type !== '') {
      whereClause.type = type;
    }
    
    // Handle category filter (ignore empty strings)
    if (category && category !== '') {
      whereClause.category = category;
    }
    
    // Handle isActive filter (convert string to boolean, ignore empty strings)
    if (isActive !== undefined && isActive !== '') {
      whereClause.isActive = isActive === 'true';
    }
    
    // Handle isFeatured filter (convert string to boolean, ignore empty strings)
    if (isFeatured !== undefined && isFeatured !== '') {
      whereClause.isFeatured = isFeatured === 'true';
    }
    
    // Handle billingCycle filter (ignore empty strings)
    if (billingCycle && billingCycle !== '') {
      whereClause.billingCycle = billingCycle;
    }
    
    // Price range filter (ignore empty strings and 0 values)
    if ((minPrice && minPrice !== '') || (maxPrice && maxPrice !== '')) {
      whereClause.basePrice = {};
      if (minPrice && minPrice !== '') {
        whereClause.basePrice[Op.gte] = parseFloat(minPrice);
      }
      if (maxPrice && maxPrice !== '') {
        whereClause.basePrice[Op.lte] = parseFloat(maxPrice);
      }
    }
    
    // Search filter (ignore empty strings)
    if (search && search !== '') {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
        // Note: benefitId field doesn't exist in your model, removed it
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Validate and set sort order
    const validSortOrders = ['ASC', 'DESC'];
    const finalSortOrder = validSortOrders.includes(sortOrder.toUpperCase()) 
      ? sortOrder.toUpperCase() 
      : 'DESC';

    // Validate sortBy field to prevent SQL injection
    const validSortFields = [
      'name', 'type', 'category', 'basePrice', 'billingCycle', 
      'isActive', 'isFeatured', 'startDate', 'endDate', 'createdAt', 'updatedAt'
    ];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const benefits = await Benefit.findAndCountAll({
      where: whereClause,
      order: [[finalSortBy, finalSortOrder]],
      limit: parseInt(limit),
      offset: offset
    });

    return res.status(200).json({
      message: "Benefits retrieved successfully!",
      data: benefits.rows,
      meta: {
        totalItems: benefits.count,
        totalPages: Math.ceil(benefits.count / parseInt(limit)),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error retrieving benefits:", error);
    next(error);
  }
};






//! Get benefit by ID
const getBenefitById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid benefit ID" });
    }

    const benefit = await Benefit.findOne({ where: { id } });

    if (!benefit) {
      return res.status(404).json({ message: "Benefit not found" });
    }

    return res.status(200).json({
      message: "Benefit retrieved successfully!",
      data: benefit
    });
  } catch (error) {
    console.error("Error retrieving benefit:", error);
    next(error);
  }
};








//! Update benefit
const updateBenefit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid benefit ID" });
    }

    // Find the benefit
    const benefit = await Benefit.findOne({ where: { id } });

    if (!benefit) {
      return res.status(404).json({ message: "Benefit not found" });
    }

    // Prevent updating benefitId
    delete updateData.benefitId;
    delete updateData.id;

    // Check if updating name would create duplicate
    if (updateData.name && updateData.name !== benefit.name) {
      const existingBenefit = await Benefit.findOne({
        where: { 
          name: updateData.name,
          id: { [Op.ne]: id }
        }
      });

      if (existingBenefit) {
        return res.status(400).json({ 
          message: "Benefit with this name already exists" 
        });
      }
    }

    // Update the benefit
    await benefit.update({
      ...updateData,
      updatedBy: req.user?.id || 'admin'
    });

    return res.status(200).json({
      message: "Benefit updated successfully!",
      data: benefit
    });
  } catch (error) {
    console.error("Error updating benefit:", error);
    next(error);
  }
};







//! Delete benefit
const deleteBenefit = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid benefit ID" });
    }

    const benefit = await Benefit.findOne({ where: { id } });

    if (!benefit) {
      return res.status(404).json({ message: "Benefit not found" });
    }

    await benefit.destroy();

    return res.status(200).json({
      message: "Benefit deleted successfully!"
    });
  } catch (error) {
    console.error("Error deleting benefit:", error);
    next(error);
  }
};









//! Get active benefits (for customer facing)
const getActiveBenefits = async (req, res, next) => {
  try {
    const { 
      type,
      category,
      featured
    } = req.query;

    const whereClause = {
      isActive: true
    };

    if (type) whereClause.type = type;
    if (category) whereClause.category = category;
    if (featured === 'true') whereClause.isFeatured = true;

    const benefits = await Benefit.findAll({
      where: whereClause,
      order: [
        ['isFeatured', 'DESC'],
        ['basePrice', 'ASC']
      ]
    });

    return res.status(200).json({
      message: "Active benefits retrieved successfully!",
      data: benefits
    });
  } catch (error) {
    console.error("Error retrieving active benefits:", error);
    next(error);
  }
};







//! Get benefit statistics
const getBenefitStats = async (req, res, next) => {
  try {
    const stats = await Benefit.findAll({
      attributes: [
        'type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('AVG', sequelize.col('basePrice')), 'avgPrice']
      ],
      group: ['type']
    });

    const totalBenefits = await Benefit.count();
    const activeBenefits = await Benefit.count({ where: { isActive: true } });
    const featuredBenefits = await Benefit.count({ where: { isFeatured: true } });

    return res.status(200).json({
      message: "Benefit statistics retrieved successfully!",
      data: {
        totalBenefits,
        activeBenefits,
        featuredBenefits,
        typeBreakdown: stats
      }
    });
  } catch (error) {
    console.error("Error retrieving benefit statistics:", error);
    next(error);
  }
};









//! Toggle benefit status
const toggleBenefitStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid benefit ID" });
    }

    const benefit = await Benefit.findOne({ where: { id } });

    if (!benefit) {
      return res.status(404).json({ message: "Benefit not found" });
    }

    await benefit.update({
      isActive: !benefit.isActive,
      updatedBy: req.user?.id || 'admin'
    });

    return res.status(200).json({
      message: `Benefit ${benefit.isActive ? 'activated' : 'deactivated'} successfully!`,
      data: benefit
    });
  } catch (error) {
    console.error("Error toggling benefit status:", error);
    next(error);
  }
};

module.exports = {
  createBenefit,
  getAllBenefits,
  getBenefitById,
  updateBenefit,
  deleteBenefit,
  getActiveBenefits,
  getBenefitStats,
  toggleBenefitStatus
};