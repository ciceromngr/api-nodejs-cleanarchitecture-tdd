const jwt = require('jsonwebtoken')

class TokenGenerator {
    constructor(secret) {
        this.secret = secret
    }
    async generator(id) {
        return jwt.sign(id, this.secret)
    }
}

const makeSut = () => {
    const sut = new TokenGenerator('secret')
    return { sut }
}

describe('TokenGenerator', () => {
    it('should return null if JWT returns null', async() => {
        const { sut } = makeSut()
        jwt.token = null
        const token = await sut.generator('any_id')
        expect(token).toBeNull()
    })

    it('should return a token if JWT returns token', async() => {
        const { sut } = makeSut()
        const token = await sut.generator('any_id')
        expect(token).toBe(jwt.token)
    })

    it('should call JWT with correct values', async() => {
        const { sut } = makeSut()
        await sut.generator('any_id')
        expect(jwt.id).toBe('any_id')
        expect(jwt.secret).toBe(sut.secret)
    })
})