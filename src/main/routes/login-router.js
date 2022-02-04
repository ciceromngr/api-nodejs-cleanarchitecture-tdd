const loginRouter = require('../../main/composers/login-router-compose')
module.exports = router => {
    router.post('/login', loginRouter)
}