const { Op } = require("sequelize");
const moment = require("moment");
const EmployeePayment = require("../../models/payment/employee-payment.model");
const ClientInformation = require("../../models/Authentication/client.model");
const AuthorityInformation = require("../../models/Authentication/authority.model");
const sequelize = require("../../database/connection");
const Package = require("../../models/package/package.model");
const Transaction = require("../../models/payment/client-payment.model");

// Helper: Generate receipt number
const generateReceiptNumber = async () => {
  const year = moment().format("YYYY");
  const month = moment().format("MM");
  const prefix = `RCT-${year}-${month}-`;

  // Find last receipt for this month
  const lastReceipt = await EmployeePayment.findOne({
    where: {
      receiptNumber: {
        [Op.like]: `${prefix}%`,
      },
    },
    order: [["receiptNumber", "DESC"]],
  });

  let sequence = 1;
  if (lastReceipt) {
    const lastSeq = parseInt(lastReceipt.receiptNumber.split("-").pop());
    sequence = lastSeq + 1;
  }

  return `${prefix}${sequence.toString().padStart(6, "0")}`;
};

//! 1. Create Employee Payment
const createEmployeePayment = async (req, res) => {
  try {
    const {
      employeeId,
      clientUserId,
      billingMonth,
      amount,
      paymentMethod,
      transactionId,
      referenceNote,
      notes,
      attachment,
    } = req.body;

    // Validate required fields
    if (!employeeId || !clientUserId || !billingMonth || !amount) {
      return res.status(400).json({
        success: false,
        message:
          "Employee ID, Client ID, billing month and amount are required",
      });
    }

    // Parse billingMonth - handle both "2026-01" and "January 2025" formats
    let monthName, billingYear, formattedBillingMonth;

    // Check if format is YYYY-MM (e.g., "2026-01")
    const yyyyMmRegex = /^(\d{4})-(\d{2})$/;
    // Check if format is Month YYYY (e.g., "January 2025")
    const monthYearRegex = /^(\w+)\s+(\d{4})$/;

    if (yyyyMmRegex.test(billingMonth)) {
      // Format: YYYY-MM (e.g., "2026-01")
      const match = billingMonth.match(yyyyMmRegex);
      const year = match[1];
      const monthNum = parseInt(match[2], 10);

      // Convert month number to month name
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      if (monthNum < 1 || monthNum > 12) {
        return res.status(400).json({
          success: false,
          message: "Invalid month number in billingMonth. Use 01-12",
        });
      }

      monthName = monthNames[monthNum - 1];
      billingYear = year;
      formattedBillingMonth = `${monthName} ${billingYear}`;
    } else if (monthYearRegex.test(billingMonth)) {
      // Format: Month YYYY (e.g., "January 2025")
      const match = billingMonth.match(monthYearRegex);
      monthName = match[1];
      billingYear = match[2];
      formattedBillingMonth = billingMonth; // Already in correct format
    } else {
      return res.status(400).json({
        success: false,
        message:
          "Invalid billing month format. Use 'YYYY-MM' (e.g., '2026-01') or 'Month YYYY' (e.g., 'January 2025')",
      });
    }

    // FIRST: Find client to get their numeric ID
    const client = await ClientInformation.findOne({
      where: { userId: clientUserId },
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // First, get the user's actual ID from the User table
    const user = await ClientInformation.findOne({
      where: { userId: clientUserId },
      attributes: ["id"],
    });

    let existingClientTransaction = null;

    if (user) {
      // Now query Transaction table with the numeric user ID
      existingClientTransaction = await Transaction.findOne({
        where: {
          userId: user.id.toString(),
          billingMonth: monthName,
          billingYear: billingYear,
          status: {
            [Op.in]: ["pending", "approved"],
          },
        },
      });
    }

    if (existingClientTransaction) {
      return res.status(409).json({
        success: false,
        message: `Client has already made a payment for ${monthName} ${billingYear} via self-payment.`,
        data: {
          existingTransaction: {
            id: existingClientTransaction.id,
            amount: existingClientTransaction.amount,
            status: existingClientTransaction.status,
            trxId: existingClientTransaction.trxId,
            billingMonth: existingClientTransaction.billingMonth,
            billingYear: existingClientTransaction.billingYear,
            createdAt: existingClientTransaction.createdAt,
          },
        },
      });
    }

    // Find employee
    const employee = await AuthorityInformation.findOne({
      where: { userId: employeeId },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Check if payment already exists for this client for same month and year
    // Use formattedBillingMonth for the check
    const existingPayment = await EmployeePayment.findOne({
      where: {
        clientId: clientUserId,
        billingMonth: formattedBillingMonth, // Use formatted version
        status: {
          [Op.notIn]: ["cancelled", "refunded", "rejected"],
        },
      },
    });

    if (existingPayment) {
      return res.status(409).json({
        success: false,
        message: `Payment already exists for ${formattedBillingMonth}.`,
        data: {
          existingPayment: {
            id: existingPayment.id,
            clientName: existingPayment.clientName,
            amount: existingPayment.amount,
            status: existingPayment.status,
            receiptNumber: existingPayment.receiptNumber,
            createdAt: existingPayment.createdAt,
          },
        },
      });
    }

    // Generate receipt number
    const receiptNumber = await generateReceiptNumber();

    // Create payment record
    const paymentData = {
      // Client Information
      clientId: clientUserId,
      clientName: client.fullName,
      clientPhone: client.mobileNo,
      clientAddress: `${client.flatAptNo}, ${client.houseNo}, ${client.roadNo}, ${client.area}`,

      // Employee Information
      employeeId: employee.userId,
      employeeName: employee.fullName,

      // Payment Information
      invoiceId: `INV-${formattedBillingMonth.replace(/\s+/g, "-")}-${
        client.customerId
      }`,
      billingMonth: formattedBillingMonth, // Store formatted version like "January 2025"
      billingYear: billingYear, // Store year separately
      amount: parseFloat(amount),

      // Payment Method
      paymentMethod: paymentMethod || "cash",
      transactionId: transactionId,
      referenceNote: referenceNote,

      // Collection Details
      collectionDate: new Date(),
      collectionTime: moment().format("HH:mm:ss"),

      // Receipt Information
      receiptNumber: receiptNumber,

      // Status
      status: "collected",

      // Metadata
      notes: notes,
      attachment: attachment,
    };

    const newPayment = await EmployeePayment.create(paymentData);

    res.status(201).json({
      success: true,
      message: "Payment collected successfully",
      data: newPayment,
      receipt: {
        number: receiptNumber,
        clientName: client.fullName,
        amount: amount,
        date: new Date(),
        collectedBy: employee.fullName,
        billingPeriod: formattedBillingMonth,
      },
    });
  } catch (error) {
    console.error("Error creating employee payment:", error);

    // Handle duplicate receipt number error
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Receipt number already exists",
        error: "Duplicate receipt number",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create payment",
      error: error.message,
    });
  }
};

//! 2. Get Payments by Employee
const getPaymentsByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const {
      page = 1,
      limit = 20,
      startDate,
      endDate,
      status,
      clientName,
      paymentMethod,
    } = req.query;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where clause
    let whereClause = { employeeId };

    // Date filter
    if (startDate || endDate) {
      whereClause.collectionDate = {};
      if (startDate) {
        whereClause.collectionDate[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereClause.collectionDate[Op.lte] = new Date(endDate);
      }
    }

    // Status filter
    if (status) {
      whereClause.status = status;
    }

    // Payment method filter
    if (paymentMethod) {
      whereClause.paymentMethod = paymentMethod;
    }

    // Client name search
    if (clientName) {
      whereClause.clientName = {
        [Op.like]: `%${clientName}%`,
      };
    }

    // Get total count
    const totalItems = await EmployeePayment.count({ where: whereClause });

    // Get paginated data
    const payments = await EmployeePayment.findAll({
      where: whereClause,
      limit: limitNumber,
      offset: offset,
      order: [["collectionDate", "DESC"]],
    });

    const totalPages = Math.ceil(totalItems / limitNumber);

    // Calculate totals
    const totalAmount =
      (await EmployeePayment.sum("amount", { where: whereClause })) || 0;

    res.status(200).json({
      success: true,
      message: "Payments retrieved successfully",
      data: payments,
      summary: {
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        totalCollections: totalItems,
      },
      pagination: {
        totalItems,
        totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error retrieving payments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve payments",
      error: error.message,
    });
  }
};

//! Add this to your controller file
const updateEmployeePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const updateData = req.body;

    console.log("Update request received:", { paymentId, updateData }); // Add logging

    const payment = await EmployeePayment.findByPk(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Check if payment can be edited (only collected or cancelled)
    if (payment.status !== "collected" && payment.status !== "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Only collected or cancelled payments can be edited",
      });
    }

    // Create a safe update object that excludes fields that shouldn't be changed
    const safeUpdateData = { ...updateData };
    
    // Remove fields that shouldn't be updated
    delete safeUpdateData.employeeId; // Don't change who collected it
    delete safeUpdateData.clientId; // Don't change who paid it
    delete safeUpdateData.clientUserId; // This is probably the same as clientId
    delete safeUpdateData.receiptNumber; // Don't change receipt number
    delete safeUpdateData.collectionDate; // Don't change collection date
    delete safeUpdateData.collectionTime; // Don't change collection time
    delete safeUpdateData.employeeName; // This depends on employeeId
    delete safeUpdateData.clientName; // This depends on clientId
    delete safeUpdateData.clientPhone; // This depends on clientId
    delete safeUpdateData.clientAddress; // This depends on clientId
    
    // Only allow updating these fields:
    // - billingMonth, amount, paymentMethod, transactionId, referenceNote, notes, attachment
    // - Also handle any client information updates if client changed (but that's complex)

    console.log("Safe update data:", safeUpdateData); // Add logging

    // Update payment with safe data
    await payment.update(safeUpdateData);

    const updatedPayment = await EmployeePayment.findByPk(paymentId);

    res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      data: updatedPayment,
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update payment",
      error: error.message,
    });
  }
};

