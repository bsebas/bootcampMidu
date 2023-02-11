import { forwardRef, useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef(({ children, buttonLabel }, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => setVisible(!visible)

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {children}
        <button onClick={toggleVisibility}>Cancel</button>
      </div>
    </>
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  children: PropTypes.node.isRequired,
  buttonLabel: PropTypes.string.isRequired
}

export { Togglable }
