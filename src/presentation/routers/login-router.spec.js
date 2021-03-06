const { MissingParamError, InvalidParamError } = require("../../utils/errors")
const { ServerError, UnauthorizedError } = require("../errors")
const LoginRouter = require("./login-router")


const makeSut = () => {
    const authUseCaseSpy = makeAuthUseCase()
    const emailValidatorSpy = makeEmailValidator()
    authUseCaseSpy.acessToken = 'valid_token'
    const sut = new LoginRouter({
        authUseCase: authUseCaseSpy,
        emailValidator: emailValidatorSpy
    })
    return {
        sut,
        authUseCaseSpy,
        emailValidatorSpy
    }
}

const makeEmailValidator = () => {
    class EmailValidatorSpy {
        isValid(email) {
            this.email = email
            return this.isEmailValid
        }
    }

    const emailValidatorSpy = new EmailValidatorSpy()
    emailValidatorSpy.isEmailValid = true
    return emailValidatorSpy
}

const makeAuthUseCase = () => {
    class AuthUseCaseSpy {
        async auth(email, password) {
            this.email = email
            this.password = password
            return this.acessToken
        }
    }

    return new AuthUseCaseSpy()
}

const makeAuthUseCaseWithError = () => {
    class AuthUseCaseSpy {
        async auth() {
            throw new Error()
        }
    }
    return new AuthUseCaseSpy()
}

const makeEmailValidatorWithError = () => {
    class EmailValidatorSpy {
        isValid(email) {
            throw new Error()
        }
    }

    return new EmailValidatorSpy()
}

describe('Login Router', () => {
    it('should return 400 if no email is provider', async() => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                password: 'any_password'
            }
        }
        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('Email'))
    })

    it('should return 400 if no password is provider', async() => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: 'any_email@mail.com'
            }
        }
        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('Password'))
    })

    it('should return 500 if no httpRequest is provider', async() => {
        const { sut } = makeSut()
        const httpResponse = await sut.route()
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    it('should return 500 if httpRequest has no body', async() => {
        const { sut } = makeSut()
        const httpRequest = {}
        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    it('should call AuthUseCase with correct params', async() => {
        const { sut, authUseCaseSpy } = makeSut()
        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                password: 'any_password'
            }
        }
        await sut.route(httpRequest)
        expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
        expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
    })

    it('should return 401 when invalid credentials are provided', async() => {
        const { sut, authUseCaseSpy } = makeSut()
        authUseCaseSpy.acessToken = null
        const httpRequest = {
            body: {
                email: 'invalid_email@mail.com',
                password: 'invalid_password'
            }
        }
        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(401)
        expect(httpResponse.body).toEqual(new UnauthorizedError())
    })

    it('should return 200 when valid credentials are provided', async() => {
        const { sut, authUseCaseSpy } = makeSut()
        const httpRequest = {
            body: {
                email: 'valid_email@mail.com',
                password: 'valid_password'
            }
        }
        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body.acessToken).toBe(authUseCaseSpy.acessToken)
    })

    it('should return 400 if an invalid email is provider', async() => {
        const { sut, emailValidatorSpy } = makeSut()
        emailValidatorSpy.isEmailValid = false
        const httpRequest = {
            body: {
                email: 'invalid_email@mail.com',
                password: 'any_password'
            }
        }
        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('Email'))
    })

    it('should call EmailValidator with correct email', async() => {
        const { sut, emailValidatorSpy } = makeSut()
        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                password: 'any_password'
            }
        }
        await sut.route(httpRequest)
        expect(emailValidatorSpy.email).toBe(httpRequest.body.email)
    })

    it('should throw if invalid dependecies are provided', async() => {
        const invalid = {}
        const authUseCase = makeAuthUseCase()
        const suts = [].concat(
            new LoginRouter(),
            new LoginRouter({}),
            new LoginRouter({
                authUseCase: invalid
            }),
            new LoginRouter({ authUseCase }),
            new LoginRouter({
                authUseCase,
                emailValidator: invalid
            })
        )
        for (const sut of suts) {
            const httpRequest = {
                body: {
                    email: 'any_email@mail.com',
                    password: 'any_password'
                }
            }
            const httpResponse = await sut.route(httpRequest)
            expect(httpResponse.statusCode).toBe(500)
        }
    })

    it('should throw if any dependecy throws', async() => {
        const authUseCase = makeAuthUseCase()
        const suts = [].concat(
            new LoginRouter({
                authUseCase: makeAuthUseCaseWithError()
            }),
            new LoginRouter({
                authUseCase,
                emailValidator: makeAuthUseCaseWithError()
            })
        )
        for (const sut of suts) {
            const httpRequest = {
                body: {
                    email: 'any_email@mail.com',
                    password: 'any_password'
                }
            }
            const httpResponse = await sut.route(httpRequest)
            expect(httpResponse.statusCode).toBe(500)
        }
    })
})