//! 3. Get Payment Details
const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await EmployeePayment.findByPk(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment details retrieved",
      data: payment,
    });
  } catch (error) {
    console.error("Error retrieving payment details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve payment details",
      error: error.message,
    });
  }
};

//! 4. Get Today's Collections
const getTodaysCollections = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    const today = moment().startOf("day");
    const tomorrow = moment(today).add(1, "day");

    const todaysCollections = await EmployeePayment.findAll({
      where: {
        employeeId: employeeId,
        collectionDate: {
          [Op.gte]: today.toDate(),
          [Op.lt]: tomorrow.toDate(),
        },
      },
      order: [["collectionDate", "DESC"]],
    });

    const totalAmount =
      (await EmployeePayment.sum("amount", {
        where: {
          employeeId: employeeId,
          collectionDate: {
            [Op.gte]: today.toDate(),
            [Op.lt]: tomorrow.toDate(),
          },
        },
      })) || 0;

    res.status(200).json({
      success: true,
      message: "Today's collections retrieved",
      data: todaysCollections,
      summary: {
        totalCollections: todaysCollections.length,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Error retrieving today's collections:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve today's collections",
      error: error.message,
    });
  }
};

//! 5. Search Client for Payment
const searchClientForPayment = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search || search.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least 2 characters to search",
      });
    }

    const clients = await ClientInformation.findAll({
      where: {
        [Op.or]: [
          { customerId: { [Op.like]: `%${search}%` } },
          { userId: { [Op.like]: `%${search}%` } },
          { fullName: { [Op.like]: `%${search}%` } },
          { mobileNo: { [Op.like]: `%${search}%` } },
          { nidOrPassportNo: { [Op.like]: `%${search}%` } },
        ],
      },
      limit: 20, // Fixed: Reduced from 2,000,000 for performance
      attributes: [
        "userId",
        "customerId",
        "fullName",
        "id",
        "mobileNo",
        "email",
        "package", // This stores the package ID
        "costForPackage",
        "area",
        "flatAptNo",
        "houseNo",
        "roadNo",
      ],
    });

    const packageIds = [
      ...new Set(
        clients
          .map((client) => client.package)
          .filter((id) => id && !isNaN(id)) // Filter out non-numeric IDs
          .map((id) => parseInt(id)) // Convert string to number
      ),
    ];

    // Fetch all packages in one query
    let packages = [];
    let packageMap = {};

    if (packageIds.length > 0) {
      packages = await Package.findAll({
        where: { id: packageIds },
        attributes: [
          "id",
          "packageName",
          "packageBandwidth",
          "packagePrice",
          "duration",
        ],
      });

      // Create lookup map: packageId -> package details
      packages.forEach((pkg) => {
        packageMap[pkg.id] = {
          name: pkg.packageName,
          bandwidth: pkg.packageBandwidth,
          price: pkg.packagePrice,
          duration: pkg.duration,
        };
      });

      console.log(
        "Packages fetched:",
        packages.map((p) => ({ id: p.id, name: p.packageName }))
      );
    }

    // Transform clients with package names
    const transformedClients = clients.map((client) => {
      const clientData = client.toJSON();
      const packageId = parseInt(clientData.package);

      return {
        userId: clientData.userId,
        customerId: clientData.customerId,
        fullName: clientData.fullName,
        mobileNo: clientData.mobileNo,
        email: clientData.email,
        package: packageMap[packageId]
          ? packageMap[packageId].name
          : clientData.package, // Use name if found, otherwise original value
        packageDetails: packageMap[packageId] || null,
        packageId: clientData.package, // Keep original ID
        costForPackage: clientData.costForPackage,
        area: clientData.area,
        flatAptNo: clientData.flatAptNo,
        houseNo: clientData.houseNo,
        roadNo: clientData.roadNo,
      };
    });

    res.status(200).json({
      success: true,
      message: "Clients found",
      data: transformedClients,
    });
  } catch (error) {
    console.error("Error searching clients:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search clients",
      error: error.message,
    });
  }
};

