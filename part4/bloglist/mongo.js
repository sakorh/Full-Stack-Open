const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const password = process.argv[2]

const url = 
    `mongodb+srv://salla:${password}@cluster0.20mwm.mongodb.net/bloglist-app?retryWrites=true&w=majority`

mongoose.connect(url)

const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
  })
  
const Blog = mongoose.model('Blog', blogSchema)

/*const blog = new Blog({
    title: 'Blog',
    author: 'me',
    url: 'https://url.com',
    likes: 10,
})

blog.save().then(result => {
    console.log('blog saved!')
    mongoose.connection.close()
})*/

Blog.find({}).then(result => {
    result.forEach(blog => {
        console.log(blog)
    })
    mongoose.connection.close()
})