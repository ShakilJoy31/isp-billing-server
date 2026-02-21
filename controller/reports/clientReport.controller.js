const { Op } = require("sequelize");
const sequelize = require("../../database/connection");
const ClientInformation = require("../../models/Authentication/client.model");
const Package = require("../../models/package/package.model");
const AuthorityInformation = require("../../models/Authentication/authority.model");
const EmployeePayment = require("../../models/payment/employee-payment.model");
const Transaction = require("../../models/payment/client-payment.model");

//! Helper function to parse date filters (updated - now used for backward compatibility)
const parseDateFilters = (startDate, endDate, field = "createdAt") => {
  const filter = {};
  if (startDate || endDate) {
    filter[field] = {};
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filter[field][Op.gte] = start;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter[field][Op.lte] = end;
    }
  }
  return filter;
};

//! Helper function to format date
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).replace(/\//g, "/");
};

//! Helper function to get package details
const getPackageDetails = async (packageId) => {
  if (!packageId) return null;
  try {
    const packageData = await Package.findByPk(packageId);
    return packageData ? packageData.toJSON() : null;
  } catch (error) {
    console.error("Error fetching package details:", error);
    return null;
  }
};

//! Helper function to get last payment date
const getLastPaymentDate = async (clientId) => {
  try {
    // Check if client is free and get both id and userId
    const client = await ClientInformation.findOne({
      where: { userId: clientId },
      attributes: ["isFreeClient", "id", "userId"],
    });
    
    // If client is free, return "Free Client" instead of payment date
    if (client && client.isFreeClient) {
      return "Free Client";
    }

    if (!client) return "No Payment";

    // Get the latest transaction (client self-payment) - using numeric id as string
    const transaction = await Transaction.findOne({
      where: { userId: client.id.toString(), status: "approved" },
      order: [["createdAt", "DESC"]],
      attributes: ["createdAt"],
    });

    // Get the latest employee payment - using the string userId (not numeric id)
    const employeePayment = await EmployeePayment.findOne({
      where: { 
        clientId: client.userId, // Use the string userId here, not numeric id
        status: { [Op.in]: ["collected", "verified", "deposited"] } 
      },
      order: [["collectionDate", "DESC"]],
      attributes: ["collectionDate"],
    });

    let lastDate = null;
    if (transaction && employeePayment) {
      const transactionDate = new Date(transaction.createdAt);
      const employeeDate = new Date(employeePayment.collectionDate);
      lastDate = transactionDate > employeeDate ? transaction.createdAt : employeePayment.collectionDate;
    } else if (transaction) {
      lastDate = transaction.createdAt;
    } else if (employeePayment) {
      lastDate = employeePayment.collectionDate;
    }

    return lastDate ? formatDate(lastDate) : "No Payment";
  } catch (error) {
    console.error("Error getting last payment date:", error);
    return "Unknown";
  }
};

//! Helper function to calculate total payment (for lifetime revenue)
const calculateTotalPayment = async (clientId) => {
  try {
    // Get client to get both id and userId
    const client = await ClientInformation.findOne({
      where: { userId: clientId },
      attributes: ["id", "userId"],
    });

    if (!client) return 0;

    // Get transactions (client self-payments) - using numeric id as string
    const transactions = await Transaction.findAll({
      where: { 
        userId: client.id.toString(), 
        status: "approved" 
      },
      attributes: ["amount"],
    });

    // Get employee payments - using string userId
    const employeePayments = await EmployeePayment.findAll({
      where: { 
        clientId: client.userId, // Use string userId here
        status: { [Op.in]: ["collected", "verified", "deposited"] }
      },
      attributes: ["amount"],
    });

    let total = 0;
    transactions.forEach(t => total += parseFloat(t.amount) || 0);
    employeePayments.forEach(p => total += parseFloat(p.amount) || 0);

    return total;
  } catch (error) {
    console.error("Error calculating total payment:", error);
    return 0;
  }
};

