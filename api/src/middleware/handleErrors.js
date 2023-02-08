export default (error, request, response, next) => {
  if (error.name === 'CastError') { response.status(400).end() } else {
    response.status(500)
  }
}
