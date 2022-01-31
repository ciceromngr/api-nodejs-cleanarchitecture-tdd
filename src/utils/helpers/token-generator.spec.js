const jwt = require('jsonwebtoken')

class TokenGenerator {
    async generator(id) {
        return jwt.sign(id, 'secret')
    }
}

describe('TokenGenerator', () => {
    it('should return null if JWT returns null', async() => {
        const sut = new TokenGenerator()
        jwt.token = null
        const token = await sut.generator('any_id')
        expect(token).toBeNull()
    })

    it('should return a token if JWT returns token', async() => {
        const sut = new TokenGenerator()
        const token = await sut.generator('any_id')
        expect(token).toBe(jwt.token)
    })

    it('should call JWT with correct values', async() => {
        const sut = new TokenGenerator()
        await sut.generator('any_id')
        expect(jwt.id).toBe('any_id')
    })
})