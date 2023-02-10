import supertest from 'supertest'

import { app } from '../src'
import { User } from '../src/models/User'

const api = supertest(app)

const initialNotes = [
  {
    content: 'Seguir en twitch',
    important: true,
    date: new Date(),
    user: '63e4106baf6ffe9fa9e6b95f'
  },
  {
    content: 'hey ',
    important: true,
    date: new Date(),
    user: '63e4106baf6ffe9fa9e6b95f'
  }
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')

  return {
    contents: response.body.map(note => note.content),
    response
  }
}

const getUsers = async () => {
  const usersDB = await User.find({})
  return usersDB.map(user => user.toJSON())
}

export { initialNotes, api, getAllContentFromNotes, getUsers }
