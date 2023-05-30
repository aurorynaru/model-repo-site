import express from 'express'
import { getModels } from '../controllers/models.js'

import { verifyToken } from '../middleware/authorization.js'

const router = express.Router()

//read
router.get('/', getModels)

export default router
