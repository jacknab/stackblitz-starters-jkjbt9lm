module.exports = {
    database: {
        type: "mysql", // Switched from sqlite to mysql
        sqlite: {
            path: "./data/database.sqlite"
        },
        mysql: {
            host: "217.77.6.131",
            port: 3306,
            user: "root", // MySQL username updated as provided
            password: "1825Logan305!", // MySQL password updated as provided
            database: "systemcore" // Database from the SQL file
        },
        postgresql: {
            host: "217.77.6.131",
            port: 5432,
            user: "postgres",
            password: "password",
            database: "app_db"
        }
    }
};