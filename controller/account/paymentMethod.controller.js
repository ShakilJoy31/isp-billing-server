
const sequelize = require("../../database/connection");
const PaymentMethod = require("../../models/account/paymentMethodm.model");

//! Get all payment methods
const getAllPaymentMethods = async (req, res, next) => {
  try {
    const methods = await PaymentMethod.findAll({
      order: [['createdAt', 'ASC']]
    });

    // Transform data to match frontend format
    const transformedMethods = methods.map(method => ({
      id: method.methodId,
      name: method.name,
      icon: method.iconUrl,
      merchantNumber: method.merchantNumber,
      merchantName: method.merchantName,
      paymentType: method.paymentType,
      colors: method.colors || {
        primary: '#000000',
        secondary: '#ffffff',
        gradient: 'linear-gradient(135deg, #000000 0%, #ffffff 100%)'
      },
      hasQRCode: method.hasQRCode,
      qrCodeUrl: method.qrCodeUrl,
      appInstructions: method.appInstructions || [],
      manualInstructions: method.manualInstructions || [],
      qrInstructions: method.qrInstructions || {},
      importantNotes: method.importantNotes || [],
      isActive: method.isActive,
      status: method.status
    }));

    return res.status(200).json({
      success: true,
      message: "Payment methods retrieved successfully!",
      data: transformedMethods
    });
  } catch (error) {
    console.error("Error getting payment methods:", error);
    next(error);
  }
};

//! Get payment method by ID
const getPaymentMethodById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const method = await PaymentMethod.findOne({
      where: { methodId: id }
    });

    if (!method) {
      return res.status(404).json({
        success: false,
        message: "Payment method not found!"
      });
    }

    const transformedMethod = {
      id: method.methodId,
      name: method.name,
      icon: method.iconUrl,
      merchantNumber: method.merchantNumber,
      merchantName: method.merchantName,
      paymentType: method.paymentType,
      colors: method.colors || {
        primary: '#000000',
        secondary: '#ffffff',
        gradient: 'linear-gradient(135deg, #000000 0%, #ffffff 100%)'
      },
      hasQRCode: method.hasQRCode,
      qrCodeUrl: method.qrCodeUrl,
      appInstructions: method.appInstructions || [],
      manualInstructions: method.manualInstructions || [],
      qrInstructions: method.qrInstructions || {},
      importantNotes: method.importantNotes || [],
      isActive: method.isActive,
      status: method.status
    };

    return res.status(200).json({
      success: true,
      message: "Payment method retrieved successfully!",
      data: transformedMethod
    });
  } catch (error) {
    console.error("Error getting payment method by ID:", error);
    next(error);
  }
};

//! Create or update payment method
const upsertPaymentMethod = async (req, res, next) => {
  try {
    const {
      methodId,
      name,
      iconUrl,
      merchantNumber,
      merchantName,
      paymentType,
      hasQRCode,
      qrCodeUrl,
      colors,
      appInstructions,
      manualInstructions,
      qrInstructions,
      importantNotes,
      isActive,
      status
    } = req.body;

    const userEmail = req.user?.email || "system";

    // Validate required fields
    if (!methodId || !name || !merchantNumber || !merchantName || !paymentType) {
      return res.status(400).json({
        success: false,
        message: "Method ID, name, merchant number, merchant name, and payment type are required!"
      });
    }

    // Validate methodId
    const validMethodIds = ['bkash', 'nagad', 'rocket', 'upay'];
    if (!validMethodIds.includes(methodId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid method ID. Must be one of: bkash, nagad, rocket, upay"
      });
    }

    // Prepare data for upsert
    const methodData = {
      methodId,
      name,
      iconUrl: iconUrl || null,
      merchantNumber,
      merchantName,
      paymentType,
      hasQRCode: hasQRCode || false,
      qrCodeUrl: qrCodeUrl || null,
      colors: colors || {
        primary: '#000000',
        secondary: '#ffffff',
        gradient: 'linear-gradient(135deg, #000000 0%, #ffffff 100%)'
      },
      appInstructions: appInstructions || [],
      manualInstructions: manualInstructions || [],
      qrInstructions: qrInstructions || {},
      importantNotes: importantNotes || [],
      isActive: isActive !== undefined ? isActive : true,
      status: status || 'active',
      updatedBy: userEmail
    };

    // Check if method exists
    const existingMethod = await PaymentMethod.findOne({
      where: { methodId }
    });

    let message;
    let method;

    if (existingMethod) {
      // Update existing method
      await PaymentMethod.update(methodData, {
        where: { methodId }
      });
      
      method = await PaymentMethod.findOne({ where: { methodId } });
      message = "Payment method updated successfully!";
    } else {
      // Create new method
      methodData.createdBy = userEmail;
      method = await PaymentMethod.create(methodData);
      message = "Payment method created successfully!";
    }

    const transformedMethod = {
      id: method.methodId,
      name: method.name,
      icon: method.iconUrl,
      merchantNumber: method.merchantNumber,
      merchantName: method.merchantName,
      paymentType: method.paymentType,
      colors: method.colors,
      hasQRCode: method.hasQRCode,
      qrCodeUrl: method.qrCodeUrl,
      appInstructions: method.appInstructions,
      manualInstructions: method.manualInstructions,
      qrInstructions: method.qrInstructions,
      importantNotes: method.importantNotes,
      isActive: method.isActive,
      status: method.status
    };

    return res.status(200).json({
      success: true,
      message,
      data: transformedMethod
    });
  } catch (error) {
    console.error("Error upserting payment method:", error);
    next(error);
  }
};

//! Update payment method status
const updatePaymentMethodStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive, status } = req.body;
    const userEmail = req.user?.email || "system";

    const method = await PaymentMethod.findOne({ where: { methodId: id } });
    if (!method) {
      return res.status(404).json({
        success: false,
        message: "Payment method not found!"
      });
    }

    const updateData = {
      updatedBy: userEmail
    };

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    if (status) {
      updateData.status = status;
    }

    await PaymentMethod.update(updateData, {
      where: { methodId: id }
    });

    return res.status(200).json({
      success: true,
      message: "Payment method status updated successfully!"
    });
  } catch (error) {
    console.error("Error updating payment method status:", error);
    next(error);
  }
};

//! Delete payment method
const deletePaymentMethod = async (req, res, next) => {
  try {
    const { id } = req.params;

    const method = await PaymentMethod.findOne({ where: { methodId: id } });
    if (!method) {
      return res.status(404).json({
        success: false,
        message: "Payment method not found!"
      });
    }

    await PaymentMethod.destroy({
      where: { methodId: id }
    });

    return res.status(200).json({
      success: true,
      message: "Payment method deleted successfully!"
    });
  } catch (error) {
    console.error("Error deleting payment method:", error);
    next(error);
  }
};

module.exports = {
  getAllPaymentMethods,
  getPaymentMethodById,
  upsertPaymentMethod,
  updatePaymentMethodStatus,
  deletePaymentMethod
};


