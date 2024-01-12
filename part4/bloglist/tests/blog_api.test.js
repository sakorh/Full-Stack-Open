const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('../utils/list_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Blog = require('../models/blog')


describe('when there is some notes saved', () => {
  let token
  let user
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)

    const passwordHash = await bcrypt.hash('secret', 10)
    user = new User({ username: 'user', passwordHash })

    await user.save()

    const result = await api
        .post('/api/login')
        .set({ Authorization: `bearer ${token}` })
        .send({ username: 'user', password: "secret" })
    token = result.body.token
    
    
    })  
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect('Content-Type', /application\/json/)
    })

    test('there is right amount of blogs', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('the identifier field is called id', async () => {
        const response = await api.get('/api/blogs')

        const ids = response.body.map(blog => blog.id)
        ids.forEach(id => {
            expect(id).toBeDefined()
        })
    })

    test('blogs can be added with post request', async () => {
        const newBlog = {
            title: 'testing is fun',
            author: 'me',
            url: 'https://thisistheurloftheblog.com',
            likes: 5,
        }

        await api
        .post('/api/blogs')
        .set({ Authorization: `bearer ${token}` })
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const blogsAfterAddition = await helper.blogsInDb()
        expect(blogsAfterAddition).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogsAfterAddition.map(blog => blog.title)
        expect(titles).toContain('testing is fun')
    })

    test("0 likes if not defined", async () => {
        const newBlog = {
            title: 'no likes :(',
            author: 'user',
            url: 'https://thisistheurloftheblog.com'        
        }

        await api
            .post('/api/blogs')
            .set({ Authorization: `bearer ${token}` })
            .send(newBlog)

        const blogsAfterAddition = await helper.blogsInDb()
        console.log(blogsAfterAddition.find(({ title }) => title === newBlog.title))
        
    })
    test('bad request without a title', async () => {
        const newBlog = {
            id: "5a422a851b54a676234d17f7",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
          }

        await api
            .post('/api/blogs')
            .set({ Authorization: `bearer ${token}` })
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('bad request without an url', async () => {
        const newBlog = {
            id: "5a422a851b54a676234d17f7",
            title: "React patterns",
            author: "Michael Chan",
            likes: 7,
          }

        await api
            .post('/api/blogs')
            .set({ Authorization: `bearer ${token}` })
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('updating a blog with a valid id results in 200 statuscode', async () => {
        const blogs = await helper.blogsInDb()
        const blogToUpdate = blogs[0]
        console.log(blogToUpdate)
        const newBlog = {
            title: blogToUpdate.title,
            author: blogToUpdate.author,
            url: blogToUpdate.url,
            likes: 20
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .set({ Authorization: `bearer ${token}` })
            .send(newBlog)
            .expect(200)

        const blogsAfterUpdate = await helper.blogsInDb()
        const likesAfterUpdate = blogsAfterUpdate.find(blog => blog.title === newBlog.title)
        console.log(likesAfterUpdate)
        expect(likesAfterUpdate.likes).toBe(20)
    })  

})
afterAll(() => {
    mongoose.connection.close()
})

describe('deletion of a blog post', () => {
    let token
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('secret', 10)
        user = new User({ username: 'user', passwordHash })

        await user.save()

        const result = await api
            .post('/api/login')
            .set({ Authorization: `bearer ${token}` })
            .send({ username: 'user', password: "secret" })
        token = result.body.token

        await Blog.deleteMany({})
        const newBlog = {
            id: "5a422a851b54a676234d17f7",
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
          }
        await api
        .post('/api/blogs')
        .set({ Authorization: `bearer ${token}` })
        .send(newBlog)

    })
    test('deletion of a blog results in 204 statuscode with a valid id', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]


        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set({ Authorization: `bearer ${token}` })
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(0)

        const titles = blogsAtEnd.map(blog => blog.title)

        expect(titles).not.toContain(blogToDelete.title)
    })

})
afterAll(() => {
    mongoose.connection.close()
})

describe('when there is initially one user at db', () => {
    let token
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('secret', 10)

      const user = await new User({ username: 'user', passwordHash })
  
      await user.save()
      const result = await api
        .post('/api/login')
        .send({ username: 'user', password: "secret" })
      token = result.body.token
      console.log(token)


    })
    test('users with invalid usernames are not created', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'us',
        password: 'password',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('users with invalid passwords are not created', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'mluukkai',
          name: 'Matti Luukkainen',
          password: 'pw',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
        
        expect(result.body.error).toContain('password must be at least 3 characters long')
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      })

      test('username must be unique', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
            username: 'user',
            name: 'Superuser',
            password: 'salainen',
          }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('expected `username` to be unique')
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      })
  })

afterAll(() => {
    mongoose.connection.close()
})

test('adding a new blog without a token fails with a statuscode 401 Unauthorized', async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)

    const newBlog = {
        id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})
afterAll(() => {
    mongoose.connection.close()
})