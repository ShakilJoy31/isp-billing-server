const { Op } = require("sequelize");
const sequelize = require("../../database/connection");
const AuthorityInformation = require("../../models/Authentication/authority.model");
const Package = require("../../models/package/package.model");
const BankAccount = require("../../models/account/account.model");
const {
  Expense,
  ExpensePayment,
} = require("../../models/expense/expense.model");
const ExpenseCategory = require("../../models/expense/category.model");
const ExpenseSubCategory = require("../../models/expense/sub-category.model");
const ClientInformation = require("../../models/Authentication/client.model");
const EmployeePayment = require("../../models/payment/employee-payment.model");
const Transaction = require("../../models/payment/client-payment.model");
const EmployeeAttendance = require("../../models/attendence/attendence.model");
const Salary = require("../../models/salary/salary.model");
const {
  Chat,
  ChatMessage,
  ChatParticipant,
} = require("../../models/live-chat/liveChat.model");

// 1. CHAT/SUPPORT TICKET REPORT
const getChatSupportReport = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      status,
      priority,
      category,
      assignedTo,
      page = 1,
      limit = 20,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where conditions
    const whereClause = {};
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
      if (endDate)
        whereClause.createdAt[Op.lte] = new Date(endDate + " 23:59:59");
    }
    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;
    if (category) whereClause.category = category;
    if (assignedTo) whereClause.assignedTo = assignedTo;

    // Get chats with pagination
    const { count, rows: chats } = await Chat.findAndCountAll({
      where: whereClause,
      limit: limitNumber,
      offset: offset,
      order: [["lastMessageAt", "DESC"]],
      include: [
        {
          model: ChatMessage,
          as: "chatmessages",
          attributes: [
            [
              sequelize.fn("COUNT", sequelize.col("chatmessages.id")),
              "messageCount",
            ],
            [
              sequelize.fn("MAX", sequelize.col("chatmessages.createdAt")),
              "lastMessageTime",
            ],
          ],
          required: false,
        },
        {
          model: ChatParticipant,
          as: "chatparticipants",
          attributes: ["userId", "userType", "role"],
          required: false,
        },
      ],
      group: ["Chat.id"], // Group by chat to avoid duplication from joins
    });

    // Get detailed chat information with participants
    const detailedChats = await Promise.all(
      chats.map(async (chat) => {
        const chatData = chat.toJSON();

        // Get participants with details
        const participants = await Promise.all(
          (chatData.chatparticipants || []).map(async (participant) => {
            let userDetails = null;

            if (participant.userType === "User") {
              userDetails = await ClientInformation.findOne({
                where: { id: participant.userId },
                attributes: ["fullName", "mobileNo", "email", "userId"],
              });
            } else if (
              participant.userType === "Support" ||
              participant.userType === "Admin"
            ) {
              userDetails = await AuthorityInformation.findOne({
                where: { id: participant.userId },
                attributes: ["fullName", "mobileNo", "email", "userId", "role"],
              });
            }

            return {
              ...participant,
              userDetails: userDetails ? userDetails.toJSON() : null,
            };
          }),
        );

        // Get assigned agent details if assigned
        let assignedAgent = null;
        if (chatData.assignedTo) {
          assignedAgent = await AuthorityInformation.findOne({
            where: { id: chatData.assignedTo },
            attributes: ["fullName", "userId", "role"],
          });
        }

        // Get creator details
        let creatorDetails = null;
        const creatorParticipant = participants.find(
          (p) => p.role === "Creator",
        );
        if (creatorParticipant) {
          creatorDetails = creatorParticipant.userDetails;
        }

        return {
          ...chatData,
          participants,
          assignedAgent: assignedAgent ? assignedAgent.toJSON() : null,
          creatorDetails,
          messageCount: chatData.chatmessages?.[0]?.messageCount || 0,
          lastMessageTime: chatData.chatmessages?.[0]?.lastMessageTime || null,
        };
      }),
    );

    // Chat statistics
    const chatStats = await Chat.findAll({
      where: whereClause,
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [
          sequelize.fn(
            "AVG",
            sequelize.literal("TIMESTAMPDIFF(HOUR, createdAt, lastMessageAt)"),
          ),
          "avgResolutionTime",
        ],
      ],
      group: ["status"],
    });

    // Category statistics
    const categoryStats = await Chat.findAll({
      where: whereClause,
      attributes: [
        "category",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [
          sequelize.fn(
            "AVG",
            sequelize.literal("TIMESTAMPDIFF(HOUR, createdAt, lastMessageAt)"),
          ),
          "avgResolutionTime",
        ],
      ],
      group: ["category"],
    });

    // Priority statistics
    const priorityStats = await Chat.findAll({
      where: whereClause,
      attributes: [
        "priority",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [
          sequelize.fn(
            "AVG",
            sequelize.literal("TIMESTAMPDIFF(HOUR, createdAt, lastMessageAt)"),
          ),
          "avgResolutionTime",
        ],
      ],
      group: ["priority"],
    });

    // Daily chat trend
    const dailyTrend = await Chat.findAll({
      where: whereClause,
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "newChats"],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal(
              `CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END`,
            ),
          ),
          "resolvedChats",
        ],
      ],
      group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
      order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "DESC"]],
      limit: 30,
    });

    // Response time analysis
    const responseTimeAnalysis = await Chat.findAll({
      where: {
        ...whereClause,
        lastMessageAt: { [Op.not]: null },
      },
      attributes: [
        [
          sequelize.fn(
            "HOUR",
            sequelize.literal(
              "TIMESTAMPDIFF(MINUTE, createdAt, lastMessageAt)",
            ),
          ),
          "resolutionHours",
        ],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: [
        sequelize.literal(
          "HOUR(TIMESTAMPDIFF(MINUTE, createdAt, lastMessageAt))",
        ),
      ],
      order: [[sequelize.literal("resolutionHours"), "ASC"]],
    });

    const totalPages = Math.ceil(count / limitNumber);

    // Calculate summary
    const summary = {
      totalChats: count,
      activeChats: chatStats.find((s) => s.status === "Active")?.count || 0,
      resolvedChats: chatStats.find((s) => s.status === "Resolved")?.count || 0,
      avgResolutionTime:
        chatStats.reduce(
          (sum, stat) =>
            sum + parseFloat(stat.avgResolutionTime || 0) * stat.count,
          0,
        ) / count,
      mostCommonCategory: categoryStats.reduce(
        (max, cat) => (cat.count > max.count ? cat : max),
        { category: "None", count: 0 },
      ),
      urgentPriorityCount:
        priorityStats.find((p) => p.priority === "Urgent")?.count || 0,
    };

    res.status(200).json({
      success: true,
      data: {
        chats: detailedChats,
        statistics: {
          chatStats,
          categoryStats,
          priorityStats,
          dailyTrend,
          responseTimeAnalysis,
        },
        summary,
      },
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error in chat support report:", error);
    next(error);
  }
};

// 2. REMINDER & NOTIFICATION REPORT
const getReminderNotificationReport = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      reminderType,
      status,
      reminderMethod,
      priority,
      page = 1,
      limit = 30,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where conditions
    const whereClause = {};
    if (startDate || endDate) {
      whereClause.scheduledAt = {};
      if (startDate) whereClause.scheduledAt[Op.gte] = new Date(startDate);
      if (endDate)
        whereClause.scheduledAt[Op.lte] = new Date(endDate + " 23:59:59");
    }
    if (reminderType) whereClause.reminderType = reminderType;
    if (status) whereClause.status = status;
    if (reminderMethod) whereClause.reminderMethod = reminderMethod;
    if (priority) whereClause.priority = priority;

    // Get reminders with pagination
    const { count, rows: reminders } = await Reminder.findAndCountAll({
      where: whereClause,
      limit: limitNumber,
      offset: offset,
      order: [["scheduledAt", "DESC"]],
    });

    // Get client details for each reminder
    const remindersWithDetails = await Promise.all(
      reminders.map(async (reminder) => {
        const reminderData = reminder.toJSON();

        // Get client details
        let clientDetails = null;
        if (reminderData.customerId) {
          clientDetails = await ClientInformation.findOne({
            where: { id: reminderData.customerId },
            attributes: [
              "fullName",
              "mobileNo",
              "email",
              "userId",
              "package",
              "status",
            ],
          });
        }

        // Calculate days until/since due date
        const dueDate = new Date(reminderData.dueDate);
        const today = new Date();
        const daysDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        let dueStatus = "Future";
        if (daysDiff < 0) dueStatus = "Overdue";
        else if (daysDiff === 0) dueStatus = "Due Today";
        else if (daysDiff <= 3) dueStatus = "Due Soon";

        return {
          ...reminderData,
          clientDetails: clientDetails ? clientDetails.toJSON() : null,
          daysDifference: daysDiff,
          dueStatus,
          isRecurring: reminderData.isRecurring,
          nextReminderDate: reminderData.nextReminderDate,
        };
      }),
    );

    // Reminder statistics
    const reminderStats = await Reminder.findAll({
      where: whereClause,
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("amountDue")), "totalAmount"],
        [
          sequelize.fn(
            "AVG",
            sequelize.literal("TIMESTAMPDIFF(HOUR, scheduledAt, sentAt)"),
          ),
          "avgDeliveryTime",
        ],
      ],
      group: ["status"],
    });

    // Type statistics
    const typeStats = await Reminder.findAll({
      where: whereClause,
      attributes: [
        "reminderType",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("amountDue")), "totalAmount"],
        [
          sequelize.fn(
            "AVG",
            sequelize.literal(
              'CASE WHEN status = "Sent" THEN TIMESTAMPDIFF(HOUR, scheduledAt, sentAt) ELSE NULL END',
            ),
          ),
          "avgDeliveryTime",
        ],
      ],
      group: ["reminderType"],
    });

    // Method statistics
    const methodStats = await Reminder.findAll({
      where: whereClause,
      attributes: [
        "reminderMethod",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("amountDue")), "totalAmount"],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal(`CASE WHEN status = 'Sent' THEN 1 ELSE 0 END`),
          ),
          "successCount",
        ],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal(`CASE WHEN status = 'Failed' THEN 1 ELSE 0 END`),
          ),
          "failedCount",
        ],
      ],
      group: ["reminderMethod"],
    });

    // Daily reminder trend
    const dailyTrend = await Reminder.findAll({
      where: whereClause,
      attributes: [
        [sequelize.fn("DATE", sequelize.col("scheduledAt")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "scheduledCount"],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal(`CASE WHEN status = 'Sent' THEN 1 ELSE 0 END`),
          ),
          "sentCount",
        ],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal(`CASE WHEN status = 'Failed' THEN 1 ELSE 0 END`),
          ),
          "failedCount",
        ],
        [sequelize.fn("SUM", sequelize.col("amountDue")), "totalAmount"],
      ],
      group: [sequelize.fn("DATE", sequelize.col("scheduledAt"))],
      order: [[sequelize.fn("DATE", sequelize.col("scheduledAt")), "DESC"]],
      limit: 30,
    });

    // Success rate by method
    const successRateByMethod = methodStats.map((method) => {
      const methodData = method.toJSON();
      const successRate =
        methodData.count > 0
          ? ((methodData.successCount / methodData.count) * 100).toFixed(2)
          : 0;
      return {
        method: methodData.reminderMethod,
        total: methodData.count,
        success: methodData.successCount,
        failed: methodData.failedCount,
        successRate: parseFloat(successRate),
        totalAmount: parseFloat(methodData.totalAmount || 0),
      };
    });

    // Overdue reminders analysis
    const overdueReminders = remindersWithDetails.filter(
      (reminder) =>
        reminder.dueStatus === "Overdue" && reminder.status !== "Sent",
    );

    // Recurring reminders analysis
    const recurringReminders = remindersWithDetails.filter(
      (reminder) => reminder.isRecurring,
    );

    const totalPages = Math.ceil(count / limitNumber);

    // Calculate summary
    const summary = {
      totalReminders: count,
      sentReminders: reminderStats.find((s) => s.status === "Sent")?.count || 0,
      failedReminders:
        reminderStats.find((s) => s.status === "Failed")?.count || 0,
      pendingReminders:
        reminderStats.find((s) => s.status === "Pending")?.count || 0,
      totalAmountDue: reminderStats
        .reduce((sum, stat) => sum + parseFloat(stat.totalAmount || 0), 0)
        .toFixed(2),
      successRate:
        count > 0
          ? (
              ((reminderStats.find((s) => s.status === "Sent")?.count || 0) /
                count) *
              100
            ).toFixed(2)
          : 0,
      overdueCount: overdueReminders.length,
      overdueAmount: overdueReminders
        .reduce((sum, reminder) => sum + parseFloat(reminder.amountDue || 0), 0)
        .toFixed(2),
      recurringCount: recurringReminders.length,
    };

    res.status(200).json({
      success: true,
      data: {
        reminders: remindersWithDetails,
        statistics: {
          reminderStats,
          typeStats,
          methodStats,
          dailyTrend,
          successRateByMethod,
        },
        analysis: {
          overdueReminders: overdueReminders.slice(0, 50), // Limit to 50 for performance
          recurringReminders: recurringReminders.slice(0, 50),
        },
        summary,
      },
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error in reminder notification report:", error);
    next(error);
  }
};

