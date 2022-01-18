class AuthUseCase {
    async auth(email) {
        if (!email) {
            throw new Error()
        }
    }
}

describe('Auth UseCase', () => {
    it('should thorws if no email to provided', () => {
        const sut = new AuthUseCase()
        const promisse = sut.auth()
        expect(promisse).rejects.toThrow()
    })
})