const HttpResponse = require("../helpers/httpResponse")

module.exports = class LoginRouter {
    constructor(authUseCase) {
        this.authUseCase = authUseCase
    }
    route(httpRequest) {

        if (!httpRequest || !httpRequest.body) {
            return HttpResponse.serverError()
        }

        const { email, password } = httpRequest.body

        if (!email) {
            return HttpResponse.badRequest('Email')
        }

        if (!password) {
            return HttpResponse.badRequest('Password')
        }

        this.authUseCase.auth(email, password)

        return HttpResponse.unauthorizedError()
    }
}