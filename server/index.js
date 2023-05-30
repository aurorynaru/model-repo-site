import express from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import multer from 'multer'

//controllers
import { register } from './controllers/auth.js'
import { createModelPost } from './controllers/models.js'
import { getModels } from './controllers/models.js'

//middleware
import { processAvatar } from './middleware/formatImgAvatar.js'
import { checkFiles } from './middleware/checkFiles.js'
import { verifyToken } from './middleware/authorization.js'

//routes import
import authRoutes from './routes/auth.js'
import postRoutes from './routes/posts.js'

const app = express()
dotenv.config()
app.use(cors())
app.use(helmet())
app.use(morgan('common'))
app.use(express.json())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(bodyParser.json({ limit: '1500mb', extended: 'true' }))
app.use(bodyParser.urlencoded({ limit: '1500mb', extended: 'true' }))

const URL = process.env.MONGO_URL
const PORT = process.env.PORT

// routes with files
const upload = multer({ storage: multer.memoryStorage() })

app.post('/register', upload.single('image'), processAvatar, register)
//add verify Token
app.post('/models/post', upload.array('files'), checkFiles, createModelPost)

//routes

app.use('/', authRoutes)
app.use('/home', postRoutes)
app.use('/models', postRoutes)
mongoose
    .connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Listening on port: ${PORT}`)
        })
    })
    .catch((err) => {
        console.log(`error: ${err}`)
    })
