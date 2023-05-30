import express from 'express'
import { verifyToken } from '../middleware/authorization.js'
import { login } from '../controllers/auth.js'

const router = express.Router()

router.post('/login', login)

export default router
