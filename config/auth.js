const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(403).json({ error: "Access denied. No token provided"});
  try {
    const decode = jwt.verify(token, process.env.SECRETKEY);
    req.user = decode;
    next();
  }
  catch(err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}