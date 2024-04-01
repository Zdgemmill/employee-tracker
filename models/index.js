const Department = require("./department");
const Employee = require("./employee");
const Role = require("./roles");

// departments have many roles
Department.hasMany(Role, {
    foreignKey: "department_id",
    onDelete: "CASCADE",
});
Role.belongsTo(Department, {
    foreignKey: "department_id",
    onDelete: "CASCADE",
});

// employees have one role
Role.hasOne(Employee, {
    foreignKey: "role_id",
    onDelete: "CASCADE",
});
// employees have one manager
Employee.hasOne(Employee, {
    foreignKey: "manager_id",
    onDelete: "CASCADE",
});

module.exports = { Department, Role, Employee };