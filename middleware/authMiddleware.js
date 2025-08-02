const jwt = require("jsonwebtoken");

// Middleware autentikasi
const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token tidak ditemukan" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token tidak valid" });
    req.user = user;
    next();
  });
};

// Middleware otorisasi superadmin
const authorizeSuperadmin = (req, res, next) => {
  if (req.user && req.user.role === "superadmin") {
    next();
  } else {
    return res.status(403).json({ error: "Akses ditolak, bukan superadmin" });
  }
};

module.exports = { authenticate, authorizeSuperadmin };
