const { Op } = require("sequelize");
const sequelize = require("../../database/connection");
const AuthorityInformation = require("../../models/Authentication/authority.model");
const Package = require("../../models/package/package.model");
const ClientInformation = require("../../models/Authentication/client.model");
const { getPackageDetails } = require("../auth/signup");

// Helper function to parse date filters
const parseDateFilters = (startDate, endDate, field = "createdAt") => {
  const filter = {};
  if (startDate || endDate) {
    filter[field] = {};
    if (startDate) {
      const start = new Date(startDate);
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

//! 2. CLIENT STATUS REPORT - UPDATED
const getClientStatusReport = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      location,
      area,
      customerType,
      packageId,
      dateType = "createdAt",
    } = req.query;

    const whereClause = { role: "client" };

    // Date filter
    if (startDate || endDate) {
      const dateFilter = parseDateFilters(startDate, endDate, dateType);
      Object.assign(whereClause, dateFilter);
    }

    if (location) whereClause.location = location;
    if (area) whereClause.area = area;
    if (customerType) whereClause.customerType = customerType;
    if (packageId) whereClause.package = packageId;

    // Detailed status breakdown with client information
    const statusBreakdown = await ClientInformation.findAll({
      where: whereClause,
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("costForPackage")), "totalRevenue"],
        [sequelize.fn("AVG", sequelize.col("costForPackage")), "avgRevenue"],
        [
          sequelize.literal(`COUNT(CASE WHEN isFreeClient = true THEN 1 END)`),
          "freeClients",
        ],
      ],
      group: ["status"],
      order: [[sequelize.literal("count"), "DESC"]],
    });

    // Convert status breakdown to simple objects (no sampleClients)
    const statusBreakdownSimple = statusBreakdown.map((statusGroup) => {
      const statusData = statusGroup.toJSON();
      // Return only the basic status data, no sampleClients
      return {
        status: statusData.status,
        count: statusData.count,
        totalRevenue: statusData.totalRevenue,
        avgRevenue: statusData.avgRevenue,
        freeClients: statusData.freeClients,
      };
    });

    // Status change timeline (last 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // First, get the status change dates
    const statusChangeDates = await ClientInformation.findAll({
      where: {
        role: "client",
        updatedAt: { [Op.gte]: ninetyDaysAgo },
      },
      attributes: [
        [sequelize.fn("DATE", sequelize.col("updatedAt")), "date"],
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: [sequelize.fn("DATE", sequelize.col("updatedAt")), "status"],
      order: [[sequelize.fn("DATE", sequelize.col("updatedAt")), "DESC"]],
      limit: 30,
    });

    // Get detailed client information for each status change date
    const statusChangesWithDetails = await Promise.all(
      statusChangeDates.map(async (change) => {
        const changeData = change.toJSON();

        // Get clients who had status changes on this date
        const dateStart = new Date(changeData.date);
        const dateEnd = new Date(changeData.date);
        dateEnd.setHours(23, 59, 59, 999);

        const changedClients = await ClientInformation.findAll({
          where: {
            role: "client",
            status: changeData.status,
            updatedAt: {
              [Op.gte]: dateStart,
              [Op.lte]: dateEnd,
            },
          },
          attributes: [
            "id",
            "userId",
            "fullName",
            "mobileNo",
            "email",
            "photo",
            "status",
            "location",
            "area",
            "customerType",
            "package",
            "createdAt",
            "updatedAt",
          ],
          limit: 20, // Limit to prevent too much data
          order: [["updatedAt", "DESC"]],
        });

        // Transform clients to include package details
        const transformedClients = await Promise.all(
          changedClients.map(async (client) => {
            const clientData = client.toJSON();

            // Get package details if package exists
            if (clientData.package) {
              const packageDetails = await getPackageDetails(
                clientData.package,
              );
              if (packageDetails) {
                clientData.packageDetails = packageDetails;
                clientData.packageName = packageDetails.packageName;
              }
            }

            return {
              id: clientData.id,
              userId: clientData.userId,
              fullName: clientData.fullName,
              mobileNo: clientData.mobileNo,
              email: clientData.email,
              photo: clientData.photo,
              status: clientData.status,
              location: clientData.location,
              area: clientData.area,
              customerType: clientData.customerType,
              packageName: clientData.packageName,
              createdAt: clientData.createdAt,
              updatedAt: clientData.updatedAt,
            };
          }),
        );

        return {
          date: changeData.date,
          status: changeData.status,
          count: changeData.count,
          clients: transformedClients,
        };
      }),
    );

    // Monthly status trend for the last 12 months
    const monthlyStatus = await ClientInformation.findAll({
      where: whereClause,
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m"),
          "month",
        ],
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("costForPackage")), "revenue"],
      ],
      group: [
        sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m"),
        "status",
      ],
      order: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m"),
          "DESC",
        ],
        ["status", "ASC"],
      ],
      limit: 36,
    });

    // Location-wise status distribution
    const locationStatus = await ClientInformation.findAll({
      where: whereClause,
      attributes: [
        "location",
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("AVG", sequelize.col("costForPackage")), "avgRevenue"],
      ],
      group: ["location", "status"],
      order: [
        ["location", "ASC"],
        [sequelize.literal("count"), "DESC"],
      ],
    });

    // Package-wise status distribution
    // First get all packages referenced by clients in the filtered results
    const packageStatusRaw = await ClientInformation.findAll({
      where: whereClause,
      attributes: [
        "package",
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["package", "status"],
      order: [[sequelize.literal("count"), "DESC"]],
    });

    // Then get package details for each package
    const packageStatus = await Promise.all(
      packageStatusRaw.map(async (pkgStatus) => {
        const pkgData = pkgStatus.toJSON();

        // Get package details
        let packageDetails = null;
        if (pkgData.package) {
          packageDetails = await getPackageDetails(pkgData.package);
        }

        return {
          packageId: pkgData.package,
          packageName: packageDetails
            ? packageDetails.packageName
            : "Unknown/No Package",
          packagePrice: packageDetails ? packageDetails.packagePrice : 0,
          status: pkgData.status,
          count: pkgData.count,
        };
      }),
    );

    // Status transition matrix (if you have a status_change_log table)
    // Note: This will only work if you have a status_change_log table
    let statusTransitions = [];
    try {
      // Check if the table exists first
      const tableExists = await sequelize.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'status_change_log'
        )`,
        { type: sequelize.QueryTypes.SELECT },
      );

      if (tableExists && tableExists[0] && tableExists[0].exists) {
        statusTransitions = await sequelize.query(
          `
          SELECT 
            old_status,
            new_status,
            COUNT(*) as transition_count,
            GROUP_CONCAT(DISTINCT user_id) as affected_users
          FROM status_change_log
          WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          GROUP BY old_status, new_status
          ORDER BY transition_count DESC
        `,
          { type: sequelize.QueryTypes.SELECT },
        );
      }
    } catch (error) {
      console.warn(
        "Status change log table not found or error querying it:",
        error.message,
      );
      // Continue without status transitions
    }

    // Calculate summary statistics
    const summaryData = {
      totalStatuses: statusBreakdown.length,
      totalClients: statusBreakdown.reduce(
        (sum, item) => sum + parseInt(item.dataValues.count || 0),
        0,
      ),
      totalRevenue: statusBreakdown.reduce(
        (sum, item) => sum + parseFloat(item.dataValues.totalRevenue || 0),
        0,
      ),
      averageRevenuePerClient: 0,
      activeClients: 0,
      pendingClients: 0,
      inactiveClients: 0,
    };

    // Calculate detailed statistics
    statusBreakdown.forEach((item) => {
      const status = item.dataValues.status;
      const count = parseInt(item.dataValues.count || 0);

      if (status === "active") {
        summaryData.activeClients = count;
      } else if (status === "pending") {
        summaryData.pendingClients = count;
      } else if (status === "inactive") {
        summaryData.inactiveClients = count;
      }
    });

    // Calculate average revenue per client
    if (summaryData.totalClients > 0) {
      summaryData.averageRevenuePerClient =
        summaryData.totalRevenue / summaryData.totalClients;
    }

    res.status(200).json({
      success: true,
      data: {
        statusBreakdown: statusBreakdownSimple, // Use the simple version without sampleClients
        statusChanges: statusChangesWithDetails, // Now with detailed client objects
        monthlyStatus: monthlyStatus.map((item) => item.toJSON()),
        locationStatus: locationStatus.map((item) => item.toJSON()),
        packageStatus,
        statusTransitions,
      },
      summary: {
        ...summaryData,
        averageRevenuePerClient: summaryData.averageRevenuePerClient.toFixed(2),
        conversionRate:
          summaryData.totalClients > 0
            ? (
                (summaryData.activeClients / summaryData.totalClients) *
                100
              ).toFixed(2) + "%"
            : "0%",
      },
      filters: {
        startDate,
        endDate,
        location,
        area,
        customerType,
        packageId,
        dateType,
      },
    });
  } catch (error) {
    console.error("Error in client status report:", error);
    next(error);
  }
};

//! 3. CLIENT PACKAGE DISTRIBUTION REPORT - UPDATED
const getClientPackageDistributionReport = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      status,
      location,
      area,
      packageType,
      duration,
      dateType = "createdAt",
      page = 1,
      limit = 20,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const whereClause = { role: "client" };
    if (status) whereClause.status = status;
    if (location) whereClause.location = location;
    if (area) whereClause.area = area;

    // Date filter
    if (startDate || endDate) {
      const dateFilter = parseDateFilters(startDate, endDate, dateType);
      Object.assign(whereClause, dateFilter);
    }

    // Get all packages with filters
    const packageWhereClause = {};
    if (packageType) packageWhereClause.packageType = packageType;
    if (duration) packageWhereClause.duration = duration;

    const packages = await Package.findAll({
      where: packageWhereClause,
      attributes: [
        "id",
        "packageName",
        "packageBandwidth",
        "packagePrice",
        "duration",
        "packageType",
        "downloadSpeed",
        "uploadSpeed",
        "dataLimit",
        "installationFee",
        "discount",
        "status",
      ],
      order: [["packagePrice", "ASC"]],
    });

    // Get detailed distribution per package
    const packageDistribution = await Promise.all(
      packages.map(async (pkg) => {
        const clientCount = await ClientInformation.count({
          where: {
            ...whereClause,
            package: pkg.id,
          },
        });

        const activeClients = await ClientInformation.count({
          where: {
            ...whereClause,
            package: pkg.id,
            status: "active",
          },
        });

        const pendingClients = await ClientInformation.count({
          where: {
            ...whereClause,
            package: pkg.id,
            status: "pending",
          },
        });

        const freeClients = await ClientInformation.count({
          where: {
            ...whereClause,
            package: pkg.id,
            isFreeClient: true,
          },
        });

        const monthlyRevenue = activeClients * (parseFloat(pkg.packagePrice) || 0);
        const annualRevenue = monthlyRevenue * 12;

        // Get ALL clients for this package with pagination
        const { count: totalHolderClients, rows: holderClients } =
          await ClientInformation.findAndCountAll({
            where: {
              ...whereClause,
              package: pkg.id,
            },
            attributes: [
              "id",
              "userId",
              "fullName",
              "mobileNo",
              "email",
              "photo",
              "status",
              "location",
              "area",
              "createdAt",
              "costForPackage",
              "customerType",
              "isFreeClient",
            ],
            limit: limitNumber,
            offset: offset,
            order: [["createdAt", "DESC"]],
          });

        // Transform holder clients to include package details
        const transformedHolderClients = await Promise.all(
          holderClients.map(async (client) => {
            const clientData = client.toJSON();

            // Get package details if package exists
            if (clientData.package) {
              const packageDetails = await getPackageDetails(
                clientData.package,
              );
              if (packageDetails) {
                clientData.packageDetails = packageDetails;
                clientData.packageName = packageDetails.packageName;
              }
            }

            return {
              id: clientData.id,
              userId: clientData.userId,
              fullName: clientData.fullName,
              mobileNo: clientData.mobileNo,
              email: clientData.email,
              photo: clientData.photo,
              status: clientData.status,
              location: clientData.location,
              area: clientData.area,
              customerType: clientData.customerType,
              isFreeClient: clientData.isFreeClient,
              costForPackage: clientData.costForPackage,
              packageName: clientData.packageName,
              createdAt: clientData.createdAt,
            };
          }),
        );

        // Calculate growth rate
        const clientGrowthRate = await calculateGrowthRate(pkg.id, whereClause);

        return {
          packageId: pkg.id,
          packageName: pkg.packageName,
          bandwidth: pkg.packageBandwidth,
          price: parseFloat(pkg.packagePrice) || 0,
          duration: pkg.duration,
          packageType: pkg.packageType,
          downloadSpeed: pkg.downloadSpeed,
          uploadSpeed: pkg.uploadSpeed,
          dataLimit: pkg.dataLimit,
          installationFee: parseFloat(pkg.installationFee) || 0,
          discount: parseFloat(pkg.discount) || 0,
          packageStatus: pkg.status,

          totalClients: clientCount,
          activeClients: activeClients,
          pendingClients: pendingClients,
          inactiveClients: clientCount - activeClients - pendingClients,
          freeClients: freeClients,
          paidClients: clientCount - freeClients,

          estimatedMonthlyRevenue: monthlyRevenue,
          estimatedAnnualRevenue: annualRevenue,

          holderClients: transformedHolderClients,

          clientGrowthRate: clientGrowthRate,
        };
      }),
    );

    // Calculate package statistics
    const activePackageDistribution = packageDistribution.filter(
      (pkg) => pkg.packageStatus === "Active",
    );

    const totalSummary = {
      totalPackages: packages.length,
      activePackages: activePackageDistribution.length,
      totalClients: packageDistribution.reduce(
        (sum, pkg) => sum + pkg.totalClients,
        0,
      ),
      totalActiveClients: packageDistribution.reduce(
        (sum, pkg) => sum + pkg.activeClients,
        0,
      ),
      totalMonthlyRevenue: packageDistribution.reduce(
        (sum, pkg) => sum + pkg.estimatedMonthlyRevenue,
        0,
      ),
      totalAnnualRevenue: packageDistribution.reduce(
        (sum, pkg) => sum + pkg.estimatedAnnualRevenue,
        0,
      ),
      averageClientsPerPackage:
        packages.length > 0
          ? packageDistribution.reduce(
              (sum, pkg) => sum + pkg.totalClients,
              0,
            ) / packages.length
          : 0,
      mostPopularPackage:
        packageDistribution.length > 0
          ? packageDistribution.reduce((max, pkg) =>
              pkg.totalClients > max.totalClients ? pkg : max,
            )
          : null,
    };

    // Package performance analysis
    const packagePerformance = packageDistribution.map((pkg) => {
      const marketShare =
        totalSummary.totalClients > 0
          ? ((pkg.totalClients / totalSummary.totalClients) * 100).toFixed(2)
          : 0;

      const revenueShare =
        totalSummary.totalMonthlyRevenue > 0
          ? (
              (pkg.estimatedMonthlyRevenue / totalSummary.totalMonthlyRevenue) *
              100
            ).toFixed(2)
          : 0;

      return {
        packageName: pkg.packageName,
        marketShare: parseFloat(marketShare),
        revenueShare: parseFloat(revenueShare),
        clientRetentionRate:
          pkg.activeClients > 0
            ? ((pkg.activeClients / pkg.totalClients) * 100).toFixed(2)
            : 0,
      };
    });

    // Get clients without packages
    const clientsWithoutPackage = await ClientInformation.findAll({
      where: {
        ...whereClause,
        package: null,
      },
      attributes: [
        "id",
        "userId",
        "fullName",
        "mobileNo",
        "email",
        "photo",
        "status",
        "location",
        "area",
        "createdAt",
        "customerType",
      ],
      limit: 10,
      order: [["createdAt", "DESC"]],
    });

    // Transform clients without packages
    const transformedClientsWithoutPackage = clientsWithoutPackage.map(
      (client) => {
        const clientData = client.toJSON();
        return {
          id: clientData.id,
          userId: clientData.userId,
          fullName: clientData.fullName,
          mobileNo: clientData.mobileNo,
          email: clientData.email,
          photo: clientData.photo,
          status: clientData.status,
          location: clientData.location,
          area: clientData.area,
          customerType: clientData.customerType,
          createdAt: clientData.createdAt,
        };
      },
    );

    res.status(200).json({
      success: true,
      data: {
        packageDistribution,
        packagePerformance,
        clientsWithoutPackage: transformedClientsWithoutPackage,
      },
      summary: {
        ...totalSummary,
        mostPopularPackage: totalSummary.mostPopularPackage
          ? {
              packageId: totalSummary.mostPopularPackage.packageId,
              packageName: totalSummary.mostPopularPackage.packageName,
              totalClients: totalSummary.mostPopularPackage.totalClients,
              activeClients: totalSummary.mostPopularPackage.activeClients,
              estimatedMonthlyRevenue:
                totalSummary.mostPopularPackage.estimatedMonthlyRevenue,
            }
          : null,
      },
      analysis: {
        packagePerformance,
        recommendation: generatePackageRecommendations(packageDistribution),
      },
      filters: {
        startDate,
        endDate,
        status,
        location,
        area,
        packageType,
        duration,
        dateType,
        page: pageNumber,
        limit: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error in package distribution report:", error);
    next(error);
  }
};

// Helper function to calculate growth rate
async function calculateGrowthRate(packageId, whereClause) {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

  const currentMonthCount = await ClientInformation.count({
    where: {
      ...whereClause,
      package: packageId,
      createdAt: {
        [Op.gte]: lastMonth,
        [Op.lt]: now,
      },
    },
  });

  const previousMonthCount = await ClientInformation.count({
    where: {
      ...whereClause,
      package: packageId,
      createdAt: {
        [Op.gte]: twoMonthsAgo,
        [Op.lt]: lastMonth,
      },
    },
  });

  if (previousMonthCount === 0) return currentMonthCount > 0 ? 100 : 0;

  return (
    ((currentMonthCount - previousMonthCount) / previousMonthCount) *
    100
  ).toFixed(2);
}

// Helper function to generate package recommendations
function generatePackageRecommendations(packageDistribution) {
  const recommendations = [];

  // Find underperforming packages
  const underperforming = packageDistribution.filter(
    (pkg) => pkg.totalClients < 5 && pkg.packageStatus === "Active",
  );

  if (underperforming.length > 0) {
    recommendations.push({
      type: "WARNING",
      message: `${underperforming.length} packages have less than 5 clients: `,
      packages: underperforming.map((pkg) => pkg.packageName),
    });
  }

  // Find most profitable packages
  const profitable = packageDistribution
    .filter((pkg) => pkg.estimatedMonthlyRevenue > 0)
    .sort((a, b) => b.estimatedMonthlyRevenue - a.estimatedMonthlyRevenue)
    .slice(0, 3);

  if (profitable.length > 0) {
    recommendations.push({
      type: "SUCCESS",
      message: "Top 3 most profitable packages:",
      packages: profitable.map(
        (pkg) => `${pkg.packageName} ($${pkg.estimatedMonthlyRevenue}/month)`,
      ),
    });
  }

  return recommendations;
}

// Helper function to calculate growth rate
async function calculateGrowthRate(packageId, whereClause) {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

  const currentMonthCount = await ClientInformation.count({
    where: {
      ...whereClause,
      package: packageId,
      createdAt: {
        [Op.gte]: lastMonth,
        [Op.lt]: now,
      },
    },
  });

  const previousMonthCount = await ClientInformation.count({
    where: {
      ...whereClause,
      package: packageId,
      createdAt: {
        [Op.gte]: twoMonthsAgo,
        [Op.lt]: lastMonth,
      },
    },
  });

  if (previousMonthCount === 0) return currentMonthCount > 0 ? 100 : 0;

  return (
    ((currentMonthCount - previousMonthCount) / previousMonthCount) *
    100
  ).toFixed(2);
}

// Helper function to generate package recommendations
function generatePackageRecommendations(packageDistribution) {
  const recommendations = [];

  // Find underperforming packages
  const underperforming = packageDistribution.filter(
    (pkg) => pkg.totalClients < 5 && pkg.packageStatus === "Active",
  );

  if (underperforming.length > 0) {
    recommendations.push({
      type: "WARNING",
      message: `${underperforming.length} packages have less than 5 clients: `,
      packages: underperforming.map((pkg) => pkg.packageName),
    });
  }

  // Find most profitable packages
  const profitable = packageDistribution
    .filter((pkg) => pkg.estimatedMonthlyRevenue > 0)
    .sort((a, b) => b.estimatedMonthlyRevenue - a.estimatedMonthlyRevenue)
    .slice(0, 3);

  if (profitable.length > 0) {
    recommendations.push({
      type: "SUCCESS",
      message: "Top 3 most profitable packages:",
      packages: profitable.map(
        (pkg) => `${pkg.packageName} ($${pkg.estimatedMonthlyRevenue}/month)`,
      ),
    });
  }

  return recommendations;
}

//! 4. CLIENT LOCATION REPORT - UPDATED
const getClientLocationReport = async (req, res, next) => {
  try {
    const {
      status,
      customerType,
      packageId,
      startDate,
      endDate,
      dateType = "createdAt",
      page = 1,
      limit = 20,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const whereClause = { role: "client" };
    if (status) whereClause.status = status;
    if (customerType) whereClause.customerType = customerType;
    if (packageId) whereClause.package = packageId;

    // Date filter
    if (startDate || endDate) {
      const dateFilter = parseDateFilters(startDate, endDate, dateType);
      Object.assign(whereClause, dateFilter);
    }

    // 1. LOCATION SUMMARY STATISTICS
    const locationSummary = await ClientInformation.findAll({
      where: whereClause,
      attributes: [
        "location",
        [sequelize.fn("COUNT", sequelize.col("id")), "totalClients"],
        [
          sequelize.literal(
            `SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END)`,
          ),
          "activeClients",
        ],
        [
          sequelize.literal(
            `SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END)`,
          ),
          "pendingClients",
        ],
        [
          sequelize.literal(
            `SUM(CASE WHEN isFreeClient = true THEN 1 ELSE 0 END)`,
          ),
          "freeClients",
        ],
        [sequelize.fn("SUM", sequelize.col("costForPackage")), "totalRevenue"],
        [
          sequelize.fn("AVG", sequelize.col("costForPackage")),
          "avgRevenuePerClient",
        ],
        [sequelize.literal(`COUNT(DISTINCT area)`), "totalAreas"],
      ],
      group: ["location"],
      order: [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]],
      having: sequelize.where(
        sequelize.fn("COUNT", sequelize.col("id")),
        ">",
        0,
      ),
    });

    // 2. AREA-WISE BREAKDOWN FOR EACH LOCATION
    const areaBreakdown = await ClientInformation.findAll({
      where: whereClause,
      attributes: [
        "location",
        "area",
        [sequelize.fn("COUNT", sequelize.col("id")), "totalClients"],
        [
          sequelize.literal(
            `SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END)`,
          ),
          "activeClients",
        ],
        [
          sequelize.literal(
            `SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END)`,
          ),
          "pendingClients",
        ],
        [sequelize.fn("SUM", sequelize.col("costForPackage")), "totalRevenue"],
        [
          sequelize.literal(`COUNT(DISTINCT customerType)`),
          "customerTypeCount",
        ],
      ],
      group: ["location", "area"],
      order: [
        ["location", "ASC"],
        [sequelize.fn("COUNT", sequelize.col("id")), "DESC"],
      ],
    });

    // 3. PACKAGE DISTRIBUTION BY LOCATION
    const packageDistribution = await ClientInformation.findAll({
      where: whereClause,
      attributes: [
        "location",
        "package",
        [sequelize.fn("COUNT", sequelize.col("id")), "clientCount"],
        [sequelize.fn("SUM", sequelize.col("costForPackage")), "revenue"],
      ],
      group: ["location", "package"],
      order: [
        ["location", "ASC"],
        [sequelize.fn("COUNT", sequelize.col("id")), "DESC"],
      ],
    });

    // 4. LOCATION GROWTH TREND (LAST 12 MONTHS)
    const locationGrowth = await ClientInformation.findAll({
      where: whereClause,
      attributes: [
        "location",
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m"),
          "month",
        ],
        [sequelize.fn("COUNT", sequelize.col("id")), "newClients"],
        [
          sequelize.literal(
            `SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END)`,
          ),
          "activeNewClients",
        ],
      ],
      group: [
        "location",
        sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m"),
      ],
      order: [
        ["location", "ASC"],
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m"),
          "DESC",
        ],
      ],
      limit: 60,
    });

    // 5. GET CLIENTS FOR EACH LOCATION (WITH PAGINATION)
    const clientsByLocation = await Promise.all(
      locationSummary.map(async (locationItem) => {
        const locationData = locationItem.toJSON();

        const { count: totalLocationClients, rows: locationClients } =
          await ClientInformation.findAndCountAll({
            where: {
              ...whereClause,
              location: locationData.location,
            },
            attributes: [
              "id",
              "userId",
              "fullName",
              "mobileNo",
              "email",
              "photo",
              "status",
              "customerType",
              "package",
              "costForPackage",
              "area",
              "isFreeClient",
              "createdAt",
            ],
            limit: limitNumber,
            offset: offset,
            order: [["createdAt", "DESC"]],
          });

        // Transform clients with package details
        const transformedClients = await Promise.all(
          locationClients.map(async (client) => {
            const clientData = client.toJSON();

            // Get package details if package exists
            if (clientData.package) {
              const packageDetails = await getPackageDetails(
                clientData.package,
              );
              if (packageDetails) {
                clientData.packageName = packageDetails.packageName;
                clientData.packagePrice = packageDetails.packagePrice;
              }
            }

            return {
              id: clientData.id,
              userId: clientData.userId,
              fullName: clientData.fullName,
              mobileNo: clientData.mobileNo,
              email: clientData.email,
              photo: clientData.photo,
              status: clientData.status,
              customerType: clientData.customerType,
              packageName: clientData.packageName,
              costForPackage: clientData.costForPackage,
              area: clientData.area,
              isFreeClient: clientData.isFreeClient,
              createdAt: clientData.createdAt,
            };
          }),
        );

        // Get areas for this location
        const locationAreas = areaBreakdown
          .filter((area) => area.dataValues.location === locationData.location)
          .map((area) => ({
            area: area.dataValues.area,
            totalClients: parseInt(area.dataValues.totalClients || 0),
            activeClients: parseInt(area.dataValues.activeClients || 0),
            totalRevenue: parseFloat(area.dataValues.totalRevenue || 0),
            customerTypeCount: parseInt(area.dataValues.customerTypeCount || 0),
          }));

        // Get growth data for this location
        const locationGrowthData = locationGrowth
          .filter(
            (growth) => growth.dataValues.location === locationData.location,
          )
          .map((growth) => ({
            month: growth.dataValues.month,
            newClients: parseInt(growth.dataValues.newClients || 0),
            activeNewClients: parseInt(growth.dataValues.activeNewClients || 0),
          }));

        return {
          location: locationData.location,
          summary: {
            totalClients: parseInt(locationData.totalClients || 0),
            activeClients: parseInt(locationData.activeClients || 0),
            pendingClients: parseInt(locationData.pendingClients || 0),
            freeClients: parseInt(locationData.freeClients || 0),
            totalRevenue: parseFloat(locationData.totalRevenue || 0),
            avgRevenuePerClient: parseFloat(
              locationData.avgRevenuePerClient || 0,
            ),
            totalAreas: parseInt(locationData.totalAreas || 0),
            coverageScore:
              parseInt(locationData.totalClients) > 0
                ? (
                    (parseInt(locationData.activeClients) /
                      parseInt(locationData.totalClients)) *
                    100
                  ).toFixed(2)
                : 0,
          },
          areas: locationAreas,
          clients: transformedClients,
          growth: locationGrowthData,
        };
      }),
    );

    // 6. OVERALL SUMMARY STATISTICS
    const overallSummary = {
      totalLocations: locationSummary.length,
      totalClients: locationSummary.reduce(
        (sum, loc) => sum + parseInt(loc.dataValues.totalClients || 0),
        0,
      ),
      totalActiveClients: locationSummary.reduce(
        (sum, loc) => sum + parseInt(loc.dataValues.activeClients || 0),
        0,
      ),
      totalRevenue: locationSummary.reduce(
        (sum, loc) => sum + parseFloat(loc.dataValues.totalRevenue || 0),
        0,
      ),
      totalAreas: new Set(areaBreakdown.map((area) => area.dataValues.area))
        .size,
      avgClientsPerLocation:
        locationSummary.length > 0
          ? locationSummary.reduce(
              (sum, loc) => sum + parseInt(loc.dataValues.totalClients || 0),
              0,
            ) / locationSummary.length
          : 0,
      avgRevenuePerLocation:
        locationSummary.length > 0
          ? locationSummary.reduce(
              (sum, loc) => sum + parseFloat(loc.dataValues.totalRevenue || 0),
              0,
            ) / locationSummary.length
          : 0,
    };

    // 7. TOP PERFORMING LOCATIONS
    const topPerformingLocations = locationSummary
      .map((loc) => ({
        location: loc.dataValues.location,
        totalClients: parseInt(loc.dataValues.totalClients || 0),
        totalRevenue: parseFloat(loc.dataValues.totalRevenue || 0),
        coverageScore:
          parseInt(loc.dataValues.totalClients) > 0
            ? (
                (parseInt(loc.dataValues.activeClients) /
                  parseInt(loc.dataValues.totalClients)) *
                100
              ).toFixed(2)
            : 0,
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);

    // 8. AREA DENSITY ANALYSIS
    const areaDensity = areaBreakdown
      .map((area) => ({
        location: area.dataValues.location,
        area: area.dataValues.area,
        clientDensity: parseInt(area.dataValues.totalClients || 0),
        revenueDensity: parseFloat(area.dataValues.totalRevenue || 0),
      }))
      .sort((a, b) => b.clientDensity - a.clientDensity)
      .slice(0, 10);

    res.status(200).json({
      success: true,
      report: {
        period: {
          startDate: startDate || "All time",
          endDate: endDate || "Current",
          dateType: dateType,
        },
        filters: {
          status,
          customerType,
          packageId,
        },
        summary: {
          overall: overallSummary,
          topPerformingLocations,
          areaDensity,
        },
        locations: clientsByLocation,
        analytics: {
          locationCount: locationSummary.length,
          areaCount: overallSummary.totalAreas,
          clientDistribution: {
            byStatus: {
              active: overallSummary.totalActiveClients,
              pending: locationSummary.reduce(
                (sum, loc) =>
                  sum + parseInt(loc.dataValues.pendingClients || 0),
                0,
              ),
              free: locationSummary.reduce(
                (sum, loc) => sum + parseInt(loc.dataValues.freeClients || 0),
                0,
              ),
            },
            byLocation: locationSummary.map((loc) => ({
              location: loc.dataValues.location,
              percentage:
                overallSummary.totalClients > 0
                  ? (
                      (parseInt(loc.dataValues.totalClients) /
                        overallSummary.totalClients) *
                      100
                    ).toFixed(2) + "%"
                  : "0%",
            })),
          },
        },
      },
      pagination: {
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
        totalLocations: locationSummary.length,
        hasNextPage:
          pageNumber < Math.ceil(locationSummary.length / limitNumber),
        hasPreviousPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error("Error in client location report:", error);
    next(error);
  }
};











//! 5. REFERRAL CLIENT REPORT - UPDATED
const getReferralClientReport = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      referrerId,
      referrerType,
      status,
      dateType = "createdAt",
      page = 1,
      limit = 20,
    } = req.query;

    //! DEFINE COMMISSION AMOUNT PER ACTIVE REFERRAL (200 taka)
    const COMMISSION_PER_ACTIVE_REFERRAL = 200;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Build base where clause for referred clients
    const referredWhereClause = {
      role: "client",
      referId: { [Op.not]: null },
    };

    if (status) referredWhereClause.status = status;
    if (referrerId) referredWhereClause.referId = referrerId;

    // Date filter for referred clients
    if (startDate || endDate) {
      const dateFilter = parseDateFilters(startDate, endDate, dateType);
      Object.assign(referredWhereClause, dateFilter);
    }

    // 1. GET ALL UNIQUE REFERRERS
    const referralStats = await ClientInformation.findAll({
      where: {
        role: "client",
        referId: { [Op.not]: null },
      },
      attributes: [
        "referId",
        [sequelize.fn("COUNT", sequelize.col("id")), "referralCount"],
        [
          sequelize.literal(
            `SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END)`
          ),
          "activeReferrals",
        ],
        [
          sequelize.literal(
            `SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END)`
          ),
          "pendingReferrals",
        ],
        [
          sequelize.literal(
            `SUM(CASE WHEN status = 'active' THEN ${COMMISSION_PER_ACTIVE_REFERRAL} ELSE 0 END)`
          ),
          "totalCommission",
        ],
        [sequelize.fn("SUM", sequelize.col("costForPackage")), "totalRevenue"],
        [sequelize.fn("AVG", sequelize.col("costForPackage")), "avgRevenue"],
      ],
      group: ["referId"],
      having: sequelize.where(
        sequelize.fn("COUNT", sequelize.col("id")),
        ">",
        0,
      ),
      order: [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]],
      limit: limitNumber,
      offset: offset,
    });

    // Apply date filter to referral stats
    if (startDate || endDate) {
      const dateFilter = parseDateFilters(startDate, endDate, dateType);
      referralStats.forEach((stat) => {
        stat.where = { ...stat.where, ...dateFilter };
      });
    }

    // 2. GET DETAILED INFORMATION FOR EACH REFERRER AND THEIR REFERRALS
    const referrersWithDetails = await Promise.all(
      referralStats.map(async (stat) => {
        const referrerData = stat.toJSON();
        const referrerId = referrerData.referId;

        // Skip invalid referrer IDs
        if (!referrerId || referrerId === "N/A") {
          return null;
        }

        // Find referrer (could be client or employee)
        let referrer = await ClientInformation.findOne({
          where: { userId: referrerId },
          attributes: [
            "id",
            "userId",
            "fullName",
            "mobileNo",
            "email",
            "photo",
            "role",
            "status",
            "createdAt",
            "location",
            "customerType",
          ],
        });

        let referrerTypeDB = "client";

        if (!referrer) {
          referrer = await AuthorityInformation.findOne({
            where: { userId: referrerId },
            attributes: [
              "id",
              "fullName",
              "mobileNo",
              "email",
              "photo",
              "role",
              "status",
              "createdAt",
              "jobType",
              "baseSalary",
            ],
          });
          referrerTypeDB = "employee";
        }

        // If referrer not found, skip
        if (!referrer) {
          return null;
        }

        const referrerInfo = referrer.toJSON();

        // Get all clients referred by this referrer
        const referredClients = await ClientInformation.findAll({
          where: {
            ...referredWhereClause,
            referId: referrerId,
          },
          attributes: [
            "id",
            "userId",
            "fullName",
            "mobileNo",
            "email",
            "photo",
            "status",
            "package",
            "location",
            "area",
            "customerType",
            "costForPackage",
            "createdAt",
            "userAddedBy",
          ],
          order: [["createdAt", "DESC"]],
        });

        // Transform referred clients with package details
        const transformedReferredClients = await Promise.all(
          referredClients.map(async (client) => {
            const clientData = client.toJSON();

            // Calculate commission for this referral (200 taka for active clients)
            const commissionAmount = clientData.status === 'active' ? COMMISSION_PER_ACTIVE_REFERRAL : 0;

            // Get package details if package exists
            if (clientData.package) {
              const packageDetails = await getPackageDetails(
                clientData.package,
              );
              if (packageDetails) {
                clientData.packageName = packageDetails.packageName;
                clientData.packagePrice = packageDetails.packagePrice;
              }
            }

            // Get added by user details if available
            let addedByDetails = null;
            if (clientData.userAddedBy) {
              const addedBy = await AuthorityInformation.findOne({
                where: { userId: clientData.userAddedBy },
                attributes: ["fullName", "mobileNo", "email", "role"],
              });
              addedByDetails = addedBy ? addedBy.toJSON() : null;
            }

            return {
              id: clientData.id,
              userId: clientData.userId,
              fullName: clientData.fullName,
              mobileNo: clientData.mobileNo,
              email: clientData.email,
              photo: clientData.photo,
              status: clientData.status,
              packageName: clientData.packageName,
              location: clientData.location,
              area: clientData.area,
              customerType: clientData.customerType,
              costForPackage: clientData.costForPackage,
              createdAt: clientData.createdAt,
              addedByDetails: addedByDetails,
              commission: {
                amount: commissionAmount,
                status: "pending", // Since we don't have payment tracking
                eligible: clientData.status === 'active',
              },
            };
          }),
        );

        // Calculate success rate
        const totalReferrals = parseInt(referrerData.referralCount || 0);
        const activeReferrals = parseInt(referrerData.activeReferrals || 0);
        const totalCommission = parseFloat(referrerData.totalCommission || 0);
        const successRate =
          totalReferrals > 0
            ? ((activeReferrals / totalReferrals) * 100).toFixed(2)
            : "0.00";

        return {
          referrer: {
            id: referrerInfo.id,
            userId: referrerInfo.userId,
            fullName: referrerInfo.fullName,
            mobileNo: referrerInfo.mobileNo,
            email: referrerInfo.email,
            photo: referrerInfo.photo,
            type: referrerTypeDB,
            role: referrerInfo.role,
            status: referrerInfo.status,
            location: referrerInfo.location,
            joinDate: referrerInfo.createdAt,
            customerType: referrerInfo.customerType,
            jobType: referrerInfo.jobType,
            baseSalary: referrerInfo.baseSalary,
          },
          referralStats: {
            totalReferrals: totalReferrals,
            activeReferrals: activeReferrals,
            pendingReferrals: parseInt(referrerData.pendingReferrals || 0),
            totalRevenue: parseFloat(referrerData.totalRevenue || 0),
            avgRevenue: parseFloat(referrerData.avgRevenue || 0),
            totalCommission: totalCommission,
            avgCommissionPerReferral: totalReferrals > 0 ? (totalCommission / totalReferrals).toFixed(2) : "0.00",
            pendingCommission: totalCommission, // All commission is pending since no payment tracking
            paidCommission: 0,
            successRate: successRate + "%",
          },
          referredClients: transformedReferredClients,
        };
      }),
    );

    // Filter out null referrers and by referrer type if specified
    let filteredReferrers = referrersWithDetails.filter(
      (item) => item !== null,
    );
    if (referrerType) {
      filteredReferrers = filteredReferrers.filter(
        (item) => item.referrer.type === referrerType,
      );
    }

    // 3. GET TOTAL COUNT FOR PAGINATION
    const totalReferrersCount = await ClientInformation.count({
      distinct: true,
      col: "referId",
      where: {
        role: "client",
        referId: { [Op.not]: null, [Op.ne]: "N/A" },
      },
    });

    // 4. MONTHLY REFERRAL TREND
    const monthlyReferralTrend = await ClientInformation.findAll({
      where: referredWhereClause,
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m"),
          "month",
        ],
        [sequelize.fn("COUNT", sequelize.col("id")), "referralCount"],
        [
          sequelize.literal(
            `SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END)`
          ),
          "activeReferrals",
        ],
        [
          sequelize.literal(
            `SUM(CASE WHEN status = 'active' THEN ${COMMISSION_PER_ACTIVE_REFERRAL} ELSE 0 END)`
          ),
          "commission",
        ],
        [sequelize.fn("SUM", sequelize.col("costForPackage")), "revenue"],
      ],
      group: [sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m")],
      order: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m"),
          "ASC",
        ],
      ],
      limit: 12,
    });

    // 5. CALCULATE OVERALL PERFORMANCE METRICS
    const totalReferrals = filteredReferrers.reduce(
      (sum, item) => sum + item.referralStats.totalReferrals,
      0,
    );

    const activeReferrals = filteredReferrers.reduce(
      (sum, item) => sum + item.referralStats.activeReferrals,
      0,
    );

    const pendingReferrals = filteredReferrers.reduce(
      (sum, item) => sum + item.referralStats.pendingReferrals,
      0,
    );

    const totalRevenue = filteredReferrers.reduce(
      (sum, item) => sum + item.referralStats.totalRevenue,
      0,
    );

    const totalCommission = filteredReferrers.reduce(
      (sum, item) => sum + item.referralStats.totalCommission,
      0,
    );

    const pendingCommission = filteredReferrers.reduce(
      (sum, item) => sum + item.referralStats.pendingCommission,
      0,
    );

    const paidCommission = filteredReferrers.reduce(
      (sum, item) => sum + item.referralStats.paidCommission,
      0,
    );

    const avgRevenuePerReferral =
      totalReferrals > 0 ? totalRevenue / totalReferrals : 0;
    const conversionRate =
      totalReferrals > 0
        ? ((activeReferrals / totalReferrals) * 100).toFixed(2)
        : "0.00";

    // 6. TOP PERFORMING REFERRERS (by commission earned)
    const topPerformingReferrers = [...filteredReferrers]
      .sort(
        (a, b) => b.referralStats.totalCommission - a.referralStats.totalCommission,
      )
      .slice(0, 5)
      .map((item) => ({
        referrerName: item.referrer.fullName,
        referrerType: item.referrer.type,
        totalReferrals: item.referralStats.totalReferrals,
        activeReferrals: item.referralStats.activeReferrals,
        totalCommission: item.referralStats.totalCommission,
        successRate: item.referralStats.successRate,
      }));

    res.status(200).json({
      success: true,
      report: {
        period: {
          startDate: startDate || "All time",
          endDate: endDate || "Current",
          dateType: dateType,
        },
        filters: {
          referrerType,
          status,
          referrerId,
        },
        commissionSettings: {
          commissionPerActiveReferral: COMMISSION_PER_ACTIVE_REFERRAL,
          currency: "BDT (Taka)",
          eligibility: "Only for active referrals",
          note: "Commission tracking is calculated on-the-fly. No payment tracking available without database changes.",
        },
        summary: {
          totalReferrers: filteredReferrers.length,
          totalReferrals: totalReferrals,
          activeReferrals: activeReferrals,
          pendingReferrals: pendingReferrals,
          totalRevenue: totalRevenue.toFixed(2),
          avgRevenuePerReferral: avgRevenuePerReferral.toFixed(2),
          totalCommission: totalCommission.toFixed(2),
          pendingCommission: pendingCommission.toFixed(2),
          paidCommission: paidCommission.toFixed(2),
          avgCommissionPerActiveReferral: COMMISSION_PER_ACTIVE_REFERRAL.toFixed(2),
          conversionRate: conversionRate + "%",
          activeReferralRate:
            totalReferrals > 0
              ? ((activeReferrals / totalReferrals) * 100).toFixed(2) + "%"
              : "0%",
        },
        analytics: {
          monthlyReferralTrend: monthlyReferralTrend.map((trend) =>
            trend.toJSON(),
          ),
          topPerformingReferrers,
        },
        referrers: filteredReferrers,
      },
      pagination: {
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
        totalItems: totalReferrersCount,
        totalPages: Math.ceil(totalReferrersCount / limitNumber),
        hasNextPage: pageNumber < Math.ceil(totalReferrersCount / limitNumber),
        hasPreviousPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error("Error in referral client report:", error);
    next(error);
  }
};




module.exports = {
  getClientStatusReport,
  getClientPackageDistributionReport,
  getClientLocationReport,
  getReferralClientReport,
};
