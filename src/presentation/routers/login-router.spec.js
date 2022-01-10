const MissingParamError = require("../helpers/missing-param-erros")
const LoginRouter = require("./login-router")

describe('Login Router', () => {
    it('should return 400 if no email is provider', () => {
        const sut = new LoginRouter()
        const httpRequest = {
            body: {
                password: 'any_password'
            }
        }
        const httpResponse = sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('Email'))
    })

    it('should return 400 if no password is provider', () => {
        const sut = new LoginRouter()
        const httpRequest = {
            body: {
                email: 'any_email@mail.com'
            }
        }
        const httpResponse = sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('Password'))
    })

    it('should return 500 if no httpRequest is provider', () => {
        const sut = new LoginRouter()
        const httpResponse = sut.route()
        expect(httpResponse.statusCode).toBe(500)
    })

    it('should return 500 if httpRequest has no body', () => {
        const sut = new LoginRouter()
        const httpRequest = {}
        const httpResponse = sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
    })
})