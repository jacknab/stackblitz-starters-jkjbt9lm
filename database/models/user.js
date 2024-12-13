const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    if (!sequelize) {
        console.error("Sequelize instance is undefined.");
        throw new Error("Sequelize instance is required to initialize the User model.");
    }

    return sequelize.define("User", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
    }, {
        tableName: "users", // Table name in the database
        timestamps: false, // Disable automatic timestamp columns
    });
};
