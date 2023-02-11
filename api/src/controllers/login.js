import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { User } from '../models/User.js'

const loginRoutes = express.Router()

loginRoutes.post('/', async (request, response) => {
  const { body } = request

  const { username, password } = body

  const user = await User.findOne({ username })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid user or password'
    })
  }

  const userForToken = {
    id: user.id,
    username: user.username
  }

  const { JWT_SECRET } = process.env

  const token = jwt.sign(userForToken, JWT_SECRET, {
    expiresIn: 60 * 60 * 24 * 7
  })

  response.send({
    name: user.name,
    username: user.username,
    token
  })
})

export { loginRoutes }
