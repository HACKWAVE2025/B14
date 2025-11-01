const jwt = require("jsonwebtoken");

function authenticateUser(req, res, next) {
  const token = req.header("authorization").split(" ")[1];
  console.log(token) // Extract token from the Authorization header
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}


module.exports = authenticateUser;
