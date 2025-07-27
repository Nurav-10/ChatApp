import { Router } from "express";
import { createMessage, deleteMessage, getPrivateChats } from "../controllers/chatController.js";
const router=Router()

router.post('/createChat',createMessage)
router.get('/getChats',getPrivateChats)
router.delete('/deleteMessage',deleteMessage)

export default router