use employees;

INSERT INTO department (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Pericles', 'Homer', 1, NULL),
    ('Isolde', 'Dante', 2, 1),
    ('Dorian', 'Chaucer', 3, NULL),
    ('Gwendolyn', 'Marlowe', 4, 3),
    ('Cordelia', 'Milton', 5, NULL),
    ('Mercutio', 'Swift', 6, 5),
    ('Antony', 'Wordsworth', 7, NULL),
    ('Ophelia', 'Austen', 8, 7);