import inquirer from "inquirer";
import { Department, Employee, Role } from "./models/index.js";

async function init() {
    try {
        const response = await inquirer.prompt({
            type: "list",
            name: "start",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee's role",
                "Update an employee's manager",
                "View a department's budget",
                "Exit",
            ],
        });

        switch (response.start) {
            case "View all departments":
                await viewEntities(Department);
                break;
            case "View all roles":
                await viewEntities(Role);
                break;
            case "View all employees":
                await viewEntities(Employee);
                break;
            case "Add a department":
                await addEntity("department");
                break;
            case "Add a role":
                await addEntity("role");
                break;
            case "Add an employee":
                await addEntity("employee");
                break;
            case "Update an employee's role":
                await updateEmployeeRole();
                break;
            case "Update an employee's manager":
                await updateEmployeeManager();
                break;
            case "View a department's budget":
                await viewBudget();
                break;
            case "Exit":
                process.exit(0);
        }
    } catch (err) {
        console.log(err);
    }
}

async function viewEntities(model) {
    const data = await model.findAll();
    console.table(data.map((item) => item.dataValues));
    init();
}

async function addEntity(entityType) {
    const prompts = {
        department: [{ type: "input", name: "name", message: "Enter department name:" }],
        role: [
            { type: "input", name: "title", message: "Enter role title:" },
            { type: "number", name: "salary", message: "Enter role salary:" },
            { type: "input", name: "departmentId", message: "Enter department ID for this role:" },
        ],
        employee: [
            { type: "input", name: "first_Name", message: "Enter employee's first name:" },
            { type: "input", name: "last_Name", message: "Enter employee's last name:" },
            { type: "input", name: "roleId", message: "Enter role ID for this employee:" },
            { type: "input", name: "managerId", message: "Enter manager ID for this employee:" },
        ],
    };

    try {
        const model = entityType === 'department' ? Department : entityType === 'role' ? Role : Employee;
        const responses = await inquirer.prompt(prompts[entityType]);
        await model.create(responses);
        console.log(`${entityType} added successfully!`);
    } catch (err) {
        console.log(err);
    }

    init();
}

async function updateEmployeeRole() {
    try {
        const employeeData = await Employee.findAll();
        const employees = employeeData.map((emp) => {
            return { id: emp.dataValues.id, name: emp.dataValues.first_name + " " + emp.dataValues.last_name };
        });
        const roleData = await Role.findAll();
        const roles = roleData.map((role) => {
            return { id: role.dataValues.id, title: role.dataValues.title };
        });

        const response = await inquirer.prompt([
            {
                type: "list",
                choices: employees.map((item) => item.name),
                name: "employee",
                message: "Which employee's role would you like to update?",
            },
            {
                type: "list",
                choices: roles.map((item) => item.title),
                name: "roleTitle",
                message: "Select the new role for the employee:",
            },
        ]);

        const employeeId = employees.find((item) => item.name === response.employee).id;
        const roleId = roles.find((item) => item.title === response.roleTitle).id;

        await Employee.update(
            { role_id: roleId },
            { where: { id: employeeId } }
        );

        console.log("Employee's role updated successfully!");
    } catch (err) {
        console.log(err);
    }

    init();
}

async function updateEmployeeManager() {
    try {
        const employeeData = await Employee.findAll();
        const employees = employeeData.map((emp) => {
            return { id: emp.dataValues.id, name: emp.dataValues.first_name + " " + emp.dataValues.last_name };
        });

        const response = await inquirer.prompt([
            {
                type: "list",
                choices: employees.map((item) => item.name),
                name: "employee",
                message: "Which employee's manager would you like to update?",
            },
            {
                type: "list",
                choices: employees.map((item) => item.name).concat(["None"]),
                name: "manager",
                message: "Select the new manager for the employee:",
            },
        ]);

        const employeeId = employees.find((item) => item.name === response.employee).id;
        const managerId = response.manager !== "None" ? employees.find((item) => item.name === response.manager).id : null;

        await Employee.update(
            { manager_id: managerId },
            { where: { id: employeeId } }
        );

        console.log("Employee's manager updated successfully!");
    } catch (err) {
        console.log(err);
    }

    init();
}

async function viewBudget() {
    try {
        const departmentData = await Department.findAll();
        const departments = departmentData.map((dep) => {
            return { id: dep.dataValues.id, name: dep.dataValues.name };
        });

        const response = await inquirer.prompt([
            {
                type: "list",
                choices: departments.map((item) => item.name),
                name: "department",
                message: "Select a department to view its budget.",
            },
        ]);

        const selectedDepartmentId = departments.find((item) => item.name === response.department).id;
        const roleData = await Role.findAll({ where: { department_id: selectedDepartmentId } });
        const sumSalaries = roleData.reduce((total, role) => total + role.salary, 0);

        console.log(`The total budget for ${response.department} department is: $${sumSalaries}`);
    } catch (err) {
        console.log(err);
    }

    init();
}

init();
