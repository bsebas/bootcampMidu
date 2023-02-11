const ERROR_HANDLERS = {
  CastError: res => res.status(400).json({ error: 'id used is malformed' }),
  ValidationError: (res, error) => res.status(409).json({
    error: error.message
  }),
  JsonWebTokenError: res => res.status(401).json({ error: 'token missin or invalid' }),
  TokenExpirerError: res => res.status(401).json({ error: 'token expired' }),
  defaultError: res => res.status(500).end()
}

export default (error, request, response, next) => {
  console.log(error.name)
  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError
  handler(response, error)
}
