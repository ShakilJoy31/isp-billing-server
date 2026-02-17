const { Op } = require("sequelize");
const AuthorityInformation = require("../../models/Authentication/authority.model");
const ClientInformation = require("../../models/Authentication/client.model");
const generateUniqueUserId = require("../../utils/helper/generateUniqueId");
const Package = require("../../models/package/package.model");
const sequelize = require("../../database/connection");
const ExpenseCategory = require("../../models/expense/category.model");
const ExpenseSubCategory = require("../../models/expense/sub-category.model");
const { ExpensePayment, Expense } = require("../../models/expense/expense.model");
const BankAccount = require("../../models/account/account.model");
const { sendSMSHelper } = require("../../utils/helper/sendSMS");

//! Helper function to get package details
const getPackageDetails = async (packageId) => {
  try {
    const package = await Package.findOne({
      where: { id: packageId },
      attributes: [
        "id",
        "packageName",
        "packageBandwidth",
        "packagePrice",
        "packageDetails",
        "duration",
        "status",
      ],
    });
    return package ? package.toJSON() : null;
  } catch (error) {
    console.error("Error fetching package details:", error);
    return null;
  }
};

//! Helper function to transform client with package details
const transformClientWithPackage = async (client) => {
  const clientData = client.toJSON ? client.toJSON() : client;

  // Get package details
  const packageDetails = await getPackageDetails(clientData.package);

  if (packageDetails) {
    clientData.package = packageDetails.packageName; // Replace ID with name
    clientData.packageId = clientData.package; // Store original ID
    clientData.packageDetails = packageDetails; // Add full package details
  }

  return clientData;
};

//! Create new client
const createClient = async (req, res, next) => {
  try {
    const {
      fullName,
      fatherOrSpouseName,
      dateOfBirth,
      age,
      sex,
      maritalStatus,
      nidOrPassportNo,
      nidPhoto,
      jobPlaceName,
      jobCategory,
      customerId,
      jobType,
      mobileNo,
      userAddedBy,
      email,
      customerType,
      package,
      location,
      area,
      flatAptNo,
      houseNo,
      isFreeClient,
      roadNo,
      landmark,
      connectionDetails,
      costForPackage,
      referId,
      photo,
      password,
      status,
      role,
      routerLoginId,
      routerLoginPassword,
    } = req.body;

    // Validate required fields
    if (!fullName || !mobileNo || !email || !nidOrPassportNo) {
      return res.status(400).json({
        message:
          "Full name, mobile number, email, and NID/Passport number are required!",
      });
    }

    // Check if email already exists
    const emailExists = await ClientInformation.findOne({ where: { email } });
    if (emailExists) {
      return res.status(409).json({
        message: "This email already exists!",
      });
    }

    // Check if NID already exists
    const nidExists = await ClientInformation.findOne({
      where: { nidOrPassportNo },
    });
    if (nidExists) {
      return res.status(409).json({
        message: "This NID/Passport number already exists!",
      });
    }

    // Check if mobile already exists
    const mobileExists = await ClientInformation.findOne({
      where: { mobileNo },
    });
    if (mobileExists) {
      return res.status(409).json({
        message: "This mobile number already exists!",
      });
    }

    // Parse NID photo data
    let nidPhotoData = {
      frontSide: "",
      backSide: "",
    };

    if (nidPhoto) {
      if (typeof nidPhoto === "string") {
        try {
          nidPhotoData = JSON.parse(nidPhoto);
        } catch (error) {
          console.log("Error parsing nidPhoto string:", error);
        }
      } else if (typeof nidPhoto === "object") {
        nidPhotoData = nidPhoto;
      }
    }

    // Generate unique IDs
    const userId = await generateUniqueUserId(fullName);
    
    // Set default password if not provided
    const clientPassword = password || mobileNo;

    const newClient = await ClientInformation.create({
      customerId,
      userId,
      fullName,
      photo: photo || null,
      fatherOrSpouseName,
      dateOfBirth: dateOfBirth || null,
      age: parseInt(age),
      sex,
      maritalStatus,
      nidOrPassportNo,
      nidPhotoFrontSide: nidPhotoData.frontSide || "",
      nidPhotoBackSide: nidPhotoData.backSide || "",
      jobPlaceName: jobPlaceName || null,
      jobCategory: jobCategory || null,
      jobType,
      mobileNo,
      email,
      customerType,
      package,
      location,
      userAddedBy,
      area,
      flatAptNo,
      isFreeClient: isFreeClient || false,
      houseNo,
      roadNo,
      landmark,
      connectionDetails: connectionDetails || null,
      costForPackage: parseInt(costForPackage) || 0,
      referId: referId || null,
      role: role || "client",
      status: status || "pending",
      password: clientPassword,
      routerLoginId: routerLoginId || null,
      routerLoginPassword: routerLoginPassword || null,
    });

    // Transform response with package details
    const clientData = await transformClientWithPackage(newClient);

    // Get package information for SMS
    let packageCost = costForPackage || 0;

    const packageInfo = await Package.findOne({
      where: { id: package },
    });

    // Send welcome SMS to the new client
    await sendSMSHelper(
      "Account Creation",
      mobileNo,
      newClient.id,
      null, // Use default message from database
      {
        fullName: fullName,
        userId: userId,
        password: clientPassword,
        packageName: packageInfo.packageName,
        routerLoginId: client.routerLoginId,
        billAmount: packageCost.toString(),
        mobileNo: mobileNo,
        email: email,
        status: status || "pending"
      }
    );

     //! Send admin copy
    await sendSMSHelper(
      "Account Creation",
      '+8801684175551',
      newClient.id,
      null, // Use default message from database
      {
        fullName: fullName,
        userId: userId,
        packageName: packageInfo.packageName,
        password: clientPassword,
        routerLoginId: client.routerLoginId,
        billAmount: packageCost.toString(),
        mobileNo: mobileNo,
        email: email,
        status: status || "pending"
      }
    );

    return res.status(201).json({
      message: "Client created successfully!",
      data: {
        ...clientData,
        nidPhoto: {
          frontSide: newClient.nidPhotoFrontSide,
          backSide: newClient.nidPhotoBackSide,
        },
      },
    });
  } catch (error) {
    console.error("Error creating client:", error);
    next(error);
  }
};

