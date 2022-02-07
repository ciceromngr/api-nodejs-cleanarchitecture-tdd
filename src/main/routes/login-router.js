const LoginRouterCompose = require('../../main/composers/login-router-compose')
const { adapt } = require('../../main/adapters/express-router-adapter')
module.exports = router => {
    router.post('/login', adapt(LoginRouterCompose.compose()))
}