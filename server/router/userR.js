import express from "express"
const router = express.Router()
import userController from "../controllers/userC.js"
import protect from "../middleware/authMiddleware.js";

router.post("/register", userController.registerUser);
router.post("/login",userController.loginUser)
router.get("/", protect,userController.allUsers);

export default router