class LoginRouter {
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

class HttpResponse {
    static badRequest(paramName) {
        return {
            statusCode: 400,
            body: new MissingParamError(paramName)
        }
    }

    static serverError() {
        return {
            statusCode: 500
        }
    }
}

class MissingParamError extends Error {
    constructor(paramErro) {
        super(`Missing Error: ${paramErro}`)
        this.name = 'MissingParamError'
    }
}

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