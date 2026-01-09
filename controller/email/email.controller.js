const AuthorityInformation = require("../../models/Authentication/authority.model");
const ClientInformation = require("../../models/Authentication/client.model");
const Package = require("../../models/package/package.model");
const Salary = require("../../models/salary/salary.model");
const { sendEmail } = require("./clientEmail.service");

//! Helper function to create welcome email template
const createWelcomeEmailTemplate = (client, packageDetails) => {
  const companyName = "Ringtel";
  const supportPhone = "01601997701 or 02224442004";
  const supportEmail = "info@rtel.com.bd";

  const textBody = `
Dear ${client.fullName},

Welcome to ${companyName}! 🎉

We're excited to have you as our valued customer. Your account has been successfully created and is now ready for you to access on 'https://admin.billisp.com'.

📋 **Your Account Details:**
- Client ID: ${client.customerId || client.userId}
- Name: ${client.fullName}
- Email: ${client.email}
- Mobile: ${client.mobileNo}
- Status: ${client.status}
${client.routerLoginId ? `- Router Login ID: ${client.routerLoginId}` : ""}
${
  client.routerLoginPassword
    ? `- Router Login Password: ${client.routerLoginPassword}`
    : ""
}
${packageDetails ? `- Package: ${packageDetails.packageName}` : ""}

🛠️ **What Happens Next?**
1. Our technical team will contact you within 24 hours for any problem.
2. We'll schedule your installation.
3. You can login with your email and password (Mobile Number).
4. Enjoy high-speed internet and your server!

📞 **Need Help?**
Contact our support team:
- Phone: ${supportPhone}
- Email: ${supportEmail}
- Office Hours: 10:00 AM - 5:00 PM (Except Friday)

📍 **Visit Us:**
${companyName}

Thank you for choosing ${companyName}!

Best regards,
${companyName} Team

---
*This is an automated message. Please do not reply to this email.*
  `.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: 'Arial', sans-serif; 
      line-height: 1.6; 
      color: #333; 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      color: white; 
      padding: 40px 30px; 
      text-align: center; 
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }
    .content { 
      padding: 30px; 
    }
    .welcome-text {
      font-size: 18px;
      color: #2c3e50;
      margin-bottom: 30px;
    }
    .client-info {
      background: #f8f9fa;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 25px 0;
      border-radius: 4px;
    }
    .info-item {
      margin-bottom: 8px;
      padding: 5px 0;
      border-bottom: 1px solid #eaeaea;
    }
    .info-item:last-child {
      border-bottom: none;
    }
    .info-label {
      font-weight: bold;
      color: #2c3e50;
      display: inline-block;
      width: 180px;
    }
    .next-steps {
      background: #e8f4fc;
      border: 1px solid #d1ecf1;
      border-radius: 6px;
      padding: 20px;
      margin: 25px 0;
    }
    .next-steps h3 {
      color: #0c5460;
      margin-top: 0;
    }
    .next-steps ol {
      margin: 10px 0;
      padding-left: 20px;
    }
    .next-steps li {
      margin-bottom: 10px;
    }
    .contact-info {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 6px;
      padding: 20px;
      margin: 25px 0;
    }
    .contact-info h3 {
      color: #856404;
      margin-top: 0;
    }
    .footer {
      text-align: center;
      color: #666;
      font-size: 12px;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    .company-name {
      font-weight: bold;
      color: #667eea;
      font-size: 14px;
    }
    .emoji {
      font-size: 20px;
      margin-right: 5px;
    }
    .highlight {
      color: #667eea;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${companyName}</h1>
    </div>
    
    <div class="content">
      <div class="welcome-text">
        <span class="emoji">🎉</span> Dear <span class="highlight">${
          client.fullName
        }</span>,
        <br><br>
        Welcome to <span class="highlight">${companyName}</span>! We're excited to have you as our valued customer. Your account has been successfully created and is now ready for you to access on https://admin.billisp.com.
      </div>
      
      <h3 style="color: #2c3e50; margin-bottom: 15px;">📋 Your Account Details</h3>
      <div class="client-info">
        <div class="info-item">
          <span class="info-label">Client ID:</span> ${
            client.customerId || client.userId
          }
        </div>
        <div class="info-item">
          <span class="info-label">Name:</span> ${client.fullName}
        </div>
        <div class="info-item">
          <span class="info-label">Email:</span> ${client.email}
        </div>
        <div class="info-item">
          <span class="info-label">Mobile:</span> ${client.mobileNo}
        </div>
        <div class="info-item">
          <span class="info-label">Status:</span> ${client.status}
        </div>
        ${
          client.routerLoginId
            ? `
        <div class="info-item">
          <span class="info-label">Router Login ID:</span> ${client.routerLoginId}
        </div>
        `
            : ""
        }
        ${
          client.routerLoginPassword
            ? `
        <div class="info-item">
          <span class="info-label">Router Password:</span> ${client.routerLoginPassword}
        </div>
        `
            : ""
        }
        ${
          packageDetails
            ? `
        <div class="info-item">
          <span class="info-label">Package:</span> ${packageDetails.packageName}
        </div>
        `
            : ""
        }
      </div>
      
      <div class="next-steps">
        <h3><span class="emoji">🛠️</span> What Happens Next?</h3>
        <ol>
          <li>Our technical team will contact you within 24 hours</li>
          <li>We'll schedule your installation</li>
          <li>We'll activate your account and you can login with your email and password</li>
          <li>Enjoy high-speed internet!</li>
        </ol>
      </div>
      
      <div class="contact-info">
        <h3><span class="emoji">📞</span> Need Help?</h3>
        <p>Contact our support team:</p>
        <p><strong>Phone:</strong> ${supportPhone}</p>
        <p><strong>Email:</strong> ${supportEmail}</p>
        <p><strong>Office Hours:</strong> 10:00 AM - 5:00 PM (Except Friday)</p>
      </div>
      
      <p style="font-size: 16px; color: #2c3e50;">
        Thank you for choosing <span class="highlight">${companyName}</span>!
      </p>
      
      <p style="font-size: 16px;">
        Best regards,<br>
        <strong>${companyName} Support Team</strong>
      </p>
      
      <div class="footer">
        <p>This is an automated message. Please do not reply to this email.</p>
        <p class="company-name">${companyName}</p>
        <p>© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return {
    subject: `Welcome to ${companyName}, ${client.fullName}!`,
    text: textBody,
    html: htmlBody,
  };
};

//! Helper function to create salary email template
const createSalaryEmailTemplate = (employee, salary) => {
  const companyName = "Ringtel";
  const hrPhone = "01601997701 or 02224442004";
  const hrEmail = "info@rtel.com.bd";

  // Calculate salary
  const totalEarnings =
    salary.basicSalary +
    salary.houseRent +
    salary.medicalAllowance +
    salary.travelAllowance +
    salary.otherAllowances +
    salary.overtimeAmount +
    salary.performanceBonus +
    salary.festivalBonus +
    salary.otherBonuses;

  const totalDeductions =
    salary.providentFund + salary.taxDeduction + salary.otherDeductions;

  const netSalary = totalEarnings - totalDeductions;

  // Format currency
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
    }).format(amount || 0);

  const textBody = `Dear ${employee.fullName},

Salary Credited - ${salary.salaryMonth}

Net Salary: ${formatCurrency(netSalary)}

Regards,
HR Department
${companyName}`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<style>
  body {
    font-family: Arial, sans-serif;
    background: #f4f4f4;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 600px;
    margin: auto;
    background: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  }
  .header {
    background: #0f766e;
    color: #ffffff;
    text-align: center;
    padding: 30px;
  }
  .content {
    padding: 30px;
  }
  .net-box {
    background: #ecfdf5;
    border: 1px solid #10b981;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    margin: 25px 0;
  }
  .net-box h2 {
    margin: 10px 0 0;
    color: #065f46;
    font-size: 32px;
  }
  .section {
    margin-top: 30px;
  }
  .section-title {
    font-size: 18px;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 10px;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 8px;
  }
  .row {
    display: table;
    width: 100%;
    padding: 8px 0;
    border-bottom: 1px dashed #e5e7eb;
  }
  .cell {
    display: table-cell;
    font-size: 14px;
    padding: 4px 0;
  }
  .cell.label {
    color: #374151;
  }
  .cell.value {
    text-align: right;
    font-weight: bold;
    color: #111827;
  }
  .box {
    background: #f9fafb;
    border-radius: 8px;
    padding: 15px;
    margin-top: 15px;
  }
  .footer {
    text-align: center;
    font-size: 12px;
    color: #6b7280;
    margin-top: 30px;
  }
