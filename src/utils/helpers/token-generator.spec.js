class TokenGenerator {
    async generator(id) {
        return null
    }
}

describe('TokenGenerator', () => {
    it('should return null if JWT returns null', async() => {
        const sut = new TokenGenerator()
        const jwt = await sut.generator('any_id')
        expect(jwt).toBeNull()
    })
})