jest.mock('validator', () => ({
    isEmailValid: true,
    isEmail(email) {
        this.email = email
        return this.isEmailValid
    }
}))

const EmailValidator = require('./email-validator')
const validator = require('validator')

const makeSut = () => {
    const sut = new EmailValidator()
    return { sut }
}

describe('Email Validator', () => {
    it('should return true if validate returns true', () => {
        const { sut } = makeSut()
        const isEmailValid = sut.isValid('valid_email@mail.com')
        expect(isEmailValid).toBe(true)
    })

    it('should return false if validate returns false', () => {
        validator.isEmailValid = false
        const { sut } = makeSut()
        const isEmailValid = sut.isValid('invalid_email@mail.com')
        expect(isEmailValid).toBe(false)
    })

    it('should call validator with correct email', () => {
        const { sut } = makeSut()
        sut.isValid('any_email@mail.com')
        expect(validator.email).toBe('any_email@mail.com')
    })
})