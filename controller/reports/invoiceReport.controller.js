const { Op } = require("sequelize");
const sequelize = require("../../database/connection");
const ClientInformation = require("../../models/Authentication/client.model");
const Package = require("../../models/package/package.model");
const EmployeePayment = require("../../models/payment/employee-payment.model");
const Transaction = require("../../models/payment/client-payment.model");

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

// Helper function to calculate previous due for a client before a specific month
const calculatePreviousDue = async (clientId, billingMonth, billingYear) => {
  try {
    const client = await ClientInformation.findOne({
      where: { userId: clientId },
      attributes: ["costForPackage", "createdAt", "id"],
    });

    if (!client) return 0;

    const monthlyBill = parseFloat(client.costForPackage) || 0;
    if (monthlyBill === 0) return 0;

    // Get all payments before this billing month
    const targetDate = new Date(billingYear, parseInt(billingMonth) - 1, 1);
    
    // Get transactions (client self-payments)
    const transactions = await Transaction.findAll({
      where: {
        userId: clientId,
        status: "approved",
        createdAt: { [Op.lt]: targetDate }
      },
      attributes: ["amount"],
    });

    // Get employee payments
    const employeePayments = await EmployeePayment.findAll({
      where: {
        clientId: clientId,
        status: { [Op.in]: ["collected", "verified", "deposited"] },
        collectionDate: { [Op.lt]: targetDate }
      },
      attributes: ["amount"],
    });

    // Calculate total paid before this month
    let totalPaid = 0;
    transactions.forEach(t => totalPaid += parseFloat(t.amount) || 0);
    employeePayments.forEach(p => totalPaid += parseFloat(p.amount) || 0);

    // Calculate months from join date to target month
    const joinDate = new Date(client.createdAt);
    const monthsUntilTarget = Math.max(0, 
      (targetDate.getFullYear() - joinDate.getFullYear()) * 12 + 
      (targetDate.getMonth() - joinDate.getMonth())
    );
    
    const expectedAmount = monthsUntilTarget * monthlyBill;
    const previousDue = Math.max(0, expectedAmount - totalPaid);

    return previousDue;
  } catch (error) {
    console.error("Error calculating previous due:", error);
    return 0;
  }
};

//! Helper function to get payment for a specific month
const getPaymentForMonth = async (clientId, billingMonth, billingYear) => {
  try {
    // Parse billing month name for Transaction table
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    const monthIndex = parseInt(billingMonth) - 1;
    const monthName = monthNames[monthIndex];
    
    // Format for employee payment - Based on your data, it's stored as "February 2026"
    const employeeBillingMonth = `${monthName} ${billingYear}`;
    
    console.log(`Searching payments for client ${clientId}:`);
    console.log(`- Transaction: Month=${monthName}, Year=${billingYear}`);
    console.log(`- Employee: billingMonth=${employeeBillingMonth}`);
    
    // First check for employee payments (these have invoiceId field)
    const employeePayment = await EmployeePayment.findOne({
      where: {
        clientId: clientId,
        billingMonth: employeeBillingMonth,
        status: { [Op.in]: ["collected", "verified", "deposited"] }
      },
      attributes: ["amount", "collectionDate", "discount", "invoiceId"],
      order: [["collectionDate", "DESC"]],
    });

    if (employeePayment) {
      const amount = parseFloat(employeePayment.amount) - parseFloat(employeePayment.discount) || 0;
      const discount = parseFloat(employeePayment.discount) || 0;
      
      return {
        amount: amount,
        discount: discount,
        date: employeePayment.collectionDate,
        type: 'employee',
        invoiceId: employeePayment.invoiceId
      };
    }


    const client = await ClientInformation.findOne({
          where: { userId: clientId },
          attributes: { exclude: ["password"] },
        });

    // Then check transactions (client self-payments) - these use trxId as invoice identifier
    const transaction = await Transaction.findOne({
      where: {
        userId: client.id,
        billingMonth: monthName,
        billingYear: billingYear,
        status: "approved"
      },
      attributes: ["amount", "createdAt", "trxId"],
      order: [["createdAt", "DESC"]],
    });

    if (transaction) {
      return {
        amount: parseFloat(transaction.amount) || 0,
        date: transaction.createdAt,
        type: 'transaction',
        invoiceId: transaction.trxId  // Use trxId as invoiceId
      };
    }

    return { 
      amount: 0, 
      date: null, 
      type: null, 
      discount: 0,
      invoiceId: null 
    };
  } catch (error) {
    return { 
      amount: 0, 
      date: null, 
      type: null, 
      discount: 0,
      invoiceId: null 
    };
  }
};

