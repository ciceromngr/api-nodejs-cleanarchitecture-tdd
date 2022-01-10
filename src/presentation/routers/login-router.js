const HttpResponse = require("../helpers/httpResponse")

module.exports = class LoginRouter {
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
    }
}