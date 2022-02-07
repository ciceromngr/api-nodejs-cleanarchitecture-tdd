const router = require('express').Router()
const FastGlob = require('fast-glob')

module.exports = app => {
    app.use('/api', router)
    FastGlob.sync('**/src/main/routes/**router.js')
        .forEach(file => require(`../../../${file}`)(router))
}