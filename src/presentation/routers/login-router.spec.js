const MissingParamError = require("../helpers/missing-param-erros")
const ServerError = require("../helpers/server-error")
const UnauthorizedError = require("../helpers/unauthorized-error")
const LoginRouter = require("./login-router")


const makeSut = () => {
    const authUseCaseSpy = makeAuthUseCase()
    authUseCaseSpy.acessToken = 'valid_token'
    const sut = new LoginRouter(authUseCaseSpy)
    return {
        sut,
        authUseCaseSpy
    }
}

const makeAuthUseCase = () => {
    class AuthUseCaseSpy {
        auth(email, password) {
            this.email = email
            this.password = password
            return this.acessToken
        }
    }

    return new AuthUseCaseSpy()
}

const makeAuthUseCaseWithError = () => {
    class AuthUseCaseSpy {
        auth() {
            throw new Error()
        }
    }
    return new AuthUseCaseSpy()
}

describe('Login Router', () => {
    it('should return 400 if no email is provider', () => {
        const { sut } = makeSut()
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
        const { sut } = makeSut()
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
        const { sut } = makeSut()
        const httpResponse = sut.route()
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    it('should return 500 if httpRequest has no body', () => {
        const { sut } = makeSut()
        const httpRequest = {}
        const httpResponse = sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    it('should call AuthUseCase with correct params', () => {
        const { sut, authUseCaseSpy } = makeSut()
        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                password: 'any_password'
            }
        }
        sut.route(httpRequest)
        expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
        expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
    })

    it('should return 401 when invalid credentials are provided', () => {
        const { sut, authUseCaseSpy } = makeSut()
        authUseCaseSpy.acessToken = null
        const httpRequest = {
            body: {
                email: 'invalid_email@mail.com',
                password: 'invalid_password'
            }
        }
        const httpResponse = sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(401)
        expect(httpResponse.body).toEqual(new UnauthorizedError())
    })

    it('should return 200 when valid credentials are provided', () => {
        const { sut, authUseCaseSpy } = makeSut()
        const httpRequest = {
            body: {
                email: 'valid_email@mail.com',
                password: 'valid_password'
            }
        }
        const httpResponse = sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body.acessToken).toBe(authUseCaseSpy.acessToken)
    })

    it('should return 500 if AuthUseCase has no auth method ', () => {
        const sut = new LoginRouter({})
        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                password: 'any_password'
            }
        }
        const httpResponse = sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    it('should return 500 if AuthUseCase throws ', () => {
        const authUseCaseSpy = makeAuthUseCaseWithError()
        const sut = new LoginRouter(authUseCaseSpy)
        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                password: 'any_password'
            }
        }
        const httpResponse = sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
    })
})