//! 6. Get Client Payment History
const getClientPaymentHistory = async (req, res) => {
  try {
    const { clientUserId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    // Verify client exists
    const client = await ClientInformation.findOne({
      where: { userId: clientUserId },
      attributes: ["userId", "customerId", "fullName", "mobileNo"],
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Get payment history
    const whereClause = { clientId: clientUserId };

    const totalItems = await EmployeePayment.count({ where: whereClause });

    const payments = await EmployeePayment.findAll({
      where: whereClause,
      limit: limitNumber,
      offset: offset,
      order: [["collectionDate", "DESC"]],
    });

    const totalPages = Math.ceil(totalItems / limitNumber);
    const totalPaid =
      (await EmployeePayment.sum("amount", { where: whereClause })) || 0;

    res.status(200).json({
      success: true,
      message: "Client payment history retrieved",
      client: client,
      data: payments,
      summary: {
        totalPayments: totalItems,
        totalAmountPaid: parseFloat(totalPaid.toFixed(2)),
        lastPayment: payments.length > 0 ? payments[0].collectionDate : null,
      },
      pagination: {
        totalItems,
        totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error retrieving client payment history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve payment history",
      error: error.message,
    });
  }
};

//! 7. Admin: Get All Employee Collections
const getAllEmployeeCollections = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      startDate,
      endDate,
      employeeId,
      status,
      paymentMethod,
    } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where clause
    let whereClause = {};

    // Date filter
    if (startDate || endDate) {
      whereClause.collectionDate = {};
      if (startDate) {
        whereClause.collectionDate[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereClause.collectionDate[Op.lte] = new Date(endDate);
      }
    }

    // Employee filter
    if (employeeId) {
      whereClause.employeeId = employeeId;
    }

    // Status filter
    if (status) {
      whereClause.status = status;
    }

    // Payment method filter
    if (paymentMethod) {
      whereClause.paymentMethod = paymentMethod;
    }

    // Get total count
    const totalItems = await EmployeePayment.count({ where: whereClause });

    // Get paginated data WITHOUT include (since no association)
    const payments = await EmployeePayment.findAll({
      where: whereClause,
      limit: limitNumber,
      offset: offset,
      order: [["collectionDate", "DESC"]],
    });

    // Extract all unique client user IDs
    const clientUserIds = [
      ...new Set(
        payments.map((payment) => payment.clientId).filter((id) => id)
      ),
    ];

    // Fetch client information in one batch query
    let clientMap = {};
    if (clientUserIds.length > 0) {
      const clients = await ClientInformation.findAll({
        where: { userId: clientUserIds },
        attributes: ["id", "userId"], // Only get id and userId
      });

      // Create lookup map: userId -> id
      clients.forEach((client) => {
        clientMap[client.userId] = client.id;
      });
    }

    // Transform payments to add client ID
    const transformedPayments = payments.map((payment) => {
      const paymentData = payment.toJSON();

      return {
        ...paymentData,
        clientDatabaseId: clientMap[paymentData.clientId] || null,
      };
    });

    const totalPages = Math.ceil(totalItems / limitNumber);

    // Calculate summary statistics
    const totalAmount =
      (await EmployeePayment.sum("amount", { where: whereClause })) || 0;

    // Group by employee
    const employeeStats = await EmployeePayment.findAll({
      where: whereClause,
      attributes: [
        "employeeId",
        "employeeName",
        [sequelize.fn("COUNT", sequelize.col("id")), "collectionCount"],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
      ],
      group: ["employeeId", "employeeName"],
    });

    res.status(200).json({
      success: true,
      message: "All employee collections retrieved",
      data: transformedPayments,
      statistics: {
        totalCollections: totalItems,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        employeeStats: employeeStats,
      },
      pagination: {
        totalItems,
        totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error retrieving all collections:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve collections",
      error: error.message,
    });
  }
};

//! 8. Verify Payment (Admin/Supervisor)
const verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status, verificationRemark, verifiedBy } = req.body;

    if (!verifiedBy) {
      return res.status(400).json({
        success: false,
        message: "verifiedBy field is required",
      });
    }

    const payment = await EmployeePayment.findByPk(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Check if already verified
    if (payment.status === "verified" || payment.status === "deposited") {
      return res.status(400).json({
        success: false,
        message: `Payment already ${payment.status}`,
      });
    }

    const updateData = {
      status: status || "verified",
      verifiedBy: verifiedBy,
      verifiedAt: new Date(),
      verificationRemark: verificationRemark,
    };

    await payment.update(updateData);

    const updatedPayment = await EmployeePayment.findByPk(paymentId);

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: updatedPayment,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: error.message,
    });
  }
};

