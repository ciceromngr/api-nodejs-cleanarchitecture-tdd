const bcrypt = require('bcrypt')
const MissingParamError = require('../errors/missing-param-erros')
const Encrypter = require('./encrypter')

const makeSut = () => {
    return new Encrypter()
}

describe('Encrypter', () => {
    it('should retunr true if bcrypt returns true', async() => {
        const sut = makeSut()
        const isValid = await sut.compare('any_value', 'hashed_value')
        expect(isValid).toBe(true)
    })

    it('should retunr false if bcrypt returns false', async() => {
        const sut = makeSut()
        bcrypt.isValid = false
        const isValid = await sut.compare('any_value', 'hashed_value')
        expect(isValid).toBe(false)
    })

    it('should call bcrypt with correct values', async() => {
        const sut = makeSut()
        await sut.compare('any_value', 'hashed_value')
        expect(bcrypt.value).toBe('any_value')
        expect(bcrypt.hash).toBe('hashed_value')
    })

    it('should throw if no params are provided', async() => {
        const sut = makeSut()
        expect(sut.compare()).rejects.toThrow(new MissingParamError('value'))
        expect(sut.compare('any_value')).rejects.toThrow(new MissingParamError('hash'))
    })
})