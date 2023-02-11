import axios from '../api/axios'
let token = ''
const setToken = newToken => { token = `Bearer ${newToken}` }

const getAll = async () => {
  const request = await axios.get('notes')
  return request.data
}

const create = async (newObject) => {
  const request = await axios.post('notes', newObject, {
    headers: {
      Authorization: token
    }
  })
  return request.data
}

const update = async (id, newObject) => {
  const request = await axios.put(`notes/${id}`, newObject, {
    headers: {
      Authorization: token
    }
  })
  return request.data
}

export default { getAll, create, update, setToken }
