const HttpResponse = require("../helpers/httpResponse")

module.exports = class LoginRouter {
    constructor(authUseCase) {
        this.authUseCase = authUseCase
    }
    route(httpRequest) {

        if (!httpRequest || !httpRequest.body || !this.authUseCase || !this.authUseCase.auth) {
            return HttpResponse.serverError()
        }

        const { email, password } = httpRequest.body

        if (!email) {
            return HttpResponse.badRequest('Email')
        }

        if (!password) {
            return HttpResponse.badRequest('Password')
        }

        const acessToken = this.authUseCase.auth(email, password)
        if (!acessToken) {
            return HttpResponse.unauthorizedError()
        }

        return {
            statusCode: 200
        }
    }
}