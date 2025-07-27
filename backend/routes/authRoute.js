import express from 'express'
import { Router } from 'express'
import { Login, SignUp } from '../controllers/userController.js'

const router=Router()

router.post('/signup',SignUp)
router.post('/signin',Login)


export default router;