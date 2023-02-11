import { useEffect, useState } from 'react'

import Note from './components/Note'
import Notification from './components/Notification'
import loginService from './services/login'
import noteService from './services/notes'

const LoginForm = ({ handleLogin, username, password, setPassword, setUsername }) => (
  <form onSubmit={handleLogin}>
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
)

const CreateNoteForm = ({ addNote, newNote, handleNoteChange, handleLogout }) => (
  <>
    <form onSubmit={addNote}>
      <input
        value={newNote}
        onChange={handleNoteChange}
      />
      <button type="submit">save</button>
    </form>
    <button onClick={handleLogout}></button>
  </>
)

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [user, setUser] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const handleLogout = () => {
    setUser(null)
    noteService.setToken('')
    window.localStorage.removeItem('loggedNoteAppUser')
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(() => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(user))

      noteService.setToken(user.token)
      setUser(user)
    } catch (e) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } finally {
      setUsername('')
      setPassword('')
    }
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {!user
        ? <LoginForm
          handleLogin={handleLogin}
          password={password}
          setPassword={setPassword}
          setUsername={setUsername}
          username={username}
        />
        : <CreateNoteForm
          addNote={addNote}
          handleNoteChange={handleNoteChange}
          handleLogout={handleLogout}
          newNote={newNote}
        />}
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note, i) =>
          <Note
            key={i}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>
    </div>
  )
}

export default App