//! Get all clients with pagination, filtering, and expense information
const getAllClients = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      customerType = "",
      location = "",
      package = "",
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const whereClause = {
      role: "client",
    };

    if (search) {
      whereClause[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { customerId: { [Op.like]: `%${search}%` } },
        { userId: { [Op.like]: `%${search}%` } },
        { mobileNo: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { nidOrPassportNo: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status) whereClause.status = status;
    if (customerType) whereClause.customerType = customerType;
    if (location) whereClause.location = location;
    if (package) whereClause.package = package;

    // First, get the clients without expense associations
    const { count, rows: clients } = await ClientInformation.findAndCountAll({
      where: whereClause,
      limit: limitNumber,
      offset: offset,
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["password"] },
    });

    // Transform each client with package details
    const transformedClients = await Promise.all(
      clients.map(async (client) => {
        const transformedClient = await transformClientWithPackage(client);
        
        // Now get expenses for this client separately
        const clientExpenses = await Expense.findAll({
          where: {
            clientId: client.id,
            isClientExpense: true
          },
          attributes: ['id', 'expenseCode', 'totalAmount', 'date', 'status', 'paymentStatus', 'note'],
          order: [['date', 'DESC']],
          limit: 5,
          include: [
            {
              model: ExpenseCategory,
              as: 'category',
              attributes: ['id', 'categoryName', 'categoryCode']
            },
            {
              model: ExpenseSubCategory,
              as: 'subcategory',
              attributes: ['id', 'subCategoryName', 'subCategoryCode']
            },
            {
              model: ExpensePayment,
              as: 'payments',
              attributes: ['id', 'paymentAmount', 'status'],
              include: [
                {
                  model: BankAccount,
                  as: 'account',
                  attributes: ['id', 'accountName', 'bankName']
                }
              ]
            }
          ]
        });
        
        // Calculate expense statistics
        const totalExpenseAmount = clientExpenses.reduce((sum, expense) => 
          sum + parseFloat(expense.totalAmount || 0), 0
        );
        
        // Count expenses by status
        const expenseStats = {
          total: clientExpenses.length,
          pending: clientExpenses.filter(e => e.status === 'Pending').length,
          approved: clientExpenses.filter(e => e.status === 'Approved').length,
          paid: clientExpenses.filter(e => e.paymentStatus === 'Paid').length,
          partiallyPaid: clientExpenses.filter(e => e.paymentStatus === 'Partially_Paid').length,
          rejected: clientExpenses.filter(e => e.status === 'Rejected').length,
          totalAmount: totalExpenseAmount
        };

        // Get latest expense
        const latestExpense = clientExpenses.length > 0 ? clientExpenses[0] : null;

        // Format expenses for response
        const formattedExpenses = clientExpenses.map(expense => ({
          id: expense.id,
          expenseCode: expense.expenseCode,
          totalAmount: expense.totalAmount,
          date: expense.date,
          status: expense.status,
          paymentStatus: expense.paymentStatus,
          note: expense.note,
          category: expense.category ? {
            id: expense.category.id,
            name: expense.category.categoryName,
            code: expense.category.categoryCode
          } : null,
          subcategory: expense.subcategory ? {
            id: expense.subcategory.id,
            name: expense.subcategory.subCategoryName,
            code: expense.subcategory.subCategoryCode
          } : null,
          payments: expense.payments ? expense.payments.map(payment => ({
            id: payment.id,
            amount: payment.paymentAmount,
            status: payment.status,
            account: payment.account ? {
              id: payment.account.id,
              name: payment.account.accountName,
              bank: payment.account.bankName
            } : null
          })) : []
        }));

        return {
          ...transformedClient,
          expenses: {
            stats: expenseStats,
            list: formattedExpenses,
            latest: latestExpense ? {
              id: latestExpense.id,
              expenseCode: latestExpense.expenseCode,
              amount: latestExpense.totalAmount,
              date: latestExpense.date,
              status: latestExpense.status
            } : null
          }
        };
      }),
    );

    // Add nidPhoto to transformed clients
    const clientsWithNidPhotos = transformedClients.map((client) => ({
      ...client,
      nidPhoto: {
        frontSide: client.nidPhotoFrontSide || "",
        backSide: client.nidPhotoBackSide || "",
      },
    }));

    const totalPages = Math.ceil(count / limitNumber);

    return res.status(200).json({
      message: "Clients retrieved successfully with expense information!",
      data: clientsWithNidPhotos,
      pagination: {
        totalItems: count,
        totalPages: totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error getting all clients with expense info:", error);
    next(error);
  }
};

//! Get client by ID
const getClientById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const client = await ClientInformation.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found!",
      });
    }

    // Transform response
    const clientData = await transformClientWithPackage(client);

    return res.status(200).json({
      message: "Client retrieved successfully!",
      data: {
        ...clientData,
        nidPhoto: {
          frontSide: client.nidPhotoFrontSide || "",
          backSide: client.nidPhotoBackSide || "",
        },
      },
    });
  } catch (error) {
    console.error("Error getting client by ID:", error);
    next(error);
  }
};

//! Update client
const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      fatherOrSpouseName,
      dateOfBirth,
      customerId,
      age,
      sex,
      maritalStatus,
      nidOrPassportNo,
      nidPhoto, // New field for NID photos
      jobPlaceName,
      jobCategory,
      jobType,
      isFreeClient,
      userAddedBy,
      mobileNo,
      email,
      customerType,
      package, // This should be package ID
      location,
      area,
      flatAptNo,
      houseNo,
      roadNo,
      landmark,
      connectionDetails,
      costForPackage,
      referId,
      photo,
      status,
      password,
      routerLoginId,
      routerLoginPassword,
    } = req.body;

    // Check if client exists
    const existingClient = await ClientInformation.findOne({ where: { id } });
    if (!existingClient) {
      return res.status(404).json({
        message: "Client not found!",
      });
    }

    // Check if new email already exists (if changed)
    if (email && email !== existingClient.email) {
      const emailExists = await ClientInformation.findOne({ where: { email } });
      if (emailExists) {
        return res.status(409).json({
          message: "This email already exists!",
        });
      }
    }

    // Check if new NID already exists (if changed)
    if (nidOrPassportNo && nidOrPassportNo !== existingClient.nidOrPassportNo) {
      const nidExists = await ClientInformation.findOne({
        where: { nidOrPassportNo },
      });
      if (nidExists) {
        return res.status(409).json({
          message: "This NID/Passport number already exists!",
        });
      }
    }

    // Check if new mobile already exists (if changed)
    if (mobileNo && mobileNo !== existingClient.mobileNo) {
      const mobileExists = await ClientInformation.findOne({
        where: { mobileNo },
      });
      if (mobileExists) {
        return res.status(409).json({
          message: "This mobile number already exists!",
        });
      }
    }

    // Parse NID photo data
    let nidPhotoData = {
      frontSide: existingClient.nidPhotoFrontSide || "",
      backSide: existingClient.nidPhotoBackSide || "",
    };

    if (nidPhoto) {
      if (typeof nidPhoto === "string") {
        try {
          nidPhotoData = JSON.parse(nidPhoto);
        } catch (error) {
          console.log("Error parsing nidPhoto string:", error);
        }
      } else if (typeof nidPhoto === "object") {
        nidPhotoData = nidPhoto;
      }
    }

    // Update client data
    const updateData = {
      fullName: fullName || existingClient.fullName,
      fatherOrSpouseName:
        fatherOrSpouseName || existingClient.fatherOrSpouseName,
      dateOfBirth: dateOfBirth || existingClient.dateOfBirth,
      age: parseInt(age) || existingClient.age,
      sex: sex || existingClient.sex,
      maritalStatus: maritalStatus || existingClient.maritalStatus,
      nidOrPassportNo: nidOrPassportNo || existingClient.nidOrPassportNo,
      nidPhotoFrontSide: nidPhotoData.frontSide || "" || "",
      nidPhotoBackSide: nidPhotoData.backSide || "" || "",
      jobPlaceName: jobPlaceName || existingClient.jobPlaceName,
      jobCategory: jobCategory || existingClient.jobCategory,
      jobType: jobType || existingClient.jobType,
      isFreeClient:
        isFreeClient !== undefined ? isFreeClient : existingClient.isFreeClient,
      userAddedBy: userAddedBy || existingClient.userAddedBy,
      mobileNo: mobileNo || existingClient.mobileNo,
      customerId: customerId || existingClient.customerId,
      email: email || existingClient.email,
      customerType: customerType || existingClient.customerType,
      package: package || existingClient.package, // Store the package ID
      location: location || existingClient.location,
      area: area || existingClient.area,
      flatAptNo: flatAptNo || existingClient.flatAptNo,
      houseNo: houseNo || existingClient.houseNo,
      roadNo: roadNo || existingClient.roadNo,
      landmark: landmark || existingClient.landmark,
      connectionDetails: connectionDetails || existingClient.connectionDetails,
      costForPackage: parseInt(costForPackage) || existingClient.costForPackage,
      referId: referId || existingClient.referId,
      photo: photo || existingClient.photo,
      status: status || existingClient.status,
      routerLoginId: routerLoginId || existingClient.routerLoginId,
      routerLoginPassword:
        routerLoginPassword || existingClient.routerLoginPassword,
    };

    // Update password if provided
    if (password) {
      updateData.password = password;
    }

    await ClientInformation.update(updateData, {
      where: { id },
    });

    // Fetch updated client
    const updatedClient = await ClientInformation.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    // Transform response
    const clientData = await transformClientWithPackage(updatedClient);

    return res.status(200).json({
      message: "Client updated successfully!",
      data: {
        ...clientData,
        nidPhoto: {
          frontSide: updatedClient.nidPhotoFrontSide || "",
          backSide: updatedClient.nidPhotoBackSide || "",
        },
      },
    });
  } catch (error) {
    console.error("Error updating client:", error);
    next(error);
  }
};

//! Delete client
const deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingClient = await ClientInformation.findOne({ where: { id } });

    if (!existingClient) {
      return res.status(404).json({
        message: "Client not found!",
      });
    }

    await ClientInformation.destroy({ where: { id } });

    return res.status(200).json({
      message: "Client deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting client:", error);
    next(error);
  }
};

