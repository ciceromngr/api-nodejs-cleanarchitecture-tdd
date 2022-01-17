class EmailValidator {
    isValid(email) {
        return true
    }
}

describe('Email Validator', () => {
    it('should return true if validate returns true', () => {
        const sut = new EmailValidator()
        const isEmailValid = sut.isValid('valid_email@mail.com')
        expect(isEmailValid).toBe(true)
    })
})