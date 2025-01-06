import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlog,
      author: newAuthor,
      url: newUrl,
    })
    setNewBlog('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        title:
        <input
          data-testid="title"
          value={newBlog}
          onChange={event => setNewBlog(event.target.value)}
        /><br></br>
      author:
        <input
          data-testid="author"
          value={newAuthor}
          onChange={event => setNewAuthor(event.target.value)}
        /><br></br>
      url:
        <input
          data-testid="url"
          value={newUrl}
          onChange={event => setNewUrl(event.target.value)}
        /><br></br>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm