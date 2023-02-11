import express from 'express'
import userExtractor from '../middleware/userExtractor.js'

import { Note } from '../models/Note.js'
import { User } from '../models/User.js'

const notesRoutes = express.Router()

notesRoutes.get('/', async (_, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  return response.json(notes)
})

notesRoutes.get('/:id', (request, response, next) => {
  const { id } = request.params

  Note.findById(id).populate('user', { username: 1, name: 1 }).then(note => {
    return note ? response.json(note) : response.status(404).end()
  }).catch(err => next(err))
})

notesRoutes.post('/', userExtractor, async (request, response, next) => {
  const { content, important = false } = request.body
  const { userId } = request

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

notesRoutes.put('/:id', userExtractor, (request, response, next) => {
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

notesRoutes.delete('/:id', userExtractor, async (request, response, next) => {
  const { id } = request.params

  const res = await Note.findByIdAndDelete(id)
  if (res === null) return response.sendStatus(404)

  response.status(204).end()
})

export { notesRoutes }
