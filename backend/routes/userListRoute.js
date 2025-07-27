import express from 'express'
import { Router } from 'express'
import {  getUserSideBar } from '../controllers/chatController.js';

const router=Router()

router.get('/userList',getUserSideBar)


export default router;