//! Helper function to calculate due amount for a client
const calculateClientDue = async (clientId, upToDate = new Date()) => {
  try {
    // Get client details - include createdAt, isFreeClient, id, and userId
    const client = await ClientInformation.findOne({
      where: { userId: clientId },
      attributes: ["costForPackage", "package", "status", "userId", "fullName", "createdAt", "isFreeClient", "id"],
    });

    if (!client) return 0;
    
    // If client is free, due amount is always 0
    if (client.isFreeClient) return 0;

    const monthlyBill = parseFloat(client.costForPackage) || 0;
    if (monthlyBill === 0) return 0;

    // Get all paid transactions for this client (client self-payments) - using numeric id as string
    const transactions = await Transaction.findAll({
      where: {
        userId: client.id.toString(),
        status: "approved",
      },
      attributes: ["amount", "billingMonth", "billingYear", "createdAt"],
    });

    // Get all employee payments - using string userId
    const employeePayments = await EmployeePayment.findAll({
      where: {
        clientId: client.userId, // Use string userId here
        status: { [Op.in]: ["collected", "verified", "deposited"] },
      },
      attributes: ["amount", "billingMonth", "collectionDate"],
    });

    // Calculate total paid amount from both sources
    let totalPaid = 0;
    transactions.forEach(t => totalPaid += parseFloat(t.amount) || 0);
    employeePayments.forEach(p => totalPaid += parseFloat(p.amount) || 0);

    // Get join date
    const joinDate = new Date(client.createdAt);
    const currentDate = new Date(upToDate);
    
    // Calculate months since join
    const yearsDiff = currentDate.getFullYear() - joinDate.getFullYear();
    const monthsDiff = currentDate.getMonth() - joinDate.getMonth();
    const daysDiff = currentDate.getDate() - joinDate.getDate();
    
    let monthsSinceJoin = yearsDiff * 12 + monthsDiff;
    
    // If we're past the join day of the current month, add another month
    if (daysDiff >= 0) {
      monthsSinceJoin += 1;
    }
    
    // Ensure at least 1 month for new clients
    monthsSinceJoin = Math.max(1, monthsSinceJoin);
    
    const expectedAmount = monthsSinceJoin * monthlyBill;
    const dueAmount = Math.max(0, expectedAmount - totalPaid);

    // Return as number, not NaN
    return isNaN(dueAmount) ? 0 : dueAmount;
  } catch (error) {
    console.error("Error calculating client due:", error);
    return 0;
  }
};


