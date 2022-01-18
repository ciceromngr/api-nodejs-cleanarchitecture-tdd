const { MissingParamError } = require("../../utils/errors")

class AuthUseCase {
    async auth(email, password) {
        if (!email) {
            throw new MissingParamError('email')
        }
        if (!password) {
            throw new MissingParamError('password')
        }
    }
}

describe('Auth UseCase', () => {
    it('should thorws if no email to provided', () => {
        const sut = new AuthUseCase()
        const promisse = sut.auth()
        expect(promisse).rejects.toThrow(new MissingParamError('email'))
    })

    it('should thorws if no password to provided', () => {
        const sut = new AuthUseCase()
        const promisse = sut.auth('any_email@mail.com')
        expect(promisse).rejects.toThrow(new MissingParamError('password'))
    })
})