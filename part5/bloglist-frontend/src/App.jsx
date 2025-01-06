import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogFrom from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const blogFormRef = useRef()


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setSuccessMessage(
          `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
        )
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
  }

  const like = (blog) => {
    event.preventDefault()
    const blogObject = {
      ...blog,
      likes: blog.likes +1
    }
    blogService
      .like(blogObject.id, blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.map(b => b.id !== returnedBlog.id ? b : returnedBlog))
      })
  }

  const remove = (id) => {
    event.preventDefault()

    const blog = blogs.find(b => b.id === id)
    if (window.confirm(`Remove ${blog.title} by ${blog.author} ?`)) {
      blogService
        .remove(id)
        .then(() => {
          setBlogs(blogs.filter(b => b.id !== id))
          setSuccessMessage(
            `Deleted ${blog.title}`
          )
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
    }
  }


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setSuccessMessage('successful login')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      setUser(null)
    } catch (exception) {
      setErrorMessage('unsuccessful logout')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }


  return (
    <div>
      {!user && <div>
        <form onSubmit={handleLogin}>
          <h1>log in to application</h1>
          <Notification success={successMessage} error={errorMessage}/>
          <div>
              username
            <input
              data-testid="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
              password
            <input
              data-testid="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form></div>
      }
      {user && <div>
        <h1>blogs</h1>
        <Notification success={successMessage} error={errorMessage}/>
        <p>{user.username} logged in<button onClick={handleLogout}>logout</button></p>
        <Togglable buttonLabel='create new blog' ref={blogFormRef}>
          <BlogFrom
            createBlog={addBlog}
          />
        </Togglable>
        {blogs.sort((a,b) => b.likes-a.likes).map(blog =>
          <Blog key={blog.id} blog={blog} like={like} remove={remove} user={user}/>
        )}
      </div>
      }
    </div>
  )
}

export default App