//! Get clients by refer ID
const getClientsByReferCode = async (req, res, next) => {
  try {
    const { referId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const { count, rows: clients } = await ClientInformation.findAndCountAll({
      where: { referId },
      limit: limitNumber,
      offset: offset,
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["password"] },
    });

    if (clients.length === 0) {
      return res.status(404).json({
        message: "No clients found with this refer ID",
      });
    }

    // Transform response
    const transformedClients = await Promise.all(
      clients.map((client) => transformClientWithPackage(client)),
    );

    // Add nidPhoto to transformed clients
    const clientsWithNidPhotos = transformedClients.map((client) => ({
      ...client,
      nidPhoto: {
        frontSide: client.nidPhotoFrontSide || "",
        backSide: client.nidPhotoBackSide || "",
      },
    }));

    const totalPages = Math.ceil(count / limitNumber);

    return res.status(200).json({
      message: "Clients retrieved successfully!",
      data: clientsWithNidPhotos,
      pagination: {
        totalItems: count,
        totalPages: totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error getting clients by refer code:", error);
    next(error);
  }
};

//! Update client status (approve/reject)
const updateClientStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const client = await ClientInformation.findOne({ where: { id } });
    if (!client) {
      return res.status(404).json({
        message: "Client not found!",
      });
    }

    await ClientInformation.update({ status }, { where: { id } });

    // Fetch updated client
    const updatedClient = await ClientInformation.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    // Transform response
    const clientData = await transformClientWithPackage(updatedClient);

    return res.status(200).json({
      message: `Client ${status} successfully!`,
      data: {
        ...clientData,
        nidPhoto: {
          frontSide: updatedClient.nidPhotoFrontSide || "",
          backSide: updatedClient.nidPhotoBackSide || "",
        },
      },
    });
  } catch (error) {
    console.error("Error updating client status:", error);
    next(error);
  }
};

//! Get client statistics
const getClientStats = async (req, res, next) => {
  try {
    const totalClients = await ClientInformation.count();
    const activeClients = await ClientInformation.count({
      where: { status: "active" },
    });
    const pendingClients = await ClientInformation.count({
      where: { status: "pending" },
    });
    const inactiveClients = await ClientInformation.count({
      where: { status: "inactive" },
    });

    // Count by customer type
    const customerTypes = await ClientInformation.findAll({
      attributes: [
        "customerType",
        [sequelize.fn("COUNT", sequelize.col("customerType")), "count"],
      ],
      group: ["customerType"],
    });

    // Count by package
    const packageCounts = await ClientInformation.findAll({
      attributes: [
        "package",
        [sequelize.fn("COUNT", sequelize.col("package")), "count"],
      ],
      group: ["package"],
      raw: true,
    });

    // Get package details for each package ID
    const packagesWithDetails = await Promise.all(
      packageCounts.map(async (pkg) => {
        const packageDetails = await Package.findOne({
          where: { id: pkg.package },
          attributes: ["packageName", "packageBandwidth", "packagePrice"],
        });

        return {
          packageId: pkg.package,
          packageName: packageDetails ? packageDetails.packageName : "Unknown",
          packageBandwidth: packageDetails
            ? packageDetails.packageBandwidth
            : null,
          packagePrice: packageDetails ? packageDetails.packagePrice : null,
          count: pkg.count,
        };
      }),
    );

    // Count by location
    const locations = await ClientInformation.findAll({
      attributes: [
        "location",
        [sequelize.fn("COUNT", sequelize.col("location")), "count"],
      ],
      group: ["location"],
    });

    return res.status(200).json({
      message: "Client statistics retrieved successfully!",
      data: {
        totalClients,
        activeClients,
        pendingClients,
        inactiveClients,
        customerTypes,
        packages: packagesWithDetails,
        locations,
      },
    });
  } catch (error) {
    next(error);
  }
};

//!___________________________________________________________________________________________________________________________________________________________________________________
//! Helper function to generate unique employee ID
const generateUniqueEmployeeId = async (fullName) => {
  try {
    // Extract first name (first word from full name)
    const firstName = fullName.trim().split(" ")[0].toLowerCase();

    // Generate a 4-digit random number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    let userId = `${firstName}${randomNum}@ringtel`;

    // Check if userId already exists
    let existingEmployee = await AuthorityInformation.findOne({
      where: { userId },
    });

    // If exists, generate new one with different random number
    let counter = 1;
    while (existingEmployee) {
      const newRandomNum = Math.floor(1000 + Math.random() * 9000);
      userId = `${firstName}${newRandomNum}@ringtel`;
      existingEmployee = await AuthorityInformation.findOne({
        where: { userId },
      });
      counter++;
      if (counter > 10) {
        // Fallback: use timestamp last 4 digits
        const timestamp = Date.now().toString().slice(-4);
        userId = `${firstName}${timestamp}@ringtel`;
        break;
      }
    }

    return userId;
  } catch (error) {
    console.error("Error generating employee ID:", error);
    // Fallback ID using timestamp
    const timestamp = Date.now().toString().slice(-6);
    return `employee${timestamp}@ringtel`;
  }
};

//! Create Authority/Employee
const createAuthority = async (req, res, next) => {
  try {
    const {
      address,
      age,
      bloodGroup,
      dateOfBirth,
      email,
      photo,
      fatherOrSpouseName,
      fullName,
      jobCategory,
      jobType,
      maritalStatus,
      mobileNo,
      nidOrPassportNo,
      nidPhoto, // New field for NID photos
      religion,
      role,
      sex,
      baseSalary,
      status = "active",
      // New reference fields
      joinedThrough,
      emergencyContact,
      references = [],
    } = req.body;

    // Validate required fields
    if (
      !fullName ||
      !email ||
      !mobileNo ||
      !role ||
      !dateOfBirth ||
      !nidOrPassportNo
    ) {
      return res.status(400).json({
        message:
          "Full name, email, mobile number, role, date of birth, and NID/Passport number are required!",
      });
    }

    // Validate reference fields
    if (
      !joinedThrough ||
      !joinedThrough.name ||
      !joinedThrough.mobileNo ||
      !joinedThrough.relation
    ) {
      return res.status(400).json({
        message:
          "Joined Through information is required (name, mobile number, and relation)!",
      });
    }

    if (
      !emergencyContact ||
      !emergencyContact.name ||
      !emergencyContact.mobileNo ||
      !emergencyContact.relation
    ) {
      return res.status(400).json({
        message:
          "Emergency Contact information is required (name, mobile number, and relation)!",
      });
    }

    // Check if the email already exists
    const existingEntry = await AuthorityInformation.findOne({
      where: { email },
    });
    if (existingEntry) {
      return res.status(409).json({
        message: "This email already exists! Try different.",
      });
    }

    // Generate a unique userId
    const userId = await generateUniqueEmployeeId(fullName);

    // TEMPORARY FIX: Manually generate an ID
    // Get the maximum id from the database
    const maxIdResult = await AuthorityInformation.findOne({
      attributes: [[sequelize.fn("MAX", sequelize.col("id")), "maxId"]],
      raw: true,
    });

    const nextId = (maxIdResult?.maxId || 0) + 1;

    // Parse NID photo data
    let nidPhotoData = {
      frontSide: "",
      backSide: "",
    };

    if (nidPhoto) {
      if (typeof nidPhoto === "string") {
        try {
          nidPhotoData = JSON.parse(nidPhoto);
        } catch (error) {
          console.log("Error parsing nidPhoto string:", error);
        }
      } else if (typeof nidPhoto === "object") {
        nidPhotoData = nidPhoto;
      }
    }

    // Create a new employee with explicit ID
    const newEntry = await AuthorityInformation.create({
      id: nextId, // Explicitly set the ID
      address,
      age: parseInt(age) || 0,
      bloodGroup: bloodGroup || "",
      dateOfBirth,
      email,
      photo: photo || "/default-avatar.png", // Make sure photo is not empty
      fatherOrSpouseName,
      fullName,
      jobCategory: jobCategory || "",
      jobType: jobType || "Full Time",
      maritalStatus,
      mobileNo,
      nidOrPassportNo,
      nidPhotoFrontSide: nidPhotoData.frontSide || "",
      nidPhotoBackSide: nidPhotoData.backSide || "",
      religion: religion || "",
      role,
      sex,
      baseSalary: parseFloat(baseSalary) || 0.0,

      // New reference fields
      joinedThroughName: joinedThrough.name,
      joinedThroughMobileNo: joinedThrough.mobileNo,
      joinedThroughRelation: joinedThrough.relation,
      joinedThroughAddress: joinedThrough.address || "",

      emergencyContactName: emergencyContact.name,
      emergencyContactMobileNo: emergencyContact.mobileNo,
      emergencyContactRelation: emergencyContact.relation,
      emergencyContactAddress: emergencyContact.address || "",

      userId,
      password: mobileNo, // Default password is mobile number
      status: status || "active",
    });

    return res.status(201).json({
      message: "Employee created successfully!",
      data: {
        ...newEntry.toJSON(),
        nidPhoto: {
          frontSide: newEntry.nidPhotoFrontSide,
          backSide: newEntry.nidPhotoBackSide,
        },
      },
    });
  } catch (error) {
    console.log("Error creating employee:", error);

    // Provide more detailed error information
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message:
          "Database error: Duplicate primary key. Please contact administrator to fix the database.",
        error: error.errors.map((e) => e.message).join(", "),
      });
    }

    next(error);
  }
};

