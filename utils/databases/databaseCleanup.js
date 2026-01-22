const sequelize = require("../../database/connection");



const deleteAllDataFromAllTable = async (req, res, next) => {

  try {
    // Get all tables - use lowercase column names to be safe
    const [tables, metadata] = await sequelize.query(
      `SELECT table_name as tableName FROM information_schema.tables 
       WHERE table_schema = DATABASE() 
       AND table_type = 'BASE TABLE'`,
    );

    // Handle different possible column names
    const tableNames = tables.map(
      (t) => t.tableName || t.TABLE_NAME || t.tablename || t.TableName,
    );

    if (tableNames.length === 0) {
      return res.json({
        success: true,
        message: "No tables found to delete",
      });
    }

    // Turn off foreign key checks
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    // Delete everything from each table
    const deletedTables = [];
    for (const table of tableNames) {
      if (!table) continue; // Skip undefined table names

      try {
        await sequelize.query(`DELETE FROM \`${table}\``);
        deletedTables.push(table);
      } catch (tableError) {
        console.error(`❌ Failed to delete from ${table}:`, tableError.message);
      }
    }

    // Reset auto-increment counters
    for (const table of deletedTables) {
      try {
        await sequelize.query(`ALTER TABLE \`${table}\` AUTO_INCREMENT = 1`);
      } catch (error) {
        console.log(
          `ℹ️ Could not reset auto-increment for ${table}:`,
          error.message,
        );
      }
    }

    // Turn foreign key checks back on
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    res.json({
      success: true,
      message: `Deleted all data from ${deletedTables.length} tables`,
      deletedTables: deletedTables,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Try to re-enable foreign key checks even on error
    try {
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    } catch (fkError) {
      console.error("Failed to re-enable foreign key checks:", fkError);
    }

    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message,
      details: error.toString(),
    });
  }
};


module.exports = {
  deleteAllDataFromAllTable
};
