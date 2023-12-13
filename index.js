const inquirer = require('inquirer');
const db = require('./db/connection');

db.connect(err => {
    if (err) throw err;
    console.log('Connection to database secured.');
    employeeTracker();
})

var employeeTracker = function () {
    inquirer.prompt([{
        type: 'list',
        name: 'prompt',
        message: 'What would you like to do?',
        choices: ['View Roles', 'View Departments', 'View Employees', 'Add an Employee', 'Add A Department', 'Add A Role', 'Update An Employee Role', 'Log Out']
    }]).then((answers) => {
        if (answers.prompt === 'View Departments') {
            db.query(`SELECT * FROM department`, (err, result) => {
                if (err) throw err;
                console.log("Viewing Departments: ");
                console.table(result);
                employeeTracker();
            });
        } else if (answers.prompt === 'View Roles') {
            db.query(`SELECT * FROM role`, (err, result) => {
                if (err) throw err;
                console.log("Viewing Roles: ");
                console.table(result);
                employeeTracker();
            });
        } else if (answers.prompt === 'View Employees') {
            db.query(`SELECT * FROM employee`, (err, result) => {
                if (err) throw err;
                console.log("Viewing Employees: ");
                console.table(result);
                employeeTracker();
            });
        } else if (answers.prompt === 'Add A Department') {
            inquirer.prompt([{
                type: 'input',
                name: 'department',
                message: 'What is the name of the department you would like to add?',
                validate: departmentInput => {
                    if (departmentInput) {
                        return true;
                    } else {
                        console.log('Add a department.');
                        return false;
                    }
                }
            }]).then((answers) => {
                db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, result) => {
                    if (err) throw err;
                    console.log(`Added ${answers.department} to the database.`)
                    employeeTracker();
                });
            })
        } else if (answers.prompt === 'Add A Role') {
            db.query(`SELECT * FROM department`, (err, result) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'role',
                        message: 'What is the name of the role?',
                        validate: roleInput => {
                            if (roleInput) {
                                return true;
                            } else {
                                console.log('Add A Role.');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'What is the salary for this role?',
                        validate: salaryInput => {
                            if (salaryInput) {
                                return true;
                            } else {
                                console.log('Add a salary.');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Which department is this role for?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].name);
                            }
                            return array;
                        }
                    }
                ]).then((answers) => {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].name === answers.department) {
                            var department = result[i];
                        }
                    }
                    db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?,)`, [answers.role, answers.salary, department.id], (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${ansers.role} to the database.`)
                        employeeTracker();
                    });
                })
            });
        } else if (answers.prompt === 'Add an Employee') {
            db.query(`SELECT * FROM employee, role`, (err, result) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: 'What is your employees first name?',
                        validate: firstNameInput => {
                            if (firstNameInput) {
                                return true;
                            } else {
                                console.log('Add a first name for your employee.');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'What is the employees last name?',
                        validate: lastNameInput => {
                            if (lastNameInput) {
                                return true;
                            } else {
                                console.log('Add a last name for your employee.');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'role',
                        message: 'What is this employees role?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].title);
                            }
                            var newArray = [...new Set(array)];
                            return newArray;
                        }
                    },
                    {
                        type: 'input',
                        name: 'manager',
                        message: 'Who is this employees manager?',
                        validate: managerInput => {
                            if (managerInput) {
                                return true;
                            } else {
                                console.log('Provide the managers name.');
                                return false;
                            }
                        }
                    }
                ]).then((answers) => {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].title === answers.role) {
                            var role = result[i];
                        }
                    }
                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, role.id, answers.manager.id], (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`)
                        employeeTracker();
                    });
                })
            });
        } else if (answers.prompt === 'Update An Employee Role') {
            db.query(`SELECT * FROM employee, role`, (err, result) => {
                if (err) throw err;
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'Which employees role do you want to update?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].last_name);
                            }
                            var employeeArray = [...new Set(array)];
                            return employeeArray;
                        }
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Update to which role?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].title);
                            }
                            var newArray = [...new Set(array)];
                            return newArray;
                        }
                    }
                ]).then((answers) => {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].last_name === answers.employee) {
                            var name = result[i];
                        }
                    }
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].title === answers.role) {
                            var role = result[i];
                        }
                    }
                    db.query(`UPDATE employee SET ? WHERE ?`, [{ role_id: role }, { last_name: name }], (err, result) => {
                        if (err) throw err;
                        console.log('Updated ${answers.employee} role to the database.')
                        employeeTracker();
                    });
                })
            });
        } else if (answers.promp === 'Log Out') {
            db.end();
            console.log("Logout Succesful.");
        }
    })
};