//! 9. Mark as Deposited (Finance)
const markAsDeposited = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { depositSlipNumber, depositedBy } = req.body;

    if (!depositedBy) {
      return res.status(400).json({
        success: false,
        message: "depositedBy field is required",
      });
    }

    const payment = await EmployeePayment.findByPk(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Check if payment is verified
    if (payment.status !== "verified") {
      return res.status(400).json({
        success: false,
        message: "Payment must be verified before marking as deposited",
      });
    }

    const updateData = {
      status: "deposited",
      depositedBy: depositedBy,
      depositedAt: new Date(),
      depositSlipNumber: depositSlipNumber,
    };

    await payment.update(updateData);

    res.status(200).json({
      success: true,
      message: "Payment marked as deposited",
      data: payment,
    });
  } catch (error) {
    console.error("Error marking payment as deposited:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark payment as deposited",
      error: error.message,
    });
  }
};

//! 10. Get Employee Collection Stats
const getEmployeeCollectionStats = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    // Today's stats
    const todayStart = moment().startOf("day");
    const todayEnd = moment().endOf("day");

    const todayStats = await EmployeePayment.findAll({
      where: {
        employeeId: employeeId,
        collectionDate: {
          [Op.between]: [todayStart.toDate(), todayEnd.toDate()],
        },
      },
      attributes: [
        "paymentMethod",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("amount")), "total"],
      ],
      group: ["paymentMethod"],
    });

    // This month's stats
    const monthStart = moment().startOf("month");
    const monthEnd = moment().endOf("month");

    const monthStats = await EmployeePayment.findAll({
      where: {
        employeeId: employeeId,
        collectionDate: {
          [Op.between]: [monthStart.toDate(), monthEnd.toDate()],
        },
      },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "totalCollections"],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
        [sequelize.fn("AVG", sequelize.col("amount")), "averageAmount"],
      ],
    });

    // Weekly trend (last 7 days)
    const weekStart = moment().subtract(7, "days").startOf("day");

    const weeklyTrend = await EmployeePayment.findAll({
      where: {
        employeeId: employeeId,
        collectionDate: {
          [Op.gte]: weekStart.toDate(),
        },
      },
      attributes: [
        [sequelize.fn("DATE", sequelize.col("collectionDate")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("amount")), "total"],
      ],
      group: [sequelize.fn("DATE", sequelize.col("collectionDate"))],
      order: [[sequelize.fn("DATE", sequelize.col("collectionDate")), "ASC"]],
    });

    res.status(200).json({
      success: true,
      message: "Employee collection statistics",
      data: {
        today: todayStats,
        thisMonth: monthStats[0] || {},
        weeklyTrend: weeklyTrend,
        summary: {
          todayTotal: todayStats.reduce(
            (sum, item) => sum + parseFloat(item.dataValues.total || 0),
            0
          ),
          monthTotal: monthStats[0]?.dataValues?.totalAmount || 0,
          totalCollections: monthStats[0]?.dataValues?.totalCollections || 0,
        },
      },
    });
  } catch (error) {
    console.error("Error getting collection stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get collection statistics",
      error: error.message,
    });
  }
};

