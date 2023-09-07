const connection = require('./connection.js');

class DB {
    constructor(connection) {
        this.connection = connection;
    }

    findEmployees() {
        return this.connection.query(
            'SELECT * FROM employee'
        );
    }

    findManagers(employeeId) {
        return this.connection.query(
            "SELECT id, first_name, last_name FROM employee WHERE id != ?",
            employeeId
        );
    }

    createEmployee(employee) {
        return this.connection.query("INSERT INTO employee SET ?", employee);
    }

    updateEmployeeRole(employeeId, roleId) {
        return this.connection.query(
            'UPDATE employee Set role_id = ? WHERE id = ?',
            [roleId, employeeId]
        );
    }

    updateEmployeeManager(employeeId, managerId) {
        return this.connection.query(
            'UPDATE employee SET role_id = ? WHERE id = ?',
            [managerId, employeeid]
        );
    }

    findRoles() {
        return this.connection.query(
            'SELECT * FROM role'
        );
    }

    createRole(role) {
        return this.connection.query(
            'INSERT INTO role SET ?', role
        );
    }

    findDepartments() {
        return this.connection.query(
            'SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM department LEFT JOIN role ON role.department_id = department.id LEFT JOIN employee ON employee.role_id = role.id GROUP BY department.id, department.name'
        );
    }

    createDepartment(department) {
        return this.connection.query(
            'INSERT INTO department SET ?', department
        );
    }

    findEmployeesByDepartment(departmentId) {
        return this.connection.query(
            'SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id WHERE department.id = ?;',
            departmentId
        );
    }

    findEmployeesByManager(managerId) {
        return this.connection.query(
            'SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOINM department ON department.id = role.department_id WHERE manager_id = ?;',
            managerId
        );
    }
}

module.exports = new DB(connection);