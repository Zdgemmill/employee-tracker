const sequelize = require("../config/connection");
const { Department, Role, Employee } = require("../models");
const departmentData = require("./departmentSeed.js");
const roleData = require("./roleSeed.js");
const employeeData = require("./employeeSeed.js");

async function seedDatabase() {
    try {
        await sequelize.sync({ force: true });

        const departments = await Department.bulkCreate(departmentData, {
            individualHooks: true,
            returning: true,
        });

        const roles = await Role.bulkCreate(roleData, {
            individualHooks: true,
            returning: true,
        });

        const employees = await Employee.bulkCreate(employeeData, {
            individualHooks: true,
            returning: true,
        });

        console.log("Database seeding completed successfully.");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
}

seedDatabase();