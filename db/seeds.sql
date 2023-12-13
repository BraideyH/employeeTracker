INSERT INTO department
  (name)
VALUES
  ('Physicians'),
  ('Nursing'),
  ('EVS'),
  ('Dietary');

INSERT INTO role
  (title, salary, department_id)
VALUES
  ('ED Provider', 100000, 1),
  ('ED RN', 80000, 2),
  ('EVS Tech', 60000, 3),
  ('Dietary Aide', 40000, 4);

INSERT INTO employee
  (first_name, last_name, role_id, manager_id)
VALUES
  ('John', 'Doe', 1, 3),
  ('Jane', 'Doe', 2, 1),
  ('John', 'Cena', 3, 4),
  ('Jesus', 'Christ', 4, 2);