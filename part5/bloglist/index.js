require('dotenv').config()
const http = require('http')
const express = require('express')
const app = require('./app')
const cors = require('cors')
const mongoose = require('mongoose')
const Blog = require('./models/blog')
const logger = require('./utils/logger')
const config = require('./utils/config')

const server = http.createServer(app)

server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})