</style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>${companyName}</h1>
      <p>Salary Credited Confirmation</p>
    </div>

    <div class="content">
      <p>Dear <strong>${employee.fullName}</strong>,</p>
      <p>Your salary for <strong>${
        salary.salaryMonth
      }</strong> has been successfully credited.</p>

      <div class="net-box">
        <div>Net Salary Credited</div>
        <h2>${formatCurrency(netSalary)}</h2>
      </div>

      <!-- Earnings -->
      <div class="section">
        <div class="section-title">💰 Earnings</div>
        <div class="box">
          ${[
            ["Basic Salary", salary.basicSalary],
            ["House Rent", salary.houseRent],
            ["Medical Allowance", salary.medicalAllowance],
            ["Travel Allowance", salary.travelAllowance],
            ["Other Allowances", salary.otherAllowances],
            ["Overtime", salary.overtimeAmount],
            ["Performance Bonus", salary.performanceBonus],
            ["Festival Bonus", salary.festivalBonus],
          ]
            .filter(([, v]) => v > 0)
            .map(
              ([label, value]) => `
              <div class="row">
                <div class="cell label">${label}</div>
                <div class="cell value">${formatCurrency(value)}</div>
              </div>`
            )
            .join("")}
        </div>
      </div>

      <!-- Deductions -->
      <div class="section">
        <div class="section-title">📉 Deductions</div>
        <div class="box">
          ${[
            ["Provident Fund", salary.providentFund],
            ["Tax Deduction", salary.taxDeduction],
            ["Other Deductions", salary.otherDeductions],
          ]
            .filter(([, v]) => v > 0)
            .map(
              ([label, value]) => `
              <div class="row">
                <div class="cell label">${label}</div>
                <div class="cell value">${formatCurrency(value)}</div>
              </div>`
            )
            .join("")}
        </div>
      </div>

      <!-- Payment Details -->
      <div class="section">
        <div class="section-title">📋 Payment Details</div>
        <div class="box">
          <div class="row"><div class="cell label">Payment Date</div><div class="cell value">${new Date(
            salary.paymentDate
          ).toLocaleDateString()}</div></div>
          <div class="row"><div class="cell label">Payment Method</div><div class="cell value">${
            salary.paymentMethod === "mobile_banking"
              ? "MOBILE BANKING"
              : salary.paymentMethod
          }</div></div>
          <div class="row"><div class="cell label">Payment Status</div><div class="cell value">${
            salary.paymentStatus === "paid" ? "Paid" : salary.paymentStatus
          }</div></div>
          <div class="row"><div class="cell label">Bank Account</div><div class="cell value">${
            salary.bankAccount || "N/A"
          }</div></div>
        </div>
      </div>

      <!-- Attendance -->
      <div class="section">
        <div class="section-title">📊 Attendance Summary</div>
        <div class="box">
          <div class="row"><div class="cell label">Total Working Days</div><div class="cell value">${
            salary.totalWorkingDays
          }</div></div>
          <div class="row"><div class="cell label">Present Days</div><div class="cell value">${
            salary.presentDays
          }</div></div>
          <div class="row"><div class="cell label">Absent Days</div><div class="cell value">${
            salary.absentDays
          }</div></div>
          <div class="row"><div class="cell label">Paid Leaves</div><div class="cell value">${
            salary.paidLeaves
          }</div></div>
          <div class="row"><div class="cell label">Unpaid Leaves</div><div class="cell value">${
            salary.unpaidLeaves
          }</div></div>
        </div>
      </div>

     ${
       salary.note
         ? `
<div class="section">
  <div class="section-title">📝 Note</div>
  <div class="box" style="font-style: italic; color:#374151;">
    ${salary.note}
  </div>
</div>
`
         : ""
     }