//! 1. ACTIVE CLIENTS REPORT
const getActiveClientsReport = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      location,
      area,
      packageId,
      zone,
      dateType = "lastPayment", // Changed default to "lastPayment"
      page = 1,
      limit = 100,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where clause for clients - exclude free clients (isFreeClient: false)
    const whereClause = { 
      role: "client", 
      status: "active",
      isFreeClient: false // Only include paying clients
    };

    // Location/Zone filter (zone and location are the same in your schema)
    if (location) whereClause.location = location;
    if (zone) whereClause.location = zone;
    if (area) whereClause.area = area;
    if (packageId) whereClause.package = packageId;

    // Get total count for pagination (without date filter initially)
    let totalCount = await ClientInformation.count({ where: whereClause });

    // Get active clients (without date filter initially)
    let clients = await ClientInformation.findAll({
      where: whereClause,
      attributes: [
        "id",
        "userId",
        "customerId",
        "fullName",
        "mobileNo",
        "email",
        "location",
        "area",
        "package",
        "costForPackage",
        "status",
        "createdAt",
        "updatedAt",
        "isFreeClient",
      ],
      order: [["createdAt", "DESC"]],
    });

    // Transform clients with additional data and apply last payment date filtering
    let transformedClients = await Promise.all(
      clients.map(async (client) => {
        const clientData = client.toJSON();

        // Get package details
        let packageName = "No Package";
        let monthlyBill = 0;
        if (clientData.package) {
          const packageDetails = await getPackageDetails(clientData.package);
          if (packageDetails) {
            packageName = packageDetails.packageName;
            monthlyBill = parseFloat(packageDetails.packagePrice) || 0;
          }
        }

        // Use costForPackage if available, otherwise use package price
        if (clientData.costForPackage) {
          monthlyBill = parseFloat(clientData.costForPackage) || 0;
        }

        // Get last payment date
        const lastPaymentDate = await getLastPaymentDate(clientData.userId);
        
        // Parse last payment date for filtering (only for non-free clients with payments)
        let lastPaymentDateObj = null;
        if (lastPaymentDate && lastPaymentDate !== "No Payment" && lastPaymentDate !== "Free Client") {
          // Try to parse the date (assuming format DD/MM/YYYY)
          const dateParts = lastPaymentDate.split('/');
          if (dateParts.length === 3) {
            lastPaymentDateObj = new Date(
              parseInt(dateParts[2]), 
              parseInt(dateParts[1]) - 1, 
              parseInt(dateParts[0])
            );
          }
        }

        // Calculate due amount - ensure it's a number
        const amountDue = await calculateClientDue(clientData.userId);
        const safeAmountDue = isNaN(amountDue) ? 0 : amountDue;

        return {
          sl: null, // Will be filled on frontend
          customerId: clientData.customerId || clientData.userId,
          clientName: clientData.fullName,
          mobile: clientData.mobileNo,
          zone: clientData.location || "N/A",
          area: clientData.area || "N/A",
          package: packageName,
          monthlyBill: monthlyBill.toFixed(2),
          lastPayment: lastPaymentDate,
          lastPaymentDate: lastPaymentDateObj, // Add for filtering
          amountDue: safeAmountDue.toFixed(2),
          isFreeClient: clientData.isFreeClient,
        };
      })
    );

    // Apply last payment date filtering if dates are provided
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);

      transformedClients = transformedClients.filter(client => {
        // Skip clients with no payment date (including free clients and those with no payments)
        if (!client.lastPaymentDate) return false;
        
        let isValid = true;
        
        if (start) {
          isValid = isValid && client.lastPaymentDate >= start;
        }
        
        if (end) {
          isValid = isValid && client.lastPaymentDate <= end;
        }
        
        return isValid;
      });

      // Update total count based on filtered results
      totalCount = transformedClients.length;
    }

    // Apply pagination after filtering
    const paginatedClients = transformedClients.slice(offset, offset + limitNumber);

    // Calculate summary with safe number handling (only for paying clients)
    const totalMonthlyBill = paginatedClients.reduce(
      (sum, client) => sum + (parseFloat(client.monthlyBill) || 0),
      0
    );
    
    const totalDue = paginatedClients.reduce(
      (sum, client) => sum + (parseFloat(client.amountDue) || 0),
      0
    );

    // Calculate collection rate safely
    const collectionRate = totalMonthlyBill > 0
      ? (((totalMonthlyBill - totalDue) / totalMonthlyBill) * 100).toFixed(2)
      : "0.00";

    // Get unique zones and areas for filters (excluding free clients)
    const zones = await ClientInformation.findAll({
      where: { 
        role: "client", 
        status: "active", 
        location: { [Op.ne]: null },
        isFreeClient: false // Only paying clients
      },
      attributes: [[sequelize.fn("DISTINCT", sequelize.col("location")), "location"]],
    });

    const areas = await ClientInformation.findAll({
      where: { 
        role: "client", 
        status: "active", 
        area: { [Op.ne]: null },
        isFreeClient: false // Only paying clients
      },
      attributes: [[sequelize.fn("DISTINCT", sequelize.col("area")), "area"]],
    });

    const packages = await Package.findAll({
      where: { status: "Active" },
      attributes: ["id", "packageName"],
    });

    // Remove the temporary lastPaymentDate and isFreeClient fields from response
    const clientsForResponse = paginatedClients.map(({ lastPaymentDate, isFreeClient, ...rest }) => rest);

    res.status(200).json({
      success: true,
      data: {
        reportTitle: "Active Clients Report",
        companyInfo: {
          name: "Ring Tel",
          mobile: "01601 997 701",
          website: "www.rtel.com.bd",
          email: "ringtel.isp@gmail.com",
        },
        period: {
          startDate: startDate ? formatDate(startDate) : "All time",
          endDate: endDate ? formatDate(endDate) : "Current",
        },
        generatedDate: formatDate(new Date()),
        clients: clientsForResponse,
      },
      summary: {
        totalActiveClients: paginatedClients.length,
        totalMonthlyBill: totalMonthlyBill.toFixed(2),
        totalDue: totalDue.toFixed(2),
        averageBill: paginatedClients.length > 0 
          ? (totalMonthlyBill / paginatedClients.length).toFixed(2)
          : "0.00",
        collectionRate: collectionRate,
      },
      filters: {
        zones: zones.map(z => z.location).filter(Boolean),
        areas: areas.map(a => a.area).filter(Boolean),
        packages: packages.map(p => ({ id: p.id, name: p.packageName })),
      },
      pagination: {
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limitNumber),
        hasNextPage: pageNumber < Math.ceil(totalCount / limitNumber),
        hasPreviousPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error("Error in active clients report:", error);
    next(error);
  }
};


