// require dependencies
const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = require('./db');
require("console.table");

init();

function init() {
    mainPrompt();
}
// prompt user with the main menu
async function mainPrompt() {
    // prompt user for menu choice
    const { choice } = await inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "what would you like to do?",
            choices: [
                {
                    name: "view employees",
                    value: "VIEW_EMPLOYEES"
                },
                // {
                //     name: "view employees by department",
                //     value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
                // },
                // {
                //     name: "view employees by manager",
                //     valeu: "VIEW_EMPLOYEES_BY_MANAGER"
                // },
                {
                    name: "add employee",
                    value: "ADD_EMPLOYEE"
                },
                // {
                //     name: "delete employee",
                //     value: "DELETE_EMPLOYEE"
                // },
                {
                    name: "update employee role",
                    value: "UPDATE_EMPLOYEE_ROLE"
                },
                // {
                //     name: "update employee manager",
                //     value: "UPDATE_EMPLOYEE_MANAGER"
                // },
                {
                    name: "view all roles",
                    value: "VIEW_ROLES"
                },
                {
                    name: "add role",
                    value: "ADD_ROLE"
                },
                // {
                //     name: "delete role",
                //     value: "DELETE_ROLE"
                // },
                {
                    name: "view all departments",
                    value: "VIEW_DEPARTMENTS"
                },
                {
                    name: "quit?",
                    value: "QUIT"
                }
            ]
        }
    ]);
    // route user to appropriate function based on choice
    switch (choice) {
        case "VIEW_EMPLOYEES":
            return viewEmployees();
        case "VIEW_EMPLOYEES_BY_DEPARTMENT":
            return viewEmployeesByDepartment();
        case "ADD_EMPLOYEE":
            return addEmployee();
        case "UPDATE_EMPLOYEE_ROLE":
            return updateEmployeeRole();
        case "VIEW_DEPARTMENTS":
            return viewDepartments();
        case "ADD_DEPARTMENT":
            return addDepartment();
        case "VIEW_ROLES":
            return viewRoles();
        case "ADD_ROLE":
            return addRole();
        default:
            return quit();
    }
}
// query database for all employees
async function viewEmployees() {
    const employees = await db.findEmployees();

    console.table(employees);

    mainPrompt();
}
// query the database for employees based on the departments
async function viewEmployeesByDepartment() {
    const departments = await db.findDepartments();

    const userDepartmentChoice = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    const { departmentId } = await inquirer.prompt([
        {
            type: "list",
            name: "departmentId",
            message: "which department would you like to choose?",
            choices: userDepartmentChoice
        }
    ]);

    const employees = await db.findEmployeesByDepartment(departmentId);

    console.table(employees);

    mainPrompt();
}

async function updateEmployeeRole() {
    // get all the employees from the database
    const employees = await db.findEmployees();
    // map the employees to {name: full name, value: id} array for prompt choices
    const userEmployeeChoice = employees.map(({ id, first_name, last_name }) => ({
        name: first_name + ' ' + last_name,
        value: id,
    }));
    // prompt user to select an employee
    const { employeeId } = await inquirer.prompt([
        {
            type: "list",
            name: "employeeId",
            message: "which employee's role would you like to update?",
            choices: userEmployeeChoice
        }
    ]);
    // get all roles from database
    const roles = await db.findRoles();
    // map roles to {name: title, value: id} array for prompt choices
    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));
    // prompt user to select a role
    const { roleId } = await inquirer.prompt([
        {
            type: "list",
            name: "roleId",
            message: "which role do you want to assign to the employee?",
            choices: roleChoices
        }
    ]);
    // update employee role using database function
    await db.updateEmployeeRole(employeeId, roleId);

    console.log("successfully updated employee role!");

    mainPrompt();
}

async function viewRoles() {
    const roles = await db.findRoles();

    console.table(roles);

    mainPrompt();
}

async function addRole() {
    const departments = await db.findDepartments();

    const userDepartmentChoice = departments.map(({ id, name }) => ({
        name: name,
        value: id,
    }));

    const role = await inquirer.prompt([
        {
            name: "title",
            message: "name of role?"
        },
        {
            name: "salary",
            message: "salary of the role?"
        },
        {
            type: "list",
            name: "department_id",
            message: "which department does this role work for?",
            choices: userDepartmentChoice
        }
    ]);

    await db.createRole(role);

    console.log(`${role.title} added to database.`);

    mainPrompt();
}

async function viewDepartments() {
    const departments = await db.findDepartments();

    console.table(departments);

    mainPrompt();
}

async function addDepartment() {
    const department = await inquirer.prompt([
        {
            name: "name",
            message: "what is the name of the department?"
        }
    ]);

    await db.createDepartment(department);

    console.log(`${department.name} added to the database.`);

    mainPrompt();
}

async function addEmployee() {
    const roles = await db.findRoles();
    const employees = await db.findEmployees();

    const employee = await inquirer.prompt([
        {
            name: "first_name",
            message: "what is employee's first name?",
        },
        {
            name: "last_name",
        }
    ]);

    const userRoleChoice = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    const { roleId } = await inquirer.prompt([
        {
            type: "list",
            name: "roleId",
            message: "what is the employee's role?",
            choices: userRoleChoice
        }
    ]);

    employee.role_id = roleId;

    const userManagerChoices = employees.map(({ id, first_name, last_name }) => ({
        name: first_name + ' ' + last_name,
        value: id,
    }));
    userManagerChoices.unshift({ name: "none", value: null });

    const { managerId } = await inquirer.prompt([
        {
            type: "list",
            name: "managerId",
            message: "who is the employee's manager?",
            choices: userManagerChoices
        }
    ]);

    employee.manager_id = managerId;

    await db.createEmployee(employee);

    console.log(`${employee.first_name} ${employee.last_name} added to the database.`);

    mainPrompt();
}

function quit() {
    console.log("adios~");
    process.exit();
}