<div class="section">
  <div class="section-title">❓ Questions or Concerns?</div>
  <div class="box">
    <p>If you have any questions about your salary breakdown, please contact our HR department:</p>
    <p><strong>Phone:</strong> ${hrPhone}</p>
    <p><strong>Email:</strong> ${hrEmail}</p>
     <p><strong>Office Hours:</strong> 10:00 AM - 5:00 PM (Except Friday)</p>

    <p style="margin-top: 15px; color: #1e40af;">
      <strong>Need to Update Your Bank Details?</strong><br />
      Please contact Head of HR Admin immediately to update your payment information.
    </p>
  </div>
</div>

<p style="font-size: 16px; color: #2c3e50; margin-top: 30px;">
  Thank you for your hard work and dedication!
</p>

<p style="font-size: 16px;">
  Best regards,<br />
  <strong>HR Department | Ringtel</strong><br />
  ${companyName}
</p>

<div class="footer">
  <p>This is an automated message. Please do not reply to this email.</p>
  <p class="company-name">${companyName}</p>
  <p>Visit our website: https://admin.billisp.com</p>
  <p>© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
</div>






    </div>
  </div>
</body>
</html>
`;

  return {
    subject: `Salary Credited - ${salary.salaryMonth} - ${companyName}`,
    text: textBody,
    html: htmlBody,
  };
};

const createReminderEmailTemplate = (reminderData) => {
  const companyName = "Ringtel";
  const supportPhone = "01601997701 or 02224442004";
  const supportEmail = "info@rtel.com.bd";

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
    }).format(amount || 0);

  const priorityColor =
    reminderData.priority === "High"
      ? "#dc2626"
      : reminderData.priority === "Medium"
      ? "#f59e0b"
      : "#16a34a";

  const textBody = `
