import axios from '../api/axios'

const getAll = async () => {
  const request = await axios.get('notes')
  return request.data
}

const create = async (newObject) => {
  const request = await axios.post('notes', newObject)
  return request.data
}

const update = async (id, newObject) => {
  const request = await axios.put(`notes/${id}`, newObject)
  return request.data
}

export default { getAll, create, update }