//! For super admin
// 12. Get All Employee Collection Stats (Super Admin)
const getAllEmployeeCollectionStats = async (req, res) => {
  try {
    const { startDate, endDate, employeeId } = req.query;

    // Build where clause
    let whereClause = {};

    // Date filter
    if (startDate || endDate) {
      whereClause.collectionDate = {};
      if (startDate) {
        whereClause.collectionDate[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereClause.collectionDate[Op.lte] = new Date(endDate);
      }
    }

    // Employee filter (optional)
    if (employeeId) {
      whereClause.employeeId = employeeId;
    }

    // Today's stats
    const todayStart = moment().startOf("day");
    const todayEnd = moment().endOf("day");

    const todayWhereClause = {
      ...whereClause,
      collectionDate: {
        [Op.between]: [todayStart.toDate(), todayEnd.toDate()],
      },
    };

    const todayStats = await EmployeePayment.findAll({
      where: todayWhereClause,
      attributes: [
        "paymentMethod",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("amount")), "total"],
      ],
      group: ["paymentMethod"],
    });

    // This month's stats
    const monthStart = moment().startOf("month");
    const monthEnd = moment().endOf("month");

    const monthWhereClause = {
      ...whereClause,
      collectionDate: {
        [Op.between]: [monthStart.toDate(), monthEnd.toDate()],
      },
    };

    const monthStats = await EmployeePayment.findAll({
      where: monthWhereClause,
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "totalCollections"],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
        [sequelize.fn("AVG", sequelize.col("amount")), "averageAmount"],
      ],
    });

    // This year's stats
    const yearStart = moment().startOf("year");
    const yearEnd = moment().endOf("year");

    const yearWhereClause = {
      ...whereClause,
      collectionDate: {
        [Op.between]: [yearStart.toDate(), yearEnd.toDate()],
      },
    };

    const yearStats = await EmployeePayment.findAll({
      where: yearWhereClause,
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "totalCollections"],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
      ],
    });

    // Weekly trend (last 30 days for better analysis)
    const thirtyDaysAgo = moment().subtract(30, "days").startOf("day");

    const weeklyTrendWhereClause = {
      ...whereClause,
      collectionDate: {
        [Op.gte]: thirtyDaysAgo.toDate(),
      },
    };

    const weeklyTrend = await EmployeePayment.findAll({
      where: weeklyTrendWhereClause,
      attributes: [
        [sequelize.fn("DATE", sequelize.col("collectionDate")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("amount")), "total"],
      ],
      group: [sequelize.fn("DATE", sequelize.col("collectionDate"))],
      order: [[sequelize.fn("DATE", sequelize.col("collectionDate")), "ASC"]],
    });

    // Status breakdown
    const statusBreakdown = await EmployeePayment.findAll({
      where: whereClause,
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
      ],
      group: ["status"],
    });

    // Payment method breakdown
    const paymentMethodBreakdown = await EmployeePayment.findAll({
      where: whereClause,
      attributes: [
        "paymentMethod",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
        [sequelize.fn("AVG", sequelize.col("amount")), "averageAmount"],
      ],
      group: ["paymentMethod"],
    });

    // Employee performance ranking
    const employeePerformance = await EmployeePayment.findAll({
      where: whereClause,
      attributes: [
        "employeeId",
        "employeeName",
        [sequelize.fn("COUNT", sequelize.col("id")), "collectionCount"],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
        [sequelize.fn("AVG", sequelize.col("amount")), "averageAmount"],
      ],
      group: ["employeeId", "employeeName"],
      order: [[sequelize.fn("SUM", sequelize.col("amount")), "DESC"]],
      limit: 10, // Top 10 employees
    });

    // Top clients by payment amount
    const topClients = await EmployeePayment.findAll({
      where: whereClause,
      attributes: [
        "clientId",
        "clientName",
        [sequelize.fn("COUNT", sequelize.col("id")), "paymentCount"],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalPaid"],
        [sequelize.fn("AVG", sequelize.col("amount")), "averagePayment"],
      ],
      group: ["clientId", "clientName"],
      order: [[sequelize.fn("SUM", sequelize.col("amount")), "DESC"]],
      limit: 10, // Top 10 clients
    });

    // Monthly trend (last 12 months)
    const twelveMonthsAgo = moment().subtract(12, "months").startOf("month");

    const monthlyTrend = await EmployeePayment.findAll({
      where: {
        ...whereClause,
        collectionDate: {
          [Op.gte]: twelveMonthsAgo.toDate(),
        },
      },
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("collectionDate"), "%Y-%m"),
          "month",
        ],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("amount")), "total"],
      ],
      group: [
        sequelize.fn("DATE_FORMAT", sequelize.col("collectionDate"), "%Y-%m"),
      ],
      order: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("collectionDate"), "%Y-%m"),
          "ASC",
        ],
      ],
    });

    // Calculate summary
    const allTimeStats = await EmployeePayment.findAll({
      where: whereClause,
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "totalCollections"],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
        [sequelize.fn("MIN", sequelize.col("amount")), "minAmount"],
        [sequelize.fn("MAX", sequelize.col("amount")), "maxAmount"],
        [sequelize.fn("AVG", sequelize.col("amount")), "averageAmount"],
      ],
    });

    // Calculate today's total
    const todayTotal = todayStats.reduce(
      (sum, item) => sum + parseFloat(item.dataValues.total || 0),
      0
    );

    // Calculate month's total
    const monthTotal = monthStats[0]?.dataValues?.totalAmount || 0;
    const monthCollections = monthStats[0]?.dataValues?.totalCollections || 0;

    // Calculate year's total
    const yearTotal = yearStats[0]?.dataValues?.totalAmount || 0;
    const yearCollections = yearStats[0]?.dataValues?.totalCollections || 0;

    res.status(200).json({
      success: true,
      message: "All employee collection statistics retrieved",
      data: {
        timePeriods: {
          today: {
            total: parseFloat(todayTotal.toFixed(2)),
            collections: todayStats.reduce(
              (sum, item) => sum + parseInt(item.dataValues.count || 0),
              0
            ),
            breakdown: todayStats,
          },
          thisMonth: {
            total: parseFloat(monthTotal.toFixed(2)),
            collections: monthCollections,
            average: monthStats[0]?.dataValues?.averageAmount
              ? parseFloat(monthStats[0].dataValues.averageAmount.toFixed(2))
              : 0,
          },
          thisYear: {
            total: parseFloat(yearTotal.toFixed(2)),
            collections: yearCollections,
          },
          allTime: {
            total: parseFloat(
              (allTimeStats[0]?.dataValues?.totalAmount || 0).toFixed(2)
            ),
            collections: allTimeStats[0]?.dataValues?.totalCollections || 0,
            average: parseFloat(
              (allTimeStats[0]?.dataValues?.averageAmount || 0).toFixed(2)
            ),
            minAmount: parseFloat(
              (allTimeStats[0]?.dataValues?.minAmount || 0).toFixed(2)
            ),
            maxAmount: parseFloat(
              (allTimeStats[0]?.dataValues?.maxAmount || 0).toFixed(2)
            ),
          },
        },
        breakdowns: {
          status: statusBreakdown,
          paymentMethods: paymentMethodBreakdown,
        },
        trends: {
          daily: weeklyTrend, // Last 30 days
          monthly: monthlyTrend, // Last 12 months
        },
        rankings: {
          topEmployees: employeePerformance,
          topClients: topClients,
        },
        summary: {
          totalEmployees: employeePerformance.length,
          totalClients: topClients.length,
          todayTotal: parseFloat(todayTotal.toFixed(2)),
          monthTotal: parseFloat(monthTotal.toFixed(2)),
          yearTotal: parseFloat(yearTotal.toFixed(2)),
          allTimeTotal: parseFloat(
            (allTimeStats[0]?.dataValues?.totalAmount || 0).toFixed(2)
          ),
        },
      },
    });
  } catch (error) {
    console.error("Error getting all employee collection stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get collection statistics",
      error: error.message,
    });
  }
};

