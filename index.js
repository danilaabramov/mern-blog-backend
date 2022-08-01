import express from 'express'
import multer from 'multer'
import cors from 'cors'

import mongoose from "mongoose"

import {registerValidation, loginValidation, postCreateValidation} from './validations.js'

import { handleValidationErrors, checkAuth, checkHack } from './utils/index.js'

import { UserController, PostController } from './controllers/index.js'

mongoose.connect("mongodb+srv://danila:1234qwer@cluster0.wiw6q.mongodb.net/mern-blog?retryWrites=true&w=majority")
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err))

const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({storage})

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.get('/tags', PostController.getLastTags)
app.get('/comments', PostController.getLastComments)

app.get('/posts', PostController.getAll)
app.get('/posts/limit/:length/date/:date', PostController.getAllLimit)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)
app.patch('/posts/:id/comment', checkAuth, handleValidationErrors, PostController.comment)

app.listen(4444, (err) => {
    if (err) return console.log(err)

    console.log('Server OK')
})














