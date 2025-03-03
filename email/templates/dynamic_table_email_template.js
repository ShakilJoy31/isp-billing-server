function dynamic_table_tr(keyValues = {}) {
  return Object.entries(keyValues).map(([key, value]) => {
    if (!value) return ``;

    return `
    <tr>
        <th style="padding: 6px 10px; text-align: left"> ${key}:</th>
        <td style="padding: 6px 10px; text-align: left">${value}</td>
     </tr> `;
  });
}


const dynamic_table_email_template = ({ key_values }) => {
  return `  
      <table
        style="width: 100%; border-collapse: collapse; font-family: Arial, Helvetica, sans-serif;"
        border="1px"
        bordercolor="#ddd"
      >
        <tbody> 
          ${dynamic_table_tr(key_values).join("")}          
        </tbody>
        </table>  
        `;
};

exports.dynamic_table_tr = dynamic_table_tr
module.exports = dynamic_table_email_template;