// 13. Get All Employee Performance Stats
const getAllEmployeePerformanceStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build where clause
    let whereClause = {};

    // Date filter
    if (startDate || endDate) {
      whereClause.collectionDate = {};
      if (startDate) {
        whereClause.collectionDate[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereClause.collectionDate[Op.lte] = new Date(endDate);
      }
    }

    // Get all employees with their performance stats
    const employeeStats = await EmployeePayment.findAll({
      where: whereClause,
      attributes: [
        "employeeId",
        "employeeName",
        [sequelize.fn("COUNT", sequelize.col("id")), "totalCollections"],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
        [sequelize.fn("AVG", sequelize.col("amount")), "averageAmount"],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal(
              `CASE WHEN status = 'verified' THEN amount ELSE 0 END`
            )
          ),
          "verifiedAmount",
        ],
        [
          sequelize.literal(`COUNT(CASE WHEN status = 'verified' THEN 1 END)`),
          "verifiedCount",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal(
              `CASE WHEN status = 'deposited' THEN amount ELSE 0 END`
            )
          ),
          "depositedAmount",
        ],
        [
          sequelize.literal(`COUNT(CASE WHEN status = 'deposited' THEN 1 END)`),
          "depositedCount",
        ],
      ],
      group: ["employeeId", "employeeName"],
      order: [[sequelize.fn("SUM", sequelize.col("amount")), "DESC"]],
    });

    // Get total statistics
    const totalStats = await EmployeePayment.findAll({
      where: whereClause,
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "totalCollections"],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
        [sequelize.fn("AVG", sequelize.col("amount")), "averageAmount"],
        [
          sequelize.literal(`COUNT(CASE WHEN status = 'collected' THEN 1 END)`),
          "collectedCount",
        ],
        [
          sequelize.literal(`COUNT(CASE WHEN status = 'verified' THEN 1 END)`),
          "verifiedCount",
        ],
        [
          sequelize.literal(`COUNT(CASE WHEN status = 'deposited' THEN 1 END)`),
          "depositedCount",
        ],
        [
          sequelize.literal(`COUNT(CASE WHEN status = 'cancelled' THEN 1 END)`),
          "cancelledCount",
        ],
      ],
    });

    // Get payment method breakdown
    const paymentMethodStats = await EmployeePayment.findAll({
      where: whereClause,
      attributes: [
        "paymentMethod",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
        [sequelize.fn("AVG", sequelize.col("amount")), "averageAmount"],
      ],
      group: ["paymentMethod"],
    });

    // Get daily collections for last 30 days
    const thirtyDaysAgo = moment().subtract(30, "days").startOf("day");
    const dailyTrendWhereClause = {
      ...whereClause,
      collectionDate: {
        [Op.gte]: thirtyDaysAgo.toDate(),
      },
    };

    const dailyTrend = await EmployeePayment.findAll({
      where: dailyTrendWhereClause,
      attributes: [
        [sequelize.fn("DATE", sequelize.col("collectionDate")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "collections"],
        [sequelize.fn("SUM", sequelize.col("amount")), "amount"],
        [
          sequelize.literal(`COUNT(CASE WHEN status = 'verified' THEN 1 END)`),
          "verifiedCollections",
        ],
        [
          sequelize.literal(
            `SUM(CASE WHEN status = 'verified' THEN amount ELSE 0 END)`
          ),
          "verifiedAmount",
        ],
      ],
      group: [sequelize.fn("DATE", sequelize.col("collectionDate"))],
      order: [[sequelize.fn("DATE", sequelize.col("collectionDate")), "ASC"]],
    });

    // Calculate efficiency metrics
    const efficiencyMetrics = {
      totalEmployees: employeeStats.length,
      totalAmountCollected: parseFloat(
        (totalStats[0]?.dataValues?.totalAmount || 0).toFixed(2)
      ),
      averagePerEmployee:
        employeeStats.length > 0
          ? parseFloat(
              (
                (totalStats[0]?.dataValues?.totalAmount || 0) /
                employeeStats.length
              ).toFixed(2)
            )
          : 0,
      verificationRate:
        totalStats[0]?.dataValues?.totalCollections > 0
          ? parseFloat(
              (
                ((totalStats[0]?.dataValues?.verifiedCount || 0) /
                  totalStats[0]?.dataValues?.totalCollections) *
                100
              ).toFixed(2)
            )
          : 0,
      depositRate:
        totalStats[0]?.dataValues?.totalCollections > 0
          ? parseFloat(
              (
                ((totalStats[0]?.dataValues?.depositedCount || 0) /
                  totalStats[0]?.dataValues?.totalCollections) *
                100
              ).toFixed(2)
            )
          : 0,
    };

    res.status(200).json({
      success: true,
      message: "Employee performance statistics retrieved",
      data: {
        employeePerformance: employeeStats,
        summary: totalStats[0] || {},
        paymentMethods: paymentMethodStats,
        trends: {
          daily: dailyTrend,
        },
        efficiency: efficiencyMetrics,
        totals: {
          employees: employeeStats.length,
          collections: totalStats[0]?.dataValues?.totalCollections || 0,
          amount: parseFloat(
            (totalStats[0]?.dataValues?.totalAmount || 0).toFixed(2)
          ),
        },
      },
    });
  } catch (error) {
    console.error("Error getting employee performance stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get performance statistics",
      error: error.message,
    });
  }
};

const deleteCollectedBillBySuperAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const billToDelete = await EmployeePayment.findByPk(id);

    if (!billToDelete) {
      return res.status(404).json({
        success: false,
        message: "Bill not found!",
      });
    }

    await billToDelete.destroy();

    return res.status(200).json({
      success: true,
      message: "Bill deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEmployeePayment,
  getPaymentsByEmployee,
  getPaymentDetails,
  getTodaysCollections,
  searchClientForPayment,
  getClientPaymentHistory,
  getAllEmployeeCollections,
  verifyPayment,
  markAsDeposited,
  getEmployeeCollectionStats,
  getAllEmployeePerformanceStats,
  getAllEmployeeCollectionStats,
  updateEmployeePayment,
  deleteCollectedBillBySuperAdmin,
};
