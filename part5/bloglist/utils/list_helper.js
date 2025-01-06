var _ = require('lodash')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
      id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    }
]

const dummy = (blogs) => {
    return 1
}

const totalLikes = (array) => {
    return array.length === 0
        ? 0
        : array.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (array) => {

    const likes = array.map((blog) => blog.likes)
    const most_likes = likes.reduce((a,b) => { return Math.max(a, b)}, 0)
    const favorite = array.find(blog => blog.likes === most_likes)
    return favorite.title

}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
    dummy, totalLikes, favoriteBlog, initialBlogs, blogsInDb, usersInDb
}