//! 2. CLIENT DUE REPORT
const getClientDueReport = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      location,
      area,
      packageId,
      zone,
      minDue = 1, // Only show clients with due > 0
      dateType = "createdAt",
      page = 1,
      limit = 100,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where clause
    const whereClause = { 
      role: "client",
      status: { [Op.in]: ["active", "pending"] } // Include active and pending clients
    };

    // Location/Zone filter
    if (location) whereClause.location = location;
    if (zone) whereClause.location = zone;
    if (area) whereClause.area = area;
    if (packageId) whereClause.package = packageId;

    // Date filter
    if (startDate || endDate) {
      const dateFilter = parseDateFilters(startDate, endDate, dateType);
      Object.assign(whereClause, dateFilter);
    }

    // Get all potential clients
    const clients = await ClientInformation.findAll({
      where: whereClause,
      attributes: [
        "id",
        "userId",
        "customerId",
        "fullName",
        "mobileNo",
        "location",
        "area",
        "package",
        "costForPackage",
        "status",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    // Calculate due for each client and filter those with due > minDue
    const clientsWithDue = await Promise.all(
      clients.map(async (client) => {
        const clientData = client.toJSON();

        // Get package details
        let packageName = "No Package";
        let monthlyBill = 0;
        if (clientData.package) {
          const packageDetails = await getPackageDetails(clientData.package);
          if (packageDetails) {
            packageName = packageDetails.packageName;
            monthlyBill = parseFloat(packageDetails.packagePrice) || 0;
          }
        }

        // Use costForPackage if available
        if (clientData.costForPackage) {
          monthlyBill = parseFloat(clientData.costForPackage) || 0;
        }

        // Calculate due amount
        const dueAmount = await calculateClientDue(clientData.userId);
        
        if (dueAmount <= parseFloat(minDue)) {
          return null;
        }

        // Get due months (simplified calculation)
        const joinDate = new Date(clientData.createdAt);
        const currentDate = new Date();
        const monthsSinceJoin = Math.ceil(
          (currentDate - joinDate) / (1000 * 60 * 60 * 24 * 30)
        );
        
        // Get paid months count (simplified)
        const totalPaid = await calculateTotalPayment(clientData.userId);
        const paidMonths = Math.floor(totalPaid / monthlyBill);
        const dueMonths = Math.max(0, monthsSinceJoin - paidMonths);

        return {
          sl: null,
          clientName: clientData.fullName,
          mobile: clientData.mobileNo,
          zone: clientData.location || "N/A",
          area: clientData.area || "N/A",
          package: packageName,
          dueMonth: dueMonths,
          dueAmount: dueAmount.toFixed(2),
        };
      })
    );

    // Filter out null values
    const dueClients = clientsWithDue.filter(client => client !== null);

    // Apply pagination
    const totalCount = dueClients.length;
    const paginatedClients = dueClients.slice(offset, offset + limitNumber);

    // Calculate summary
    const totalDue = paginatedClients.reduce(
      (sum, client) => sum + parseFloat(client.dueAmount || 0),
      0
    );
    const totalDueMonths = paginatedClients.reduce(
      (sum, client) => sum + client.dueMonth,
      0
    );

    // Get unique zones and areas for filters
    const zones = await ClientInformation.findAll({
      where: { role: "client" },
      attributes: [[sequelize.fn("DISTINCT", sequelize.col("location")), "location"]],
      where: { location: { [Op.ne]: null } },
    });

    const areas = await ClientInformation.findAll({
      where: { role: "client" },
      attributes: [[sequelize.fn("DISTINCT", sequelize.col("area")), "area"]],
      where: { area: { [Op.ne]: null } },
    });

    const packages = await Package.findAll({
      where: { status: "Active" },
      attributes: ["id", "packageName"],
    });

    res.status(200).json({
      success: true,
      data: {
        reportTitle: "Client Due Report",
        companyInfo: {
          name: "Ring Tel",
          mobile: "01601 997 701",
          website: "www.rtel.com.bd",
          email: "ringtel.isp@gmail.com",
        },
        period: {
          startDate: startDate ? formatDate(startDate) : "All time",
          endDate: endDate ? formatDate(endDate) : "Current",
        },
        generatedDate: formatDate(new Date()),
        clients: paginatedClients,
      },
      summary: {
        totalDueClients: paginatedClients.length,
        totalDueAmount: totalDue.toFixed(2),
        totalDueMonths: totalDueMonths,
        averageDuePerClient: paginatedClients.length > 0 
          ? (totalDue / paginatedClients.length).toFixed(2)
          : "0.00",
        averageDueMonths: paginatedClients.length > 0
          ? (totalDueMonths / paginatedClients.length).toFixed(1)
          : "0.0",
      },
      filters: {
        zones: zones.map(z => z.location),
        areas: areas.map(a => a.area),
        packages: packages.map(p => ({ id: p.id, name: p.packageName })),
      },
      pagination: {
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limitNumber),
        hasNextPage: pageNumber < Math.ceil(totalCount / limitNumber),
        hasPreviousPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error("Error in client due report:", error);
    next(error);
  }
};

//! 3. CLIENT LIST REPORT
const getClientListReport = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      location,
      area,
      packageId,
      zone,
      status,
      customerType,
      dateType = "createdAt",
      page = 1,
      limit = 100,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where clause
    const whereClause = { role: "client" };

    // Filters
    if (location) whereClause.location = location;
    if (zone) whereClause.location = zone;
    if (area) whereClause.area = area;
    if (packageId) whereClause.package = packageId;
    if (status) whereClause.status = status;
    if (customerType) whereClause.customerType = customerType;

    // Date filter
    if (startDate || endDate) {
      const dateFilter = parseDateFilters(startDate, endDate, dateType);
      Object.assign(whereClause, dateFilter);
    }

    // Get total count
    const totalCount = await ClientInformation.count({ where: whereClause });

    // Get clients
    const clients = await ClientInformation.findAll({
      where: whereClause,
      attributes: [
        "id",
        "userId",
        "customerId",
        "fullName",
        "mobileNo",
        "email",
        "location",
        "area",
        "package",
        "costForPackage",
        "status",
        "referId",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
      limit: limitNumber,
      offset: offset,
    });

    // Transform clients with additional data
    const transformedClients = await Promise.all(
      clients.map(async (client, index) => {
        const clientData = client.toJSON();

        // Get package details
        let packageName = "No Package";
        let monthlyBill = 0;
        if (clientData.package) {
          const packageDetails = await getPackageDetails(clientData.package);
          if (packageDetails) {
            packageName = packageDetails.packageName;
            monthlyBill = parseFloat(packageDetails.packagePrice) || 0;
          }
        }

        // Use costForPackage if available
        if (clientData.costForPackage) {
          monthlyBill = parseFloat(clientData.costForPackage) || 0;
        }

        // Get referrer name if available
        let referrerName = "None";
        if (clientData.referId && clientData.referId !== "N/A") {
          const referrer = await ClientInformation.findOne({
            where: { userId: clientData.referId },
            attributes: ["fullName"],
          });
          if (referrer) {
            referrerName = referrer.fullName;
          } else {
            const employee = await AuthorityInformation.findOne({
              where: { userId: clientData.referId },
              attributes: ["fullName"],
            });
            if (employee) {
              referrerName = employee.fullName;
            }
          }
        }

        return {
          sl: offset + index + 1,
          customerId: clientData.customerId || clientData.userId,
          clientName: clientData.fullName,
          mobile: clientData.mobileNo,
          zone: clientData.location || "N/A",
          area: clientData.area || "N/A",
          package: packageName,
          monthlyBill: monthlyBill.toFixed(2),
          referral: referrerName,
          joinDate: formatDate(clientData.createdAt),
          status: clientData.status,
        };
      })
    );

    // Calculate summary
    const statusBreakdown = await ClientInformation.findAll({
      where: { role: "client" },
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["status"],
    });

    // Get unique values for filters
    const zones = await ClientInformation.findAll({
      where: { role: "client" },
      attributes: [[sequelize.fn("DISTINCT", sequelize.col("location")), "location"]],
      where: { location: { [Op.ne]: null } },
    });

    const areas = await ClientInformation.findAll({
      where: { role: "client" },
      attributes: [[sequelize.fn("DISTINCT", sequelize.col("area")), "area"]],
      where: { area: { [Op.ne]: null } },
    });

    const packages = await Package.findAll({
      attributes: ["id", "packageName"],
    });

    res.status(200).json({
      success: true,
      data: {
        reportTitle: "Client List Report",
        companyInfo: {
          name: "Ring Tel",
          mobile: "01601 997 701",
          website: "www.rtel.com.bd",
          email: "ringtel.isp@gmail.com",
        },
        period: {
          startDate: startDate ? formatDate(startDate) : "All time",
          endDate: endDate ? formatDate(endDate) : "Current",
        },
        generatedDate: formatDate(new Date()),
        clients: transformedClients,
      },
      summary: {
        totalClients: totalCount,
        activeClients: statusBreakdown.find(s => s.status === "active")?.dataValues.count || 0,
        pendingClients: statusBreakdown.find(s => s.status === "pending")?.dataValues.count || 0,
        inactiveClients: statusBreakdown.find(s => s.status === "inactive")?.dataValues.count || 0,
      },
      filters: {
        zones: zones.map(z => z.location),
        areas: areas.map(a => a.area),
        packages: packages.map(p => ({ id: p.id, name: p.packageName })),
        statuses: ["active", "pending", "inactive"],
        customerTypes: ["Residential", "Business", "Corporate"], // Adjust based on your data
      },
      pagination: {
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limitNumber),
        hasNextPage: pageNumber < Math.ceil(totalCount / limitNumber),
        hasPreviousPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error("Error in client list report:", error);
    next(error);
  }
};

module.exports = {
  getActiveClientsReport,
  getClientDueReport,
  getClientListReport,
};