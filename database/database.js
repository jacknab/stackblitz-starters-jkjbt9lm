const { Sequelize } = require("sequelize");

// Database connection setup
const sequelize = new Sequelize("systemcore", "root", "1825Logan305!", {
    host: "217.77.6.131",
    dialect: "mysql",
    logging: console.log, // Log SQL queries
});

async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        console.log("Database connection established successfully.");
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    }
}

function getSequelizeInstance() {
    return sequelize;
}

module.exports = { initializeDatabase, getSequelizeInstance };