//! Get All Employees with Filters
const getAllAuthorities = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      role = "",
      status = "",
      jobType = "",
    } = req.query;

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate the offset for pagination
    const offset = (pageNumber - 1) * limitNumber;

    // Build where conditions for filters
    const whereConditions = {};

    // Search filter
    if (search) {
      whereConditions[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { mobileNo: { [Op.like]: `%${search}%` } },
        { userId: { [Op.like]: `%${search}%` } },
        { nidOrPassportNo: { [Op.like]: `%${search}%` } },
      ];
    }

    // Role filter
    if (role) {
      whereConditions.role = role;
    }

    // Status filter
    if (status) {
      whereConditions.status = status;
    }

    // Job Type filter
    if (jobType) {
      whereConditions.jobType = jobType;
    }

    // Fetch all employees with pagination and filters
    const { count, rows: employees } =
      await AuthorityInformation.findAndCountAll({
        where: whereConditions,
        limit: limitNumber,
        offset: offset,
        order: [["createdAt", "DESC"]],
      });

    // Format employees data to match frontend structure
    const formattedEmployees = employees.map((employee) => ({
      id: employee.id,
      userId: employee.userId,
      fullName: employee.fullName,
      email: employee.email,
      photo: employee.photo,
      mobileNo: employee.mobileNo,
      role: employee.role,
      status: employee.status,
      fatherOrSpouseName: employee.fatherOrSpouseName,
      dateOfBirth: employee.dateOfBirth,
      age: employee.age,
      sex: employee.sex,
      maritalStatus: employee.maritalStatus,
      nidOrPassportNo: employee.nidOrPassportNo,
      nidPhoto: {
        // Include NID photos
        frontSide: employee.nidPhotoFrontSide || "",
        backSide: employee.nidPhotoBackSide || "",
      },
      bloodGroup: employee.bloodGroup,
      religion: employee.religion,
      jobCategory: employee.jobCategory,
      jobType: employee.jobType,
      address: employee.address,
      baseSalary: employee.baseSalary,
      // Format reference data
      joinedThrough: {
        name: employee.joinedThroughName,
        mobileNo: employee.joinedThroughMobileNo,
        relation: employee.joinedThroughRelation,
        address: employee.joinedThroughAddress,
      },
      emergencyContact: {
        name: employee.emergencyContactName,
        mobileNo: employee.emergencyContactMobileNo,
        relation: employee.emergencyContactRelation,
        address: employee.emergencyContactAddress,
      },
      references: employee.additionalReferences || [],
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    }));

    // Calculate total pages
    const totalPages = Math.ceil(count / limitNumber);

    return res.status(200).json({
      message: "Employees retrieved successfully!",
      data: formattedEmployees,
      pagination: {
        totalItems: count,
        totalPages: totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error getting all authorities:", error);
    next(error);
  }
};

//! Get Employee by ID
const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the employee exists
    const employee = await AuthorityInformation.findOne({
      where: { id },
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found!",
      });
    }

    // Format employee data
    const formattedEmployee = {
      id: employee.id,
      userId: employee.userId,
      fullName: employee.fullName,
      email: employee.email,
      photo: employee.photo,
      mobileNo: employee.mobileNo,
      role: employee.role,
      status: employee.status,
      fatherOrSpouseName: employee.fatherOrSpouseName,
      dateOfBirth: employee.dateOfBirth,
      age: employee.age,
      sex: employee.sex,
      maritalStatus: employee.maritalStatus,
      nidOrPassportNo: employee.nidOrPassportNo,
      nidPhoto: {
        // Include NID photos
        frontSide: employee.nidPhotoFrontSide || "",
        backSide: employee.nidPhotoBackSide || "",
      },
      bloodGroup: employee.bloodGroup,
      religion: employee.religion,
      jobCategory: employee.jobCategory,
      jobType: employee.jobType,
      address: employee.address,
      baseSalary: employee.baseSalary,
      // Format reference data
      joinedThrough: {
        name: employee.joinedThroughName,
        mobileNo: employee.joinedThroughMobileNo,
        relation: employee.joinedThroughRelation,
        address: employee.joinedThroughAddress,
      },
      emergencyContact: {
        name: employee.emergencyContactName,
        mobileNo: employee.emergencyContactMobileNo,
        relation: employee.emergencyContactRelation,
        address: employee.emergencyContactAddress,
      },
      references: employee.additionalReferences || [],
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };

    return res.status(200).json({
      message: "Employee data retrieved successfully!",
      data: formattedEmployee,
    });
  } catch (error) {
    console.error("Error getting employee by ID:", error);
    next(error);
  }
};

