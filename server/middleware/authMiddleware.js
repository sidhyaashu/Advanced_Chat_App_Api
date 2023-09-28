import jwt from "jsonwebtoken"
import User from "../models/userM.js"
import handler from "express-async-handler"

const protect = handler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      /**Decode id */
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decode.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Unauthorized token not found" });
  }
});

export default protect;