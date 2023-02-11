import mongoose from 'mongoose'

export default (url) => mongoose.connect(url)
  .then(() => {
    console.log('Database connected')
  })
  .catch(err => {
    console.log(err)
  })
