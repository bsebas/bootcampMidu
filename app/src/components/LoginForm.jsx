import { useState } from 'react'
import PropTypes from 'prop-types'

import loginService from '../services/login'
import { Togglable } from './Togglable'

const LoginForm = ({ handleLogin, handleError }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(user))

      handleLogin(user)
    } catch (e) {
      handleError('Wrong credentials')
      setTimeout(() => {
        handleError(null)
      }, 5000)
    } finally {
      setUsername('')
      setPassword('')
    }
  }

  return (
    <Togglable buttonLabel="Show login">
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={username}
            name="username"
            placeholder='Username'
            onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          <input
            type="password"
            value={password}
            name="password"
            placeholder='password'
            onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button>Login</button>
      </form>
    </Togglable>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired
}

export { LoginForm }
