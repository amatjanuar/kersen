const db = require('../config/db');
const response = require('../response');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


function getUsers(req, res) {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    response(200, result, "All users", res);
  });
}


async function createUser(req, res) {
  const { firstname, lastname, email, password, role } = req.body;
  const id = uuidv4();

  if (!["superadmin", "customer"].includes(role.toLowerCase())) {
    return res.status(400).json({ error: "Role hanya boleh superadmin atau customer" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (id, firstname, lastname, email, password, role) VALUES (?, ?, ?, ?, ?, ?)",
    [id, firstname, lastname, email, hashedPassword, role],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      response(201, { id, firstname, lastname, email, role }, "User created", res);
    }
  );
}


function updateUser(req, res) {
  const id = req.params.id; // ID dari URL, misalnya /users/:id
  const { firstname, lastname, email } = req.body;

  if (!firstname || !lastname || !email) {
    return res.status(400).json({ error: "Firstname, lastname, dan email wajib diisi" });
  }

  const sql = `
    UPDATE users
    SET firstname = ?, lastname = ?, email = ?
    WHERE id = ?
  `;

  db.query(sql, [firstname, lastname, email, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }
    response(200, result, "User berhasil diupdate berdasarkan ID", res);
  });
}


const deleteUser = (req, res) => {
  const userIdToDelete = req.params.id; // ID dari URL, misalnya /users/:id

  if (!userIdToDelete) {
    return res.status(400).json({ error: "ID user tidak ditemukan di parameter" });
  }

  const sql = `DELETE FROM users WHERE id = ?`;

  db.query(sql, [userIdToDelete], (err, result) => {
    if (err) return res.status(500).json({ error: "Gagal menghapus user" });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    response(200, { id: userIdToDelete }, "User berhasil dihapus", res);
  });
};


const changePassword = async (req, res) => {
  const userId = req.user.id; // dari token
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return response(400, null, "Old and new password are required", res);
  }

  // Ambil password lama dari DB
  db.query("SELECT password FROM users WHERE id = ?", [userId], async (err, result) => {
    if (err) return response(500, null, "Database error", res);
    if (result.length === 0) return response(404, null, "User not found", res);

    const match = await bcrypt.compare(oldPassword, result[0].password);
    if (!match) {
      return response(401, null, "Old password is incorrect", res);
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    db.query("UPDATE users SET password = ? WHERE id = ?", [hashedNewPassword, userId], (err2) => {
      if (err2) return response(500, null, "Failed to update password", res);
      return response(200, null, "Password updated successfully", res);
    });
  });
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    changePassword
}