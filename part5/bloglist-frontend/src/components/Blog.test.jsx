import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'
import { beforeEach, describe, expect } from 'vitest'

describe('Blog', () => {
  let container
  let mockHandler = vi.fn()

  beforeEach(() => {

    const blog = {
      title: 'Component testing is done with react-testing-library',
      author: 'Superuser',
      url: 'https://github.com/testing-library/react-testing-library',
      likes: 0,
      user: { id: '123',
        username: 'root',
        name: 'Superuser'
      }
    }

    const user = { id: '123', username: 'root', name: 'Superuser' }

    container = render(<Blog blog={blog} like={mockHandler} user={user}/>).container

  })

  test('renders only title and author', () => {
    const element = screen.getByText('Component testing is done with react-testing-library Superuser')
    expect(element).toBeDefined()

    const div = container.querySelector('.blog')
    expect(div).toHaveStyle('display: none')
  })

  test('clicking view renders all info', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.blog')

    expect(div).toHaveTextContent('https://github.com/testing-library/react-testing-library')
    expect(div).toHaveTextContent('likes 0')
    expect(div).toHaveTextContent('Superuser')
  })

  test('clicking like twice calls event handler twice', async () => {
    const user = userEvent.setup()

    const likebutton = screen.getByText('like')
    await user.click(likebutton)
    await user.click(likebutton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })

  test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    render(<BlogForm createBlog={createBlog} />)

    const input = screen.getAllByRole('textbox')
    const sendButton = screen.getByText('create')

    await user.type(input[0], 'testing a form...')
    await user.type(input[1], 'testing a form...')
    await user.type(input[2], 'testing a form...')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toStrictEqual({
      title: 'testing a form...',
      author: 'testing a form...',
      url: 'testing a form...'
    })
  })
})