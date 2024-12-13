const express = require("express");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const chalk = require("chalk");
const WebSocket = require("ws");
const { initializeDatabase, getSequelizeInstance } = require("./database/database");
const UserModel = require("./database/models/user");

// Create an express application
const app = express();

// Middleware configuration
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// WebSocket server setup
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// WebSocket clients
const clients = [];

// Add WebSocket connection handling
wss.on("connection", (ws) => {
    console.log(chalk.green("WebSocket connection established."));
    clients.push(ws);

    ws.on("close", () => {
        console.log(chalk.yellow("WebSocket connection closed."));
        const index = clients.indexOf(ws);
        if (index !== -1) {
            clients.splice(index, 1);
        }
    });
});

// Broadcast function
const broadcast = (message) => {
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};

// Database initialization
(async () => {
    try {
        console.log("Using MySQL as the database.");

        // Initialize and test the database connection
        await initializeDatabase();
        const sequelize = getSequelizeInstance();
        console.log(chalk.green("Sequelize instance initialized successfully."));

        // Initialize models
        const User = UserModel(sequelize);
        console.log(chalk.green("User model initialized successfully."));

        // Synchronize models with the database
        await sequelize.sync({ alter: true });
        console.log(chalk.green("All models synchronized successfully."));
    } catch (error) {
        console.error(chalk.red("Failed to initialize database or synchronize models:"), error);
        process.exit(1);
    }
})();

// Import route modules
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");

// Mount routes
app.use("/login", loginRoutes);
app.use("/register", registerRoutes);

// Serve the index.html page for unauthenticated users
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Serve dashboard.html for authenticated users
app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// Listen on the specified port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(chalk.green(`Server running on port ${PORT}`));
});
