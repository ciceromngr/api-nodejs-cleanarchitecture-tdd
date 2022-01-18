const { MissingParamError } = require("../../utils/errors")

class AuthUseCase {
    async auth(email) {
        if (!email) {
            throw new MissingParamError('email')
        }
    }
}

describe('Auth UseCase', () => {
    it('should thorws if no email to provided', () => {
        const sut = new AuthUseCase()
        const promisse = sut.auth()
        expect(promisse).rejects.toThrow(new MissingParamError('email'))
    })
})