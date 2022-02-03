const express = require('express')
const setup = require('./setup')
const routes = require('./routes')
const app = express()
setup(app, express)
routes(app)

module.exports = app