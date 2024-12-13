const express = require("express");
const { getSequelizeInstance } = require("../database/database");
const UserModel = require("../database/models/user");

const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const sequelize = getSequelizeInstance();
        const User = UserModel(sequelize);

        // Check if the user already exists
        const existingUser = await User.findOne({
            where: {
                [sequelize.Sequelize.Op.or]: [{ username }, { email }],
            },
        });

        if (existingUser) {
            return res.status(409).json({ error: "Username or email already in use." });
        }

        // Create a new user
        await User.create({ username, email, password });

        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: "An unexpected error occurred during registration." });
    }
});

module.exports = router;
