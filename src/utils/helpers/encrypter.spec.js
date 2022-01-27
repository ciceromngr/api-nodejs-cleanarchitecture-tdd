const bcrypt = require('bcrypt')

class Encrypter {
    async compare(value, hash) {
        const isValid = await bcrypt.compare(value, hash)
        return isValid
    }
}

describe('Encrypter', () => {
    it('should retunr true if bcrypt returns true', async() => {
        const sut = new Encrypter()
        const isValid = await sut.compare('any_value', 'hashed_value')
        expect(isValid).toBe(true)
    })

    it('should retunr false if bcrypt returns false', async() => {
        const sut = new Encrypter()
        bcrypt.isValid = false
        const isValid = await sut.compare('any_value', 'hashed_value')
        expect(isValid).toBe(false)
    })
})