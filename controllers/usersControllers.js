const db = require('../config/db');
const response = require('../response');
const { v4: uuidv4 } = require('uuid');

function getUsers(req, res) {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    response(200, result, "All users", res);
  });
}

function createUser(req, res) {
  const { firstname, lastname, email, password, role } = req.body;
  const id = uuidv4();
  db.query(
    "INSERT INTO users (id, firstname, lastname, email, password, role) VALUES (?, ?, ?, ?, ?, ?)",
    [id, firstname, lastname, email, password, role],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      response(201, { id }, "User created", res);
    }
  );
}


module.exports = {
    getUsers,
    createUser
}