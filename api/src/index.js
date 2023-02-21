import * as dotenv from 'dotenv'

import express from 'express'
import cors from 'cors'

import connectDb from './database/mongo.js'

import handleErrors from './middleware/handleErrors.js'
import NotFound from './middleware/NotFound.js'

import { usersRoutes } from './controllers/users.js'
import { notesRoutes } from './controllers/notes.js'
import { loginRoutes } from './controllers/login.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

app.use(express.static('../app/dist'))

const { DATABASE_URL, DATABASE_URL_TEST, NODE_ENV } = process.env

const connection = NODE_ENV === 'test' ? DATABASE_URL_TEST : DATABASE_URL

connectDb(connection)

app.use('/api/notes', notesRoutes)

app.use('/api/users', usersRoutes)

app.use('/api/login', loginRoutes)

app.use(NotFound)

app.use(handleErrors)

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
  console.log(`Serve running on port ${PORT}`)
})

export { app, server }
export default app