//! Helper function to calculate discount from payment
const calculateDiscount = (payment) => {
  if (payment && payment.discount) {
    return parseFloat(payment.discount) || 0;
  }
  return 0;
};

//! 1. INVOICE SUMMARY REPORT
const getInvoiceSummaryReport = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      location,
      area,
      zone,
      packageId,
      status,
      billingMonth,
      billingYear,
      page = 1,
      limit = 100,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where clause for clients
    const clientWhereClause = { 
      role: "client", 
      isFreeClient: false
    };
    if (location) clientWhereClause.location = location;
    if (zone) clientWhereClause.location = zone;
    if (area) clientWhereClause.area = area;
    if (packageId) clientWhereClause.package = packageId;
    if (status) clientWhereClause.status = status;

    // Get total client count
    const totalClients = await ClientInformation.count({ where: clientWhereClause });

    // Get all clients based on filters with pagination
    const clients = await ClientInformation.findAll({
      where: clientWhereClause,
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
      order: [["fullName", "ASC"]],
      limit: limitNumber,
      offset: offset,
    });

    // Determine which month to generate invoices for
    let targetBillingMonth, targetBillingYear;
    
    if (billingMonth && billingYear) {
      targetBillingMonth = billingMonth.padStart(2, '0');
      targetBillingYear = billingYear;
    } else {
      const now = new Date();
      targetBillingMonth = (now.getMonth() + 1).toString().padStart(2, '0');
      targetBillingYear = now.getFullYear().toString();
    }

    console.log(`Generating report for: ${targetBillingYear}-${targetBillingMonth}`);

    // Generate invoices for each client
    const invoices = await Promise.all(
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

        // Get payment for this month
        const payment = await getPaymentForMonth(
          clientData.userId,
          targetBillingMonth, 
          targetBillingYear
        );

        // Calculate due for this month
        const amount = monthlyBill;
        const paid = payment.amount;
        const due = Math.max(0, amount - paid);

        const billingMonthDisplay = `${targetBillingYear}-${targetBillingMonth}`;

        return {
          sl: offset + index + 1,
          invoiceNo: payment.invoiceId || null,
          clientName: clientData.fullName,
          mobile: clientData.mobileNo,
          zone: clientData.location || "N/A",
          area: clientData.area || "N/A",
          package: packageName,
          billingMonth: billingMonthDisplay,
          amount: amount.toFixed(2),
          paid: paid.toFixed(2),
          due: due.toFixed(2),
          paymentType: payment.type || 'none',
          paymentDate: payment.date ? formatDate(payment.date) : null,
          paymentReference: payment.invoiceId || null,
        };
      })
    );

    // ===== NEW: Filter invoices by date range if startDate and endDate are provided =====
    let filteredInvoices = invoices;
    
    if (startDate || endDate) {
      filteredInvoices = invoices.filter(invoice => {
        // Parse the billing month (format: "2026-02")
        const [year, month] = invoice.billingMonth.split('-').map(Number);
        const invoiceDate = new Date(year, month - 1, 1); // First day of the billing month
        
        let isAfterStart = true;
        let isBeforeEnd = true;
        
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          // Compare the billing month with start date (consider the entire month)
          const startYearMonth = new Date(start.getFullYear(), start.getMonth(), 1);
          isAfterStart = invoiceDate >= startYearMonth;
        }
        
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          // Compare the billing month with end date (consider the entire month)
          const endYearMonth = new Date(end.getFullYear(), end.getMonth(), 1);
          isBeforeEnd = invoiceDate <= endYearMonth;
        }
        
        return isAfterStart && isBeforeEnd;
      });
    }
    // ===== END NEW =====

    // Calculate summary totals - Use filteredInvoices instead of invoices
    const totalBilling = filteredInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
    const totalCollected = filteredInvoices.reduce((sum, inv) => sum + parseFloat(inv.paid), 0);
    const totalDue = filteredInvoices.reduce((sum, inv) => sum + parseFloat(inv.due), 0);
    const collectionRate = totalBilling > 0 ? ((totalCollected / totalBilling) * 100).toFixed(2) : "0.00";

    // Get unique filter options
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

    // Generate available billing months (last 12 months)
    const billingMonths = [];
    const billingYears = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString();
      if (!billingMonths.includes(month)) billingMonths.push(month);
      if (!billingYears.includes(year)) billingYears.push(year);
    }
    billingMonths.sort();
    billingYears.sort((a, b) => b - a);

    res.status(200).json({
      success: true,
      data: {
        reportTitle: "Invoice Summary Report",
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
        invoices: filteredInvoices, // Use filteredInvoices here
      },
      summary: {
        totalInvoices: filteredInvoices.length, // Use filteredInvoices length
        totalBilling: totalBilling.toFixed(2),
        totalCollected: totalCollected.toFixed(2),
        totalDue: totalDue.toFixed(2),
        collectionRate: collectionRate + "%",
      },
      filters: {
        zones: zones.map(z => z.location).filter(Boolean),
        areas: areas.map(a => a.area).filter(Boolean),
        packages: packages.map(p => ({ id: p.id, name: p.packageName })),
        billingMonths: billingMonths,
        billingYears: billingYears,
      },
      pagination: {
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
        totalItems: filteredInvoices.length, // Use filteredInvoices length
        totalPages: Math.ceil(filteredInvoices.length / limitNumber),
        hasNextPage: pageNumber < Math.ceil(filteredInvoices.length / limitNumber),
        hasPreviousPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error("Error in invoice summary report:", error);
    next(error);
  }
};

//! 2. INVOICE DETAILS REPORT
const getInvoiceDetailsReport = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      location,
      area,
      zone,
      packageId,
      status,
      billingMonth,
      billingYear,
      page = 1,
      limit = 100,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where clause for clients
    const clientWhereClause = { role: "client", isFreeClient: false };
    if (location) clientWhereClause.location = location;
    if (zone) clientWhereClause.location = zone;
    if (area) clientWhereClause.area = area;
    if (packageId) clientWhereClause.package = packageId;
    if (status) clientWhereClause.status = status;

    // Get all clients based on filters with pagination
    const clients = await ClientInformation.findAll({
      where: clientWhereClause,
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
      order: [["fullName", "ASC"]],
      limit: limitNumber,
      offset: offset,
    });

    // Determine which month to generate invoices for
    let targetBillingMonth, targetBillingYear;
    
    if (billingMonth && billingYear) {
      targetBillingMonth = billingMonth.padStart(2, '0');
      targetBillingYear = billingYear;
    } else {
      const now = new Date();
      targetBillingMonth = (now.getMonth() + 1).toString().padStart(2, '0');
      targetBillingYear = now.getFullYear().toString();
    }

    // Generate detailed invoices for each client
    const invoices = await Promise.all(
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

        // Get payment for this month
        const payment = await getPaymentForMonth(
          clientData.userId,
          targetBillingMonth, 
          targetBillingYear
        );

        // Calculate discount from payment (will be 0 for transactions, actual discount for employee payments)
        const discount = calculateDiscount(payment);

        // Calculate totals
        const currentBill = monthlyBill;
        const total = currentBill - discount;
        const paid = payment.amount;
        
        const invoiceDate = payment.date ? formatDate(payment.date) : null;

        return {
          sl: offset + index + 1,
          invoiceNo: payment.invoiceId || null,
          invoiceDate: invoiceDate,
          clientName: clientData.fullName,
          mobile: clientData.mobileNo,
          zone: clientData.location || "N/A",
          area: clientData.area || "N/A",
          package: packageName,
          currentBill: currentBill.toFixed(2),
          discount: discount.toFixed(2), // This will show the discount from employee payments
          total: total.toFixed(2),
          paid: paid.toFixed(2),
          paymentType: payment.type || 'none',
          paymentDate: payment.date ? formatDate(payment.date) : null,
          paymentReference: payment.invoiceId || null,
        };
      })
    );

    // ===== NEW: Filter invoices by date range if startDate and endDate are provided =====
    let filteredInvoices = invoices;
    
    if (startDate || endDate) {
      filteredInvoices = invoices.filter(invoice => {
        // Parse the billing month (format: "2026-02")
        const [year, month] = invoice.billingMonth.split('-').map(Number);
        const invoiceDate = new Date(year, month - 1, 1); // First day of the billing month
        
        let isAfterStart = true;
        let isBeforeEnd = true;
        
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          // Compare the billing month with start date (consider the entire month)
          const startYearMonth = new Date(start.getFullYear(), start.getMonth(), 1);
          isAfterStart = invoiceDate >= startYearMonth;
        }
        
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          // Compare the billing month with end date (consider the entire month)
          const endYearMonth = new Date(end.getFullYear(), end.getMonth(), 1);
          isBeforeEnd = invoiceDate <= endYearMonth;
        }
        
        return isAfterStart && isBeforeEnd;
      });
    }
    // ===== END NEW =====

    // Calculate summary totals using filtered invoices
    const totalCurrentBill = filteredInvoices.reduce((sum, inv) => sum + parseFloat(inv.currentBill), 0);
    const totalDiscount = filteredInvoices.reduce((sum, inv) => sum + parseFloat(inv.discount), 0);
    const totalAmount = filteredInvoices.reduce((sum, inv) => sum + parseFloat(inv.total), 0);
    const totalCollected = filteredInvoices.reduce((sum, inv) => sum + parseFloat(inv.paid), 0);
    const collectionRate = totalAmount > 0 ? ((totalCollected / totalAmount) * 100).toFixed(2) : "0.00";

    // Get unique filter options
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

    // Generate available billing months (last 12 months)
    const billingMonths = [];
    const billingYears = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString();
      if (!billingMonths.includes(month)) billingMonths.push(month);
      if (!billingYears.includes(year)) billingYears.push(year);
    }
    billingMonths.sort();
    billingYears.sort((a, b) => b - a);

    res.status(200).json({
      success: true,
      data: {
        reportTitle: "Invoice Details Report",
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
        invoices: filteredInvoices, // Use filtered invoices
      },
      summary: {
        totalInvoices: filteredInvoices.length, // Use filtered count
        totalCurrentBill: totalCurrentBill.toFixed(2),
        totalDiscount: totalDiscount.toFixed(2), // This will show total discounts
        totalAmount: totalAmount.toFixed(2),
        totalCollected: totalCollected.toFixed(2),
        collectionRate: collectionRate + "%",
      },
      filters: {
        zones: zones.map(z => z.location).filter(Boolean),
        areas: areas.map(a => a.area).filter(Boolean),
        packages: packages.map(p => ({ id: p.id, name: p.packageName })),
        billingMonths: billingMonths,
        billingYears: billingYears,
        statuses: ["active", "pending", "inactive"],
      },
      pagination: {
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
        totalItems: filteredInvoices.length, // Use filtered count
        totalPages: Math.ceil(filteredInvoices.length / limitNumber),
        hasNextPage: pageNumber < Math.ceil(filteredInvoices.length / limitNumber),
        hasPreviousPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error("Error in invoice details report:", error);
    next(error);
  }
};

module.exports = {
  getInvoiceSummaryReport,
  getInvoiceDetailsReport,
};