// 3. CUSTOMER SUPPORT PERFORMANCE REPORT
const getCustomerSupportPerformanceReport = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      supportAgentId,
      department,
      page = 1,
      limit = 20,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Get all support agents (employees with support role)
    const supportAgents = await AuthorityInformation.findAll({
      where: {
        role: { [Op.like]: "%Support%" },
        ...(department ? { department } : {}),
        ...(supportAgentId ? { id: supportAgentId } : {}),
      },
      attributes: [
        "id",
        "fullName",
        "userId",
        "email",
        "mobileNo",
        "role",
        "department",
      ],
      order: [["fullName", "ASC"]],
    });

    // Get performance data for each support agent
    const agentPerformance = await Promise.all(
      supportAgents.map(async (agent) => {
        const agentId = agent.id;

        // Build where conditions for this agent's chats
        const chatWhere = {
          assignedTo: agentId,
          ...(startDate || endDate
            ? {
                createdAt: {
                  ...(startDate ? { [Op.gte]: new Date(startDate) } : {}),
                  ...(endDate
                    ? { [Op.lte]: new Date(endDate + " 23:59:59") }
                    : {}),
                },
              }
            : {}),
        };

        // Get assigned chats
        const assignedChats = await Chat.findAll({
          where: chatWhere,
          attributes: [
            "id",
            "status",
            "priority",
            "category",
            "createdAt",
            "lastMessageAt",
          ],
        });

        // Calculate metrics
        const totalChats = assignedChats.length;
        const resolvedChats = assignedChats.filter(
          (chat) => chat.status === "Resolved",
        ).length;
        const activeChats = assignedChats.filter(
          (chat) => chat.status === "Active",
        ).length;

        // Calculate resolution time (only for resolved chats)
        const resolvedChatData = assignedChats.filter(
          (chat) => chat.status === "Resolved" && chat.lastMessageAt,
        );

        const totalResolutionTime = resolvedChatData.reduce((sum, chat) => {
          const resolutionTime =
            new Date(chat.lastMessageAt) - new Date(chat.createdAt);
          return sum + resolutionTime;
        }, 0);

        const avgResolutionTime =
          resolvedChatData.length > 0
            ? totalResolutionTime / resolvedChatData.length / (1000 * 60 * 60) // Convert to hours
            : 0;

        // Get chat messages sent by this agent
        const agentMessages = await ChatMessage.count({
          where: {
            senderId: agentId,
            senderType: "Support",
            ...(startDate || endDate
              ? {
                  createdAt: {
                    ...(startDate ? { [Op.gte]: new Date(startDate) } : {}),
                    ...(endDate
                      ? { [Op.lte]: new Date(endDate + " 23:59:59") }
                      : {}),
                  },
                }
              : {}),
          },
        });

        // Calculate response time (time between customer message and agent reply)
        // This is a simplified calculation
        const responseTimeSamples = await ChatMessage.findAll({
          where: {
            chatId: { [Op.in]: assignedChats.map((c) => c.id) },
            senderType: "User",
          },
          attributes: ["id", "chatId", "createdAt"],
          limit: 100, // Sample size for performance
        });

        let totalResponseTime = 0;
        let responseCount = 0;

        for (const customerMessage of responseTimeSamples) {
          const agentReply = await ChatMessage.findOne({
            where: {
              chatId: customerMessage.chatId,
              senderId: agentId,
              senderType: "Support",
              createdAt: { [Op.gt]: customerMessage.createdAt },
            },
            order: [["createdAt", "ASC"]],
            attributes: ["createdAt"],
          });

          if (agentReply) {
            const responseTime =
              new Date(agentReply.createdAt) -
              new Date(customerMessage.createdAt);
            totalResponseTime += responseTime;
            responseCount++;
          }
        }

        const avgResponseTime =
          responseCount > 0
            ? totalResponseTime / responseCount / (1000 * 60) // Convert to minutes
            : 0;

        // Customer satisfaction (would normally come from ratings)
        // For now, we'll use resolution rate as a proxy
        const resolutionRate =
          totalChats > 0 ? ((resolvedChats / totalChats) * 100).toFixed(2) : 0;

        // Priority distribution
        const priorityDistribution = assignedChats.reduce((acc, chat) => {
          const priority = chat.priority;
          if (!acc[priority]) acc[priority] = 0;
          acc[priority]++;
          return acc;
        }, {});

        // Category distribution
        const categoryDistribution = assignedChats.reduce((acc, chat) => {
          const category = chat.category;
          if (!acc[category]) acc[category] = 0;
          acc[category]++;
          return acc;
        }, {});

        // Calculate performance score
        const performanceScore = calculateSupportPerformanceScore(
          parseFloat(resolutionRate),
          avgResolutionTime,
          avgResponseTime,
          totalChats,
        );

        return {
          agentId: agent.id,
          agentName: agent.fullName,
          userId: agent.userId,
          department: agent.department,
          role: agent.role,
          contact: agent.mobileNo,
          performance: {
            totalChats,
            resolvedChats,
            activeChats,
            resolutionRate: parseFloat(resolutionRate),
            avgResolutionTime: avgResolutionTime.toFixed(2),
            avgResponseTime: avgResponseTime.toFixed(2),
            totalMessages: agentMessages,
            performanceScore: performanceScore.toFixed(2),
            priorityDistribution,
            categoryDistribution,
          },
        };
      }),
    );

    // Sort by performance score
    const sortedPerformance = agentPerformance.sort(
      (a, b) =>
        parseFloat(b.performance.performanceScore) -
        parseFloat(a.performance.performanceScore),
    );

    // Apply pagination
    const paginatedPerformance = sortedPerformance.slice(
      offset,
      offset + limitNumber,
    );
    const totalCount = sortedPerformance.length;

    // Overall statistics
    const overallStats = {
      totalAgents: agentPerformance.length,
      totalChats: agentPerformance.reduce(
        (sum, agent) => sum + agent.performance.totalChats,
        0,
      ),
      resolvedChats: agentPerformance.reduce(
        (sum, agent) => sum + agent.performance.resolvedChats,
        0,
      ),
      avgResolutionRate:
        agentPerformance.length > 0
          ? (
              agentPerformance.reduce(
                (sum, agent) =>
                  sum + parseFloat(agent.performance.resolutionRate),
                0,
              ) / agentPerformance.length
            ).toFixed(2)
          : 0,
      avgResolutionTime:
        agentPerformance.length > 0
          ? (
              agentPerformance.reduce(
                (sum, agent) =>
                  sum + parseFloat(agent.performance.avgResolutionTime),
                0,
              ) / agentPerformance.length
            ).toFixed(2)
          : 0,
      avgResponseTime:
        agentPerformance.length > 0
          ? (
              agentPerformance.reduce(
                (sum, agent) =>
                  sum + parseFloat(agent.performance.avgResponseTime),
                0,
              ) / agentPerformance.length
            ).toFixed(2)
          : 0,
      topPerformer: sortedPerformance[0] || null,
      bottomPerformer: sortedPerformance[sortedPerformance.length - 1] || null,
    };

    // Department-wise performance
    const departmentPerformance = agentPerformance.reduce((acc, agent) => {
      const dept = agent.department || "Unassigned";
      if (!acc[dept]) {
        acc[dept] = {
          department: dept,
          agentCount: 0,
          totalChats: 0,
          resolvedChats: 0,
          totalPerformanceScore: 0,
        };
      }

      acc[dept].agentCount++;
      acc[dept].totalChats += agent.performance.totalChats;
      acc[dept].resolvedChats += agent.performance.resolvedChats;
      acc[dept].totalPerformanceScore += parseFloat(
        agent.performance.performanceScore,
      );

      return acc;
    }, {});

    // Calculate averages for department performance
    Object.keys(departmentPerformance).forEach((dept) => {
      const deptData = departmentPerformance[dept];
      deptData.avgPerformanceScore =
        deptData.agentCount > 0
          ? (deptData.totalPerformanceScore / deptData.agentCount).toFixed(2)
          : 0;
      deptData.resolutionRate =
        deptData.totalChats > 0
          ? ((deptData.resolvedChats / deptData.totalChats) * 100).toFixed(2)
          : 0;
    });

    // Daily performance trend
    const dailyPerformance = await Chat.findAll({
      where: {
        assignedTo: { [Op.not]: null },
        ...(startDate || endDate
          ? {
              createdAt: {
                ...(startDate ? { [Op.gte]: new Date(startDate) } : {}),
                ...(endDate
                  ? { [Op.lte]: new Date(endDate + " 23:59:59") }
                  : {}),
              },
            }
          : {}),
      },
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        "assignedTo",
        [sequelize.fn("COUNT", sequelize.col("id")), "newChats"],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal(
              `CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END`,
            ),
          ),
          "resolvedChats",
        ],
      ],
      group: [sequelize.fn("DATE", sequelize.col("createdAt")), "assignedTo"],
      order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "DESC"]],
      limit: 100,
    });

    const totalPages = Math.ceil(totalCount / limitNumber);

    res.status(200).json({
      success: true,
      data: {
        agentPerformance: paginatedPerformance,
        overallStats,
        departmentPerformance: Object.values(departmentPerformance),
        dailyPerformance,
        summary: {
          totalAgents: overallStats.totalAgents,
          totalChatsHandled: overallStats.totalChats,
          overallResolutionRate: overallStats.avgResolutionRate,
          bestPerformanceScore:
            sortedPerformance[0]?.performance.performanceScore || 0,
          worstPerformanceScore:
            sortedPerformance[sortedPerformance.length - 1]?.performance
              .performanceScore || 0,
        },
      },
      pagination: {
        totalItems: totalCount,
        totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error in customer support performance report:", error);
    next(error);
  }
};

// Helper function to calculate support performance score
const calculateSupportPerformanceScore = (
  resolutionRate,
  avgResolutionTime,
  avgResponseTime,
  totalChats,
) => {
  let score = 100;

  // Resolution rate contributes 40%
  const resolutionScore = resolutionRate * 0.4;

  // Resolution time contributes 30%
  let resolutionTimeScore = 30;
  if (avgResolutionTime > 24) resolutionTimeScore -= 10; // More than 24 hours
  if (avgResolutionTime > 48) resolutionTimeScore -= 10; // More than 48 hours
  if (avgResolutionTime > 72) resolutionTimeScore -= 10; // More than 72 hours

  // Response time contributes 20%
  let responseTimeScore = 20;
  if (avgResponseTime > 60) responseTimeScore -= 5; // More than 60 minutes
  if (avgResponseTime > 120) responseTimeScore -= 5; // More than 2 hours
  if (avgResponseTime > 240) responseTimeScore -= 10; // More than 4 hours

  // Volume bonus contributes 10%
  let volumeBonus = 0;
  if (totalChats > 50) volumeBonus += 5;
  if (totalChats > 100) volumeBonus += 5;

  score =
    resolutionScore + resolutionTimeScore + responseTimeScore + volumeBonus;
  return Math.max(0, Math.min(100, score));
};

// 4. ISSUE CATEGORY REPORT
const getIssueCategoryReport = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      category,
      priority,
      status,
      page = 1,
      limit = 20,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where conditions
    const whereClause = {};
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
      if (endDate)
        whereClause.createdAt[Op.lte] = new Date(endDate + " 23:59:59");
    }
    if (category) whereClause.category = category;
    if (priority) whereClause.priority = priority;
    if (status) whereClause.status = status;

    // Get chats with pagination
    const { count, rows: chats } = await Chat.findAndCountAll({
      where: whereClause,
      limit: limitNumber,
      offset: offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: ChatMessage,
          as: "chatmessages",
          attributes: [
            [
              sequelize.fn("COUNT", sequelize.col("chatmessages.id")),
              "messageCount",
            ],
          ],
          required: false,
        },
        {
          model: ChatParticipant,
          as: "chatparticipants",
          where: { userType: "User" },
          attributes: ["userId"],
          required: false,
        },
      ],
    });

    // Get detailed chat information with client details
    const detailedChats = await Promise.all(
      chats.map(async (chat) => {
        const chatData = chat.toJSON();

        // Get client details from participants
        let clientDetails = null;
        if (chatData.chatparticipants && chatData.chatparticipants.length > 0) {
          const clientParticipant = chatData.chatparticipants[0];
          clientDetails = await ClientInformation.findOne({
            where: { id: clientParticipant.userId },
            attributes: [
              "fullName",
              "mobileNo",
              "email",
              "userId",
              "package",
              "location",
            ],
          });
        }

        // Get assigned agent details
        let assignedAgent = null;
        if (chatData.assignedTo) {
          assignedAgent = await AuthorityInformation.findOne({
            where: { id: chatData.assignedTo },
            attributes: ["fullName", "userId"],
          });
        }

        // Calculate resolution time
        let resolutionTime = null;
        if (chatData.status === "Resolved" && chatData.lastMessageAt) {
          resolutionTime = Math.round(
            (new Date(chatData.lastMessageAt) - new Date(chatData.createdAt)) /
              (1000 * 60 * 60),
          ); // Hours
        }

        return {
          ...chatData,
          clientDetails: clientDetails ? clientDetails.toJSON() : null,
          assignedAgent: assignedAgent ? assignedAgent.toJSON() : null,
          messageCount: chatData.chatmessages?.[0]?.messageCount || 0,
          resolutionTime,
          daysOpen: Math.round(
            (new Date() - new Date(chatData.createdAt)) / (1000 * 60 * 60 * 24),
          ),
        };
      }),
    );

    // Category statistics
    const categoryStats = await Chat.findAll({
      where: whereClause,
      attributes: [
        "category",
        [sequelize.fn("COUNT", sequelize.col("id")), "totalIssues"],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal(
              `CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END`,
            ),
          ),
          "resolvedIssues",
        ],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal(`CASE WHEN status = 'Active' THEN 1 ELSE 0 END`),
          ),
          "activeIssues",
        ],
        [
          sequelize.fn(
            "AVG",
            sequelize.literal("TIMESTAMPDIFF(HOUR, createdAt, lastMessageAt)"),
          ),
          "avgResolutionTime",
        ],
        [
          sequelize.fn(
            "AVG",
            sequelize.literal(
              "(SELECT COUNT(*) FROM chatmessages WHERE chatmessages.chatId = Chat.id)",
            ),
          ),
          "avgMessagesPerIssue",
        ],
      ],
      group: ["category"],
      order: [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]],
    });

    // Priority distribution by category
    const priorityByCategory = await Chat.findAll({
      where: whereClause,
      attributes: [
        "category",
        "priority",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [
          sequelize.fn(
            "AVG",
            sequelize.literal("TIMESTAMPDIFF(HOUR, createdAt, lastMessageAt)"),
          ),
          "avgResolutionTime",
        ],
      ],
      group: ["category", "priority"],
      order: [
        ["category", "ASC"],
        ["priority", "ASC"],
      ],
    });

    // Monthly trend by category
    const monthlyTrend = await Chat.findAll({
      where: whereClause,
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m"),
          "month",
        ],
        "category",
        [sequelize.fn("COUNT", sequelize.col("id")), "issueCount"],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal(
              `CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END`,
            ),
          ),
          "resolvedCount",
        ],
      ],
      group: [
        sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m"),
        "category",
      ],
      order: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m"),
          "DESC",
        ],
      ],
      limit: 36, // Last 3 years
    });

    // Resolution time analysis by category
    const resolutionTimeAnalysis = await Chat.findAll({
      where: {
        ...whereClause,
        status: "Resolved",
        lastMessageAt: { [Op.not]: null },
      },
      attributes: [
        "category",
        [
          sequelize.literal(
            "FLOOR(TIMESTAMPDIFF(HOUR, createdAt, lastMessageAt) / 24)",
          ),
          "resolutionDays",
        ],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: [
        "category",
        sequelize.literal(
          "FLOOR(TIMESTAMPDIFF(HOUR, createdAt, lastMessageAt) / 24)",
        ),
      ],
      order: [
        ["category", "ASC"],
        [sequelize.literal("resolutionDays"), "ASC"],
      ],
    });

    // Top recurring issues (similar titles/messages)
    // This is simplified - in production you might use NLP or keyword analysis
    const commonIssues = await Chat.findAll({
      where: whereClause,
      attributes: [
        "category",
        [sequelize.fn("COUNT", sequelize.col("id")), "frequency"],
        [
          sequelize.fn(
            "GROUP_CONCAT",
            sequelize.literal("DISTINCT priority ORDER BY priority"),
          ),
          "priorities",
        ],
      ],
      group: ["category"],
      order: [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]],
      limit: 10,
    });

    // Client package vs issue category correlation
    const packageIssueCorrelation = await Promise.all(
      categoryStats.map(async (categoryStat) => {
        const category = categoryStat.category;

        // Get chats for this category with client package info
        const chatsInCategory = await Chat.findAll({
          where: { ...whereClause, category },
          include: [
            {
              model: ChatParticipant,
              as: "chatparticipants",
              where: { userType: "User" },
              attributes: ["userId"],
              required: true,
            },
          ],
        });

        // Get client packages
        const clientIds = chatsInCategory
          .map((chat) => chat.chatparticipants?.[0]?.userId)
          .filter((id) => id);

        const clients = await ClientInformation.findAll({
          where: { id: { [Op.in]: clientIds } },
          attributes: ["package"],
        });

        // Count packages
        const packageCount = clients.reduce((acc, client) => {
          const pkg = client.package || "Unknown";
          if (!acc[pkg]) acc[pkg] = 0;
          acc[pkg]++;
          return acc;
        }, {});

        return {
          category,
          totalIssues: categoryStat.totalIssues,
          packageDistribution: Object.entries(packageCount).map(
            ([pkg, count]) => ({
              package: pkg,
              count,
              percentage: ((count / categoryStat.totalIssues) * 100).toFixed(2),
            }),
          ),
        };
      }),
    );

    const totalPages = Math.ceil(count / limitNumber);

    // Calculate summary
    const summary = {
      totalIssues: count,
      totalCategories: new Set(chats.map((chat) => chat.category)).size,
      mostCommonCategory: categoryStats.length > 0 ? categoryStats[0] : null,
      leastCommonCategory:
        categoryStats.length > 0
          ? categoryStats[categoryStats.length - 1]
          : null,
      avgResolutionTime:
        categoryStats.reduce(
          (sum, cat) =>
            sum + parseFloat(cat.avgResolutionTime || 0) * cat.totalIssues,
          0,
        ) / count,
      resolutionRate:
        count > 0
          ? (
              (categoryStats.reduce((sum, cat) => sum + cat.resolvedIssues, 0) /
                count) *
              100
            ).toFixed(2)
          : 0,
    };

    res.status(200).json({
      success: true,
      data: {
        issues: detailedChats,
        statistics: {
          categoryStats,
          priorityByCategory,
          monthlyTrend,
          resolutionTimeAnalysis,
          commonIssues,
          packageIssueCorrelation,
        },
        summary,
        insights: {
          topCategories: categoryStats.slice(0, 5),
          slowestResolvingCategories: [...categoryStats]
            .filter((cat) => cat.avgResolutionTime)
            .sort(
              (a, b) =>
                parseFloat(b.avgResolutionTime) -
                parseFloat(a.avgResolutionTime),
            )
            .slice(0, 5),
          fastestResolvingCategories: [...categoryStats]
            .filter((cat) => cat.avgResolutionTime)
            .sort(
              (a, b) =>
                parseFloat(a.avgResolutionTime) -
                parseFloat(b.avgResolutionTime),
            )
            .slice(0, 5),
        },
      },
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error in issue category report:", error);
    next(error);
  }
};

module.exports = {
  getChatSupportReport,
  getReminderNotificationReport,
  getCustomerSupportPerformanceReport,
  getIssueCategoryReport,
};
