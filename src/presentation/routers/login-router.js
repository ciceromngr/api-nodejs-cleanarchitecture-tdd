const HttpResponse = require("../helpers/httpResponse")
const InvalidParamError = require("../helpers/invalid-param-erros")
const MissingParamError = require("../helpers/missing-param-erros")

module.exports = class LoginRouter {
    constructor(authUseCase, emailValidator) {
        this.authUseCase = authUseCase
        this.emailValidator = emailValidator
    }
    async route(httpRequest) {

        try {
            const { email, password } = httpRequest.body

            if (!email) {
                return HttpResponse.badRequest(new MissingParamError('Email'))
            }

            if (!this.emailValidator.isValid(email)) {
                return HttpResponse.badRequest(new InvalidParamError('Email'))
            }

            if (!password) {
                return HttpResponse.badRequest(new MissingParamError('Password'))
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