//! Update Employee
const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      address,
      age,
      bloodGroup,
      dateOfBirth,
      email,
      photo,
      fatherOrSpouseName,
      fullName,
      jobCategory,
      jobType,
      maritalStatus,
      mobileNo,
      nidOrPassportNo,
      nidPhoto, // New field for NID photos
      religion,
      role,
      sex,
      baseSalary,
      status,
      password,
      // New reference fields
      joinedThrough,
      emergencyContact,
      references = [],
    } = req.body;

    // Check if the employee exists
    const existingEmployee = await AuthorityInformation.findOne({
      where: { id },
    });

    if (!existingEmployee) {
      return res.status(404).json({
        message: "Employee not found!",
      });
    }

    // Check if the new email already exists (if email is being updated)
    if (email && email !== existingEmployee.email) {
      const emailExists = await AuthorityInformation.findOne({
        where: { email },
      });
      if (emailExists) {
        return res.status(409).json({
          message: "This email already exists! Try a different one.",
        });
      }
    }

    // Parse NID photo data
    let nidPhotoData = {
      frontSide: existingEmployee.nidPhotoFrontSide || "",
      backSide: existingEmployee.nidPhotoBackSide || "",
    };

    if (nidPhoto) {
      if (typeof nidPhoto === "string") {
        try {
          nidPhotoData = JSON.parse(nidPhoto);
        } catch (error) {
          console.log("Error parsing nidPhoto string:", error);
        }
      } else if (typeof nidPhoto === "object") {
        nidPhotoData = nidPhoto;
      }
    }

    // Prepare references data
    let additionalReferences = existingEmployee.additionalReferences || [];
    if (Array.isArray(references)) {
      additionalReferences = references.map((ref) => ({
        name: ref.name || "",
        mobileNo: ref.mobileNo || "",
        relation: ref.relation || "",
        address: ref.address || "",
      }));
    }

    // Prepare update data
    const updateData = {
      address: address || existingEmployee.address,
      age: parseInt(age) || existingEmployee.age,
      bloodGroup: bloodGroup || existingEmployee.bloodGroup,
      dateOfBirth: dateOfBirth || existingEmployee.dateOfBirth,
      email: email || existingEmployee.email,
      fatherOrSpouseName:
        fatherOrSpouseName || existingEmployee.fatherOrSpouseName,
      fullName: fullName || existingEmployee.fullName,
      jobCategory: jobCategory || existingEmployee.jobCategory,
      jobType: jobType || existingEmployee.jobType,
      maritalStatus: maritalStatus || existingEmployee.maritalStatus,
      mobileNo: mobileNo || existingEmployee.mobileNo,
      nidOrPassportNo: nidOrPassportNo || existingEmployee.nidOrPassportNo,
      nidPhotoFrontSide: nidPhotoData.frontSide || "" || "",
      nidPhotoBackSide: nidPhotoData.backSide || "" || "",
      religion: religion || existingEmployee.religion,
      role: role || existingEmployee.role,
      sex: sex || existingEmployee.sex,
      baseSalary: parseFloat(baseSalary) || existingEmployee.baseSalary,
      status: status || existingEmployee.status,
      photo: photo || existingEmployee.photo,
      password: password || existingEmployee.password,

      // Update reference fields
      joinedThroughName:
        joinedThrough?.name || existingEmployee.joinedThroughName,
      joinedThroughMobileNo:
        joinedThrough?.mobileNo || existingEmployee.joinedThroughMobileNo,
      joinedThroughRelation:
        joinedThrough?.relation || existingEmployee.joinedThroughRelation,
      joinedThroughAddress:
        joinedThrough?.address || existingEmployee.joinedThroughAddress,

      emergencyContactName:
        emergencyContact?.name || existingEmployee.emergencyContactName,
      emergencyContactMobileNo:
        emergencyContact?.mobileNo || existingEmployee.emergencyContactMobileNo,
      emergencyContactRelation:
        emergencyContact?.relation || existingEmployee.emergencyContactRelation,
      emergencyContactAddress:
        emergencyContact?.address || existingEmployee.emergencyContactAddress,

      additionalReferences: additionalReferences,
    };

    // Update the employee
    await AuthorityInformation.update(updateData, {
      where: { id },
    });

    // Fetch the updated employee data
    const updatedEmployee = await AuthorityInformation.findOne({
      where: { id },
    });

    // Format the response
    const formattedEmployee = {
      id: updatedEmployee.id,
      userId: updatedEmployee.userId,
      fullName: updatedEmployee.fullName,
      email: updatedEmployee.email,
      photo: updatedEmployee.photo,
      mobileNo: updatedEmployee.mobileNo,
      role: updatedEmployee.role,
      status: updatedEmployee.status,
      fatherOrSpouseName: updatedEmployee.fatherOrSpouseName,
      dateOfBirth: updatedEmployee.dateOfBirth,
      age: updatedEmployee.age,
      sex: updatedEmployee.sex,
      maritalStatus: updatedEmployee.maritalStatus,
      nidOrPassportNo: updatedEmployee.nidOrPassportNo,
      nidPhoto: {
        // Include NID photos
        frontSide: updatedEmployee.nidPhotoFrontSide || "",
        backSide: updatedEmployee.nidPhotoBackSide || "",
      },
      bloodGroup: updatedEmployee.bloodGroup,
      religion: updatedEmployee.religion,
      jobCategory: updatedEmployee.jobCategory,
      jobType: updatedEmployee.jobType,
      address: updatedEmployee.address,
      baseSalary: updatedEmployee.baseSalary,
      joinedThrough: {
        name: updatedEmployee.joinedThroughName,
        mobileNo: updatedEmployee.joinedThroughMobileNo,
        relation: updatedEmployee.joinedThroughRelation,
        address: updatedEmployee.joinedThroughAddress,
      },
      emergencyContact: {
        name: updatedEmployee.emergencyContactName,
        mobileNo: updatedEmployee.emergencyContactMobileNo,
        relation: updatedEmployee.emergencyContactRelation,
        address: updatedEmployee.emergencyContactAddress,
      },
      references: updatedEmployee.additionalReferences || [],
      createdAt: updatedEmployee.createdAt,
      updatedAt: updatedEmployee.updatedAt,
    };

    return res.status(200).json({
      message: "Employee information updated successfully!",
      data: formattedEmployee,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    next(error);
  }
};

