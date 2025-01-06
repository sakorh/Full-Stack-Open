const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('log in to application')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('mluukkai logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('wrong credentials')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page, request }) => {
      await loginWith(page ,'mluukkai', 'salainen')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'On let vs const', 'Dan Abramov', 'https://overreacted.io/on-let-vs-const/')
      await expect(page.getByText('On let vs const Dan Abramov')).toBeVisible()

    })

    test('user can like a blog', async ({ page }) => {
      await createBlog(page, 'On let vs const', 'Dan Abramov', 'https://overreacted.io/on-let-vs-const/')

      const blog = await page.getByText('On let vs const Dan Abramov')

      await blog.getByRole('button', {name: 'view'}).click()
      await blog.getByRole('button', {name: 'like'}).click()

      await expect(blog.getByText('likes 1')).toBeVisible() 
    })

    test('user can delete a blog', async ({ page }) => {
      await createBlog(page, 'On let vs const', 'Dan Abramov', 'https://overreacted.io/on-let-vs-const/')

      const blog = await page.getByText('On let vs const Dan Abramov')

      await blog.getByRole('button', {name: 'view'}).click()

      page.on('dialog', async dialog => {
        await dialog.accept()
      })

      await blog.getByRole('button', {name: 'remove'}).click()

      await expect(page.getByText('On let vs const Dan Abramov')).not.toBeVisible()

      const success = await page.locator('.success')
      await expect(success).toContainText('Deleted On let vs const')
    })

    test('user cannot see remove button of other users blogs', async ({ page, request }) => {
      await createBlog(page, 'On let vs const', 'Dan Abramov', 'https://overreacted.io/on-let-vs-const/')

      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Superuser',
          username: 'root',
          password: 'sekret'
        }
      })
      await page.getByRole('button', {name:'logout'}).click()

      await loginWith(page, 'root', 'sekret')

      const blog = await page.getByText('On let vs const Dan Abramov')

      await blog.getByRole('button', {name: 'view'}).click()

      await expect(blog.getByRole('button', {name: 'remove'})).not.toBeVisible()
    })

    test('blogs are ordered by likes', async ({ page }) => {
      await createBlog(page, 'On let vs const', 'Dan Abramov', 'https://overreacted.io/on-let-vs-const/')
      await createBlog(page, 'The Practical Test Pyramid', 'Ham Vocke', 'https://martinfowler.com/articles/practical-test-pyramid.html')
      await page.getByText('The Practical Test Pyramid Ham Vocke').waitFor()

      const blog = await page.getByText('The Practical Test Pyramid Ham Vocke')

      await blog.getByRole('button', {name: 'view'}).click()
      await blog.getByRole('button', {name: 'like'}).click()

      const blogs = await page.getByTestId('blog').all()

      await expect(blogs[0]).toContainText('The Practical Test Pyramid Ham Vocke')
      
    })
  })
})
 