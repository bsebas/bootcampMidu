import express from 'express'
import bcrypt from 'bcrypt'

import { User } from '../models/User.js'

const usersRoutes = express.Router()

usersRoutes.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', { content: 1, date: 1 })
  response.json(users)
})

usersRoutes.post('/', async (request, response) => {
  try {
    const { body } = request
    const { username, name, password } = body
    const passwordHash = await bcrypt.hash(password, 12)

    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
  } catch (error) {
    console.log(error)
    response.status(400).json(error)
  }
})

export { usersRoutes }
