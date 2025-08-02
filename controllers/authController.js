const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const response = require("../response");

// REGISTER USER
const register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ error: "Semua field harus diisi" });
  }

  // Cek apakah email sudah digunakan
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error saat cek email" });

    if (results.length > 0) {
      return res.status(400).json({ error: "Email sudah digunakan" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = `INSERT INTO users (id, firstname, lastname, email, password, role) VALUES (UUID(), ?, ?, ?, ?, 'user')`;

      db.query(sql, [firstname, lastname, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: "Gagal insert user" });
        response(201, result, "User registered successfully", res);
      });
    } catch (err) {
      res.status(500).json({ error: "Error saat hash password" });
    }
  });
};

// LOGIN USER
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email dan password wajib diisi" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.length === 0) return res.status(401).json({ error: "User tidak ditemukan" });

    const user = result[0];

    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: "Password salah" });

      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ error: "JWT_SECRET belum diset di .env" });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
      );

      res.json({
        message: "Login berhasil",
        token,
        user: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Error saat membandingkan password" });
    }
  });
};

module.exports = {
  register,
  login,
};
