import supertest from 'supertest'

import { app } from '../src'

const api = supertest(app)

const initialNotes = [
  {
    content: 'Seguir en twitch',
    important: true,
    date: new Date()
  },
  {
    content: 'hey ',
    important: true,
    date: new Date()
  }
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')

  return {
    contents: response.body.map(note => note.content),
    response
  }
}

export { initialNotes, api, getAllContentFromNotes }
