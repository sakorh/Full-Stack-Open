
import { useState } from 'react'

const Blog = ({ blog, like, remove, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [blogInfoVisible, setBlogInfoVisible] = useState(false)

  const hideWhenVisible = { display: blogInfoVisible ? 'none' : '' }
  const showWhenVisible = { display: blogInfoVisible ? '' : 'none' }
  const showRemoveButton = { display: user.username && blog.user.username===user.username ? '' : 'none' }


  const toggleBlogVisibility = () => {
    setBlogInfoVisible(!blogInfoVisible)
  }

  return (
    <div style={blogStyle} data-testid='blog'>
      {blog.title} {blog.author}
      <div className={'blog'} style={showWhenVisible}>
        <button onClick={toggleBlogVisibility}>hide</button>
        <form>
          {blog.url}<br></br>
                likes {blog.likes}<button onClick={() => like(blog)}>like</button><br></br>
          {blog.user.name}<br></br>
          <div style={showRemoveButton}>
            <button onClick={() => remove(blog.id)}>remove</button>
          </div>
        </form>
      </div>
      <div className={'blog'} style={hideWhenVisible}>
        <button onClick={toggleBlogVisibility}>view</button>
      </div>
    </div>
  )}

export default Blog