${reminderData.subject || "Payment Reminder"}

${reminderData.message}

Due Date: ${formatDate(reminderData.dueDate)}
Amount Due: ${formatCurrency(reminderData.amountDue)}
Service: ${reminderData.serviceType}
Status: ${reminderData.status}

Please make your payment on time to avoid service interruption.

${companyName}
Support: ${supportPhone}
  `.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<style>
  body {
    margin: 0;
    padding: 0;
    background: #f3f4f6;
    font-family: Arial, sans-serif;
  }
  .container {
    max-width: 600px;
    margin: auto;
    background: #ffffff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  }
  .header {
    background: linear-gradient(135deg, #1e3a8a, #2563eb);
    color: #ffffff;
    padding: 35px;
    text-align: center;
  }
  .header h1 {
    margin: 0;
    font-size: 28px;
    letter-spacing: 1px;
  }
  .badge {
    display: inline-block;
    margin-top: 12px;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 12px;
    background: ${priorityColor};
    color: #ffffff;
    font-weight: bold;
  }
  .content {
    padding: 30px;
  }
  .alert-box {
    background: #eff6ff;
    border-left: 5px solid #2563eb;
    padding: 18px;
    border-radius: 6px;
    margin-bottom: 25px;
    color: #1e3a8a;
  }
  .amount-box {
    background: #fef3c7;
    border: 1px solid #f59e0b;
    border-radius: 10px;
    padding: 25px;
    text-align: center;
    margin: 25px 0;
  }
  .amount-box h2 {
    margin: 10px 0 0;
    font-size: 34px;
    color: #92400e;
  }
  .section-title {
    font-size: 18px;
    font-weight: bold;
    color: #111827;
    margin-bottom: 12px;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 8px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  td {
    padding: 10px 0;
    font-size: 14px;
    border-bottom: 1px dashed #e5e7eb;
  }
  td.label {
    color: #374151;
  }
  td.value {
    text-align: right;
    font-weight: bold;
    color: #111827;
  }
  .note-box {
    background: #f9fafb;
    border-left: 4px solid #6b7280;
    padding: 15px;
    border-radius: 6px;
    margin-top: 25px;
    font-style: italic;
    color: #374151;
  }
  .contact-box {
    background: #ecfeff;
    border: 1px solid #67e8f9;
    border-radius: 8px;
    padding: 20px;
    margin-top: 30px;
  }
  .footer {
    text-align: center;
    font-size: 12px;
    color: #6b7280;
    margin-top: 35px;
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
  }
</style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>${companyName}</h1>
      <p>${reminderData.reminderType || "Payment Reminder"}</p>
      <span class="badge">Priority: ${reminderData.priority || "Normal"}</span>
    </div>

    <div class="content">

      <div class="alert-box">
        ${reminderData.message}
      </div>

      <div class="amount-box">
        <div>Amount Due</div>
        <h2>${formatCurrency(reminderData.amountDue)}</h2>
        <div>Due on ${formatDate(reminderData.dueDate)}</div>
      </div>

      <div class="section-title">📄 Reminder Details</div>
      <table>
        <tr><td class="label">Service Type</td><td class="value">${
          reminderData.serviceType
        }</td></tr>
        <tr><td class="label">Package</td><td class="value">${
          reminderData.packageName || "N/A"
        }</td></tr>
        <tr><td class="label">Status</td><td class="value">${
          reminderData.status
        }</td></tr>
        <tr><td class="label">Reminder ID</td><td class="value">${
          reminderData.reminderId
        }</td></tr>
        <tr><td class="label">Scheduled At</td><td class="value">${formatDate(
          reminderData.scheduledAt
        )}</td></tr>
      </table>

      ${
        reminderData.notes
          ? `
      <div class="note-box">
        <strong>📝 Note:</strong><br/>
        ${reminderData.notes}
      </div>
      `
          : ""
      }

      <div class="contact-box">
        <strong>❓ Need Assistance?</strong>
        <p>Contact our support team:</p>
        <p><strong>Phone:</strong> ${supportPhone}</p>
        <p><strong>Email:</strong> ${supportEmail}</p>
        <p><strong>Office Hours:</strong> 10:00 AM – 5:00 PM (Except Friday)</p>
      </div>

      <p style="margin-top: 30px;">
        Thank you for choosing <strong>${companyName}</strong>.
      </p>

      <div class="footer">
        <p>This is an automated reminder. Please do not reply.</p>
        <p>© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

  return {
    subject:
      reminderData.subject ||
      `Payment Reminder - ${formatCurrency(reminderData.amountDue)} Due`,
    text: textBody,
    html: htmlBody,
  };
};




















































































































































































































//! ONE function for all reminder/warning emails
const sendReminderEmail = async (req, res, next) => {
  try {
    const {
      to, // Recipient email
      reminderData, // Reminder object from your model
    } = req.body;

    // Validate required fields
    if (!to) {
      return res.status(400).json({
        success: false,
        message: "Recipient email is required!",
      });
    }

    if (!reminderData) {
      return res.status(400).json({
        success: false,
        message: "Reminder data is required!",
      });
    }

    // Create email content
    const emailContent = createReminderEmailTemplate(reminderData);

    // Use your EXISTING sendEmail service
    const emailResult = await sendEmail({
      to: to,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send reminder email",
        error: emailResult.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reminder email sent successfully!",
      emailId: emailResult.messageId,
    });
  } catch (error) {
    console.error("Error sending reminder email:", error);
    next(error);
  }
};

//! Send account creation/verification email
const sendAccountCreationEmail = async (req, res, next) => {
  try {
    const { email } = req.params;

    // Validate required fields
    if (!email) {
      return res.status(400).json({
        message: "Client email is required!",
      });
    }

    // Find the client
    const client = await ClientInformation.findOne({
      where: { email },
      attributes: { exclude: ["password"] },
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found!",
      });
    }

    // Get package details
    let packageDetails = null;
    if (client.package) {
      packageDetails = await Package.findOne({
        where: { id: client.package },
        attributes: ["packageName", "packageBandwidth", "packagePrice"],
      });
    }

    // Prepare welcome email
    const emailContent = createWelcomeEmailTemplate(client, packageDetails);

    // Send email
    const emailResult = await sendEmail({
      to: client.email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    if (!emailResult.success) {
      return res.status(500).json({
        message: "Failed to send welcome email",
        error: emailResult.error,
      });
    }

    return res.status(200).json({
      message: "Welcome email sent successfully!",
      emailId: emailResult.messageId,
      client: {
        id: client.id,
        name: client.fullName,
        email: client.email,
        status: client.status,
      },
    });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    next(error);
  }
};

//! Send salary received email to employee
const sendSalaryReceivedEmail = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { salaryMonth } = req.query;

    // Validate required field
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required!",
      });
    }

    // Find the salary record with employee details
    // Note: Adjust this query based on your actual Salary model structure
    const employee = await AuthorityInformation.findOne({
      where: {
        userId: employeeId,
      },
    });

    const salary = await Salary.findOne({
      where: {
        employeeId: employeeId,
        salaryMonth: salaryMonth,
      },
    });

    console.log(salary);

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Employee salary information not found!",
      });
    }

    // Prepare salary email
    const emailContent = createSalaryEmailTemplate(employee, salary);

    // Send email
    const emailResult = await sendEmail({
      to: employee.email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send salary email",
        error: emailResult.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Salary email sent successfully!",
      emailId: emailResult.messageId,
    });
  } catch (error) {
    console.error("Error sending salary email:", error);
    next(error);
  }
};

// Update module.exports to include both functions
module.exports = {
  sendAccountCreationEmail,
  sendSalaryReceivedEmail,
  sendReminderEmail,
};