//! Toggle Employee Status
const toggleEmployeeStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["active", "inactive", "pending"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid status! Status must be one of: active, inactive, pending",
      });
    }

    // Check if the employee exists
    const employee = await AuthorityInformation.findOne({
      where: { id },
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found!",
      });
    }

    // Update the status
    await AuthorityInformation.update({ status }, { where: { id } });

    // Fetch the updated employee
    const updatedEmployee = await AuthorityInformation.findOne({
      where: { id },
    });

    return res.status(200).json({
      message: `Employee status updated to ${status} successfully!`,
      data: updatedEmployee,
    });
  } catch (error) {
    console.error("Error toggling employee status:", error);
    next(error);
  }
};

//! Delete Employee
const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the employee exists
    const existingEmployee = await AuthorityInformation.findOne({
      where: { id },
    });

    if (!existingEmployee) {
      return res.status(404).json({
        message: "Employee not found!",
      });
    }

    // Delete the employee
    await AuthorityInformation.destroy({
      where: { id },
    });

    return res.status(200).json({
      message: "Employee deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    next(error);
  }
};

//! Get Employee Statistics
const getEmployeeStats = async (req, res, next) => {
  try {
    // Get total employees count
    const totalEmployees = await AuthorityInformation.count();

    // Get active employees count
    const activeEmployees = await AuthorityInformation.count({
      where: { status: "active" },
    });

    // Get role breakdown
    const roleBreakdown = await AuthorityInformation.findAll({
      attributes: [
        "role",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["role"],
      raw: true,
    });

    // Get status breakdown
    const statusBreakdown = await AuthorityInformation.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["status"],
      raw: true,
    });

    // Get job type breakdown
    const jobTypeBreakdown = await AuthorityInformation.findAll({
      attributes: [
        "jobType",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["jobType"],
      raw: true,
    });

    return res.status(200).json({
      message: "Employee statistics retrieved successfully!",
      data: {
        totalEmployees,
        activeEmployees,
        roleBreakdown,
        statusBreakdown,
        jobTypeBreakdown,
      },
    });
  } catch (error) {
    console.error("Error getting employee stats:", error);
    next(error);
  }
};

