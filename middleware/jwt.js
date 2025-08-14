const jwt = require("jsonwebtoken");

const secretKey = "Rudra";

// Middleware to verify JWT
const tokenVerification = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, secretKey, (err, payload) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // Attach userId to request for later use
    req.userId = payload.user_id;
    next();
  });
};

module.exports = tokenVerification;
