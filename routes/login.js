const express = require("express");
const { getSequelizeInstance } = require("../database/database");
const UserModel = require("../database/models/user");
const jwt = require("jsonwebtoken");

const router = express.Router();
const SECRET_KEY = "your_secret_key"; // Replace with a secure key or environment variable

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }

    try {
        const sequelize = getSequelizeInstance();
        const User = UserModel(sequelize);

        // Find the user by username
        const user = await User.findOne({ where: { username } });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid username or password." });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ message: "Login successful.", token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "An unexpected error occurred during login." });
    }
});

module.exports = router;
