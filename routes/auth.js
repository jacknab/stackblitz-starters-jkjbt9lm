const express = require("express");
const jwt = require("jsonwebtoken");
const { getSequelizeInstance } = require("../database/database");
const UserModel = require("../database/models/user");

const router = express.Router();
const SECRET_KEY = "your_secret_key"; // Use an environment variable in production

// Register Route
router.post("/register", async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const sequelize = getSequelizeInstance();
        const User = UserModel(sequelize);

        const userExists = await User.findOne({ where: { username } });
        if (userExists) {
            return res.status(400).json({ error: "Username already exists." });
        }

        const newUser = await User.create({ username, password, email });
        res.status(201).json({ message: "User registered successfully.", userId: newUser.id });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "An error occurred during registration." });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }

    try {
        const sequelize = getSequelizeInstance();
        const User = UserModel(sequelize);

        const user = await User.findOne({ where: { username } });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, {
            expiresIn: "1h",
        });

        res.json({ message: "Login successful.", token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "An error occurred during login." });
    }
});

// Logout Route (Optional for JWT-based apps)
router.post("/logout", (req, res) => {
    // Just a placeholder; JWT-based apps usually handle logout on the client side
    res.json({ message: "Logout successful." });
});

module.exports = router;
