import jwt from 'jsonwebtoken'

export default (request, response, next) => {
  const authorization = request.get('Authorization')

  if (!authorization) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }

  let token = ''

  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.substring(7)
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }

  const { id: userId } = decodedToken

  request.userId = userId

  next()
}
