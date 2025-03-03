const Setting = require("../../models/Setting");
const SendEmail = require("../../email/SendEmail");

module.exports = async (req, res) => {
  const setting = await Setting.findOne({ where: { id: 1 } });

  const { name, email, subject, message } = req.body;

  SendEmail(
    setting?.client?.email || "bangladeshisoftware@gmail.com",
    ` ${subject} by ${name}`,
    `
     <table style="font-family: Arial, Helvetica, sans-serif; ">
       <tr> 
        <td> <div>Name: ${name}</div> </td>
        </tr>
        <tr>
          <td> <div>Email: ${email}</div> </td>
        </tr>
        <tr>
          <td> <div>Subject: ${subject}</div> </td>
        </tr>
        <tr>
         <td> 
          <div> 
           <br >
           <p> <b>Message:</b> ${message} </p>
          </div>
         </td>
       </tr>
     </table>
    `
  );

  res.cookie("message", "Message sent!");
  res.redirect(`/contact`);
};