//! Search Employees Advanced
const searchEmployeeAdvanced = async (req, res, next) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;

    // Check if search query is provided
    if (!query || query.trim() === "") {
      return res.status(400).json({
        message: "Please provide a search query.",
      });
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;
    const searchQuery = query.trim();

    // Search conditions
    const searchConditions = {
      [Op.or]: [
        { fullName: { [Op.like]: `%${searchQuery}%` } },
        { email: { [Op.like]: `%${searchQuery}%` } },
        { mobileNo: { [Op.like]: `%${searchQuery}%` } },
        { userId: { [Op.like]: `%${searchQuery}%` } },
        { nidOrPassportNo: { [Op.like]: `%${searchQuery}%` } },
        { role: { [Op.like]: `%${searchQuery}%` } },
        // Search in reference fields
        { joinedThroughName: { [Op.like]: `%${searchQuery}%` } },
        { emergencyContactName: { [Op.like]: `%${searchQuery}%` } },
      ],
    };

    // Search for employees
    const { count, rows: employees } =
      await AuthorityInformation.findAndCountAll({
        where: searchConditions,
        limit: limitNumber,
        offset: offset,
        order: [["fullName", "ASC"]],
      });

    // Format employees data
    const formattedEmployees = employees.map((employee) => ({
      id: employee.id,
      userId: employee.userId,
      fullName: employee.fullName,
      email: employee.email,
      photo: employee.photo,
      mobileNo: employee.mobileNo,
      role: employee.role,
      status: employee.status,
      fatherOrSpouseName: employee.fatherOrSpouseName,
      dateOfBirth: employee.dateOfBirth,
      age: employee.age,
      sex: employee.sex,
      maritalStatus: employee.maritalStatus,
      nidOrPassportNo: employee.nidOrPassportNo,
      bloodGroup: employee.bloodGroup,
      religion: employee.religion,
      jobCategory: employee.jobCategory,
      jobType: employee.jobType,
      address: employee.address,
      baseSalary: employee.baseSalary,
      joinedThrough: {
        name: employee.joinedThroughName,
        mobileNo: employee.joinedThroughMobileNo,
        relation: employee.joinedThroughRelation,
        address: employee.joinedThroughAddress,
      },
      emergencyContact: {
        name: employee.emergencyContactName,
        mobileNo: employee.emergencyContactMobileNo,
        relation: employee.emergencyContactRelation,
        address: employee.emergencyContactAddress,
      },
      references: employee.additionalReferences || [],
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    }));

    // Calculate total pages
    const totalPages = Math.ceil(count / limitNumber);

    return res.status(200).json({
      message: "Employees retrieved successfully!",
      data: formattedEmployees,
      searchQuery: searchQuery,
      pagination: {
        totalItems: count,
        totalPages: totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Advanced search error:", error);
    next(error);
  }
};

//! Get Employee by User ID
const getEmployeeByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId || userId.trim() === "") {
      return res.status(400).json({
        message: "Please provide a userId.",
      });
    }

    const employee = await AuthorityInformation.findOne({
      where: { userId: userId.trim() },
    });

    if (!employee) {
      return res.status(404).json({
        message: `Employee with userId "${userId}" not found!`,
      });
    }

    // Format employee data
    const formattedEmployee = {
      id: employee.id,
      userId: employee.userId,
      fullName: employee.fullName,
      email: employee.email,
      photo: employee.photo,
      mobileNo: employee.mobileNo,
      role: employee.role,
      status: employee.status,
      fatherOrSpouseName: employee.fatherOrSpouseName,
      dateOfBirth: employee.dateOfBirth,
      age: employee.age,
      sex: employee.sex,
      maritalStatus: employee.maritalStatus,
      nidOrPassportNo: employee.nidOrPassportNo,
      bloodGroup: employee.bloodGroup,
      religion: employee.religion,
      jobCategory: employee.jobCategory,
      jobType: employee.jobType,
      address: employee.address,
      baseSalary: employee.baseSalary,
      joinedThrough: {
        name: employee.joinedThroughName,
        mobileNo: employee.joinedThroughMobileNo,
        relation: employee.joinedThroughRelation,
        address: employee.joinedThroughAddress,
      },
      emergencyContact: {
        name: employee.emergencyContactName,
        mobileNo: employee.emergencyContactMobileNo,
        relation: employee.emergencyContactRelation,
        address: employee.emergencyContactAddress,
      },
      references: employee.additionalReferences || [],
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };

    return res.status(200).json({
      message: "Employee data retrieved successfully!",
      data: formattedEmployee,
    });
  } catch (error) {
    console.error("Get by userId error:", error);
    next(error);
  }
};

//! Check user credentials (login) - Simplified version
const checkUserCredentials = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Both email and password are required.",
      });
    }

    // Find the user by email in ClientInformation table with password
    let user = await ClientInformation.findOne({
      where: { email },
    });

    let userType = "client";

    // If user is not found in ClientInformation, search in AuthorityInformation
    if (!user) {
      user = await AuthorityInformation.findOne({
        where: { email },
      });
      userType = "authority";

      // If user is not found in AuthorityInformation either
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found. Please check your email address.",
        });
      }
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Please try again.",
      });
    }

    // Check user status - Only allow login if status is 'active'
    if (user.status.toLowerCase() !== "active") {
      let statusMessage = "";

      if (user.status.toLowerCase() === "pending") {
        statusMessage =
          "Your account is pending approval. You will be able to login once your account is approved by admin.";
      } else if (user.status.toLowerCase() === "inactive") {
        statusMessage =
          "Your account is currently inactive. Please contact support to reactivate your account.";
      } else {
        statusMessage = `Your account status is "${user.status}". Please contact support for assistance.`;
      }

      return res.status(403).json({
        success: false,
        message: statusMessage,
        accountInfo: {
          userId: user.userId,
          fullName: user.fullName,
          email: user.email,
          status: user.status,
          userType: userType,
        },
      });
    }

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    // Add package details for clients
    if (userType === "client" && userResponse.package) {
      const packageDetails = await Package.findOne({
        where: { id: userResponse.package },
        attributes: [
          "id",
          "packageName",
          "packageBandwidth",
          "packagePrice",
          "packageDetails",
          "duration",
          "status",
        ],
      });

      if (packageDetails) {
        userResponse.package = packageDetails.packageName; // Replace ID with name
        userResponse.packageDetails = packageDetails.toJSON(); // Add full package details
      }
    }

    // Add user type to response
    userResponse.userType = userType;

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      data: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAuthority,
  deleteEmployee,
  updateEmployee,
  getEmployeeById,
  toggleEmployeeStatus,
  getEmployeeByUserId,
  searchEmployeeAdvanced,
  getAllAuthorities,

  getClientById,
  createClient,
  getClientStats,
  getClientsByReferCode,
  getAllClients,
  updateClientStatus,
  updateClient,
  deleteClient,
  // getPackageDataByClientId,
  transformClientWithPackage,

  checkUserCredentials,

  //! Now client according to the package will be available from all file.
  getPackageDetails,
};
