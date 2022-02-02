const express = require('express')
const setup = require('./setup')
const app = express()
setup(app, express)

module.exports = app