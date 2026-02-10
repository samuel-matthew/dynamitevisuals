import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  let token;

  // Check for token in cookies (httpOnly) first, then Authorization header
  token = req.cookies.token;

  if (!token) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7, authHeader.length);
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
    req.user = decoded;
    next();
  });
};
