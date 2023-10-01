import express from "express"
const router = express.Router()
import protect from "../middleware/authMiddleware.js"
import chatControllers from "../controllers/chatC.js"

router.post("/",protect,chatControllers.accessChat) //creating and fetching one one chat
router.get("/",protect,chatControllers.fetchChat)
router.post("/group",protect,chatControllers.createGroup)
router.put("/rename",protect,chatControllers.renameGroup)
router.put("/addToGroup",protect,chatControllers.addToGroup)
router.put("/removeToGroup",protect,chatControllers.removeFromGroup)



export default router