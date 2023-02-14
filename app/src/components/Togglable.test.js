import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { Togglable } from './Togglable'

describe('<Togglable/>', () => {
  const buttonLabel = 'Show'
  let component
  beforeEach(() => {
    component = render(
      <Togglable buttonLabel={buttonLabel}>
        <div>testDivContent</div>
      </Togglable>
    )
  })

  test('renders its childrens', () => {
    component.getByText('testDivContent')
  })

  test('renders its childrens but they are not visible', () => {
    const el = component.getByText('testDivContent')
    expect(el.parentNode).toHaveStyle('display: none')
  })

  test('after clicking its children must be shown', () => {
    const button = component.getByText(buttonLabel)
    fireEvent.click(button)

    const el = component.getByText('testDivContent')
    expect(el.parentNode).not.toHaveStyle('display: none')
  })

  test('toggled content can be closed', () => {
    const button = component.getByText(buttonLabel)
    fireEvent.click(button)
    const el = component.getByText('testDivContent')
    expect(el.parentNode).toHaveStyle('display: none')

    const cancelButton = component.getByText('Cancel')
    fireEvent.click(cancelButton)

    expect(el.parentNode).toHaveStyle('display: none')
  })
})
