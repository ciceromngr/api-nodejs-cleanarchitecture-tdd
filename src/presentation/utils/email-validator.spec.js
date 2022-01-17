const validator = require('validator')

class EmailValidator {
    isValid(email) {
        return validator.isEmail(email)
    }
}

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
        const isEmailValid = sut.isValid('invalid_emailmail.com')
        expect(isEmailValid).toBe(false)
    })
})