import * as dotenv from 'dotenv'

import express from 'express'
import cors from 'cors'

import connectDb from './mongo.js'
import { Note } from './models/Note.js'
import handleErrors from './middleware/handleErrors.js'
import NotFound from './middleware/NotFound.js'
import { usersRoutes } from './controllers/users.js'
import { User } from './models/User.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

const { DATABASE_URL, DATABASE_URL_TEST, NODE_ENV } = process.env

const connection = NODE_ENV === 'test' ? DATABASE_URL_TEST : DATABASE_URL

connectDb(connection)

app.get('/api/notes', async (_, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  return response.json(notes)
})

app.get('/api/notes/:id', (request, response, next) => {
  const { id } = request.params

  Note.findById(id).populate('user', { username: 1, name: 1 }).then(note => {
    return note ? response.json(note) : response.status(404).end()
  }).catch(err => next(err))
})

app.post('/api/notes', async (request, response, next) => {
  const { content, important = false, userId } = request.body

  if (!content) {
    return response.status(400).json({
      error: "required 'content' field is missing"
    })
  }

  const user = await User.findById(userId)

  const newNote = new Note({
    content,
    date: new Date(),
    important,
    user: user._id
  })

  try {
    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()
    response.json(savedNote)
  } catch (error) {
    next(error)
  }
})

app.put('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => response.json(result))
    .catch(err => next(err))
})

app.delete('/api/notes/:id', async (request, response, next) => {
  const { id } = request.params

  const res = await Note.findByIdAndDelete(id)
  if (res === null) return response.sendStatus(404)

  response.status(204).end()
})

app.use('/api/users', usersRoutes)

app.use(NotFound)

app.use(handleErrors)

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
  console.log(process.env.DATABASE_URL)
  console.log(`Serve running on port ${PORT}`)
})

export { app, server }
