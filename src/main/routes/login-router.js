const loginRouter = require('../../main/composers/login-router-compose')
const ExpressRouterAdapter = require('../../main/adapters/express-router-adapter')
module.exports = router => {
    router.post('/login', ExpressRouterAdapter.adapt(loginRouter))
}