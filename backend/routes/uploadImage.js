import { Router } from "express";
import {uploadImage,uploadImageDb} from "../controllers/uploadImageController.js";

const router=Router()

router.post('/uploadImage/generate-signature',uploadImage)
router.patch('/uploadImage/db',uploadImageDb)

export default router;