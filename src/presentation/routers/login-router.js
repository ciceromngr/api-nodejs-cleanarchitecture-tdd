const HttpResponse = require("../helpers/httpResponse")

module.exports = class LoginRouter {
    constructor(authUseCase) {
        this.authUseCase = authUseCase
    }
    async route(httpRequest) {

        try {
            const { email, password } = httpRequest.body

            if (!email) {
                return HttpResponse.badRequest('Email')
            }

            if (!password) {
                return HttpResponse.badRequest('Password')
            }

            const acessToken = await this.authUseCase.auth(email, password)
            if (!acessToken) {
                return HttpResponse.unauthorizedError()
            }

            return HttpResponse.ok({ acessToken })
        } catch (error) {
            return HttpResponse.serverError()
        }
    }
}