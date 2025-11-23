import jwt from "jsonwebtoken";

export const authMiddleWare = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.userId = decoded.userId;
    next();
  } catch {
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid token or expired token" });
  }
};
