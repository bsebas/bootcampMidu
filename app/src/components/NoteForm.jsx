import { useRef, useState } from 'react'
import PropTypes from 'prop-types'

import { Togglable } from './Togglable'

const NoteForm = ({ addNote, handleLogout }) => {
  const [newNote, setNewNote] = useState('')

  const togglableRef = useRef(null)

  const handleChange = (event) => {
    setNewNote(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5
    }

    addNote(noteObject)
    setNewNote('')
    togglableRef.current.toggleVisibility()
  }

  return (
    <Togglable buttonLabel="New note" ref={togglableRef}>
      <h3>Create a new note</h3>
      <form onSubmit={handleSubmit}>
        <input
          value={newNote}
          onChange={handleChange}
        />
        <button type="submit">save</button>
      </form>
      <button onClick={handleLogout}>Logout</button>
    </Togglable>
  )
}

NoteForm.propTypes = {
  addNote: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired
}

export { NoteForm }
