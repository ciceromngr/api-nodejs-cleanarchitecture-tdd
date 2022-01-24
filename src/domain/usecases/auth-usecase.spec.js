const { MissingParamError, InvalidParamError } = require("../../utils/errors")
const AuthUseCase = require('./auth-usecase')

const makeEncrypter = () => {

    class EncrypterSpy {
        async compare(password, hashedPassword) {
            this.password = password
            this.hashedPassword = hashedPassword
            return this.isValid
        }
    }

    const encrypterSpy = new EncrypterSpy()
    encrypterSpy.isValid = true
    return encrypterSpy
}

const makeTokenGenerator = () => {

    class TokenGeneratorSpy {
        async generator(userId) {
            this.userId = userId
            return this.acessToken
        }
    }

    const tokenGeneratorSpy = new TokenGeneratorSpy()
    tokenGeneratorSpy.acessToken = 'any_token'
    return tokenGeneratorSpy
}

const makeLoadUserByEmailRepository = () => {
    class LoadUserByEmailRepositorySpy {
        async load(email) {
            this.email = email
            return this.user
        }
    }
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
    loadUserByEmailRepositorySpy.user = {
        id: 'any_id',
        password: 'hashed_password'
    }

    return loadUserByEmailRepositorySpy
}

const makeSut = () => {
    const encrypterSpy = makeEncrypter()
    const tokenGeneratorSpy = makeTokenGenerator()
    const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
    const sut = new AuthUseCase(loadUserByEmailRepositorySpy, encrypterSpy, tokenGeneratorSpy)

    return { sut, loadUserByEmailRepositorySpy, encrypterSpy, tokenGeneratorSpy }
}

describe('Auth UseCase', () => {
    it('should thorws if no email to provided', () => {
        const { sut } = makeSut()
        const promisse = sut.auth()
        expect(promisse).rejects.toThrow(new MissingParamError('email'))
    })

    it('should thorws if no password to provided', () => {
        const { sut } = makeSut()
        const promisse = sut.auth('any_email@mail.com')
        expect(promisse).rejects.toThrow(new MissingParamError('password'))
    })

    it('should call LoadUserByEmailRepository if correct email', async() => {
        const { sut, loadUserByEmailRepositorySpy } = makeSut()
        await sut.auth('any_email@mail.com', 'any_password')
        expect(loadUserByEmailRepositorySpy.email).toBe('any_email@mail.com')
    })

    it('should throw if no LoadUserByEmailRepository is provided', () => {
        const sut = new AuthUseCase()
        const promisse = sut.auth('any_email@mail.com', 'any_password')
        expect(promisse).rejects.toThrow(new MissingParamError('loadUserByEmailRepository'))
    })

    it('should throw if LoadUserByEmailRepository has no load method', () => {
        const sut = new AuthUseCase({})
        const promisse = sut.auth('any_email@mail.com', 'any_password')
        expect(promisse).rejects.toThrow(new InvalidParamError('loadUserByEmailRepository'))
    })

    it('should retunr null if an invalid email is provided', async() => {
        const { sut, loadUserByEmailRepositorySpy } = makeSut()
        loadUserByEmailRepositorySpy.user = null
        const acessToken = await sut.auth('invalid_email@mail.com', 'any_password')
        expect(acessToken).toBeNull()
    })

    it('should retunr null if an invalid password is provided', async() => {
        const { sut, encrypterSpy } = makeSut()
        encrypterSpy.isValid = false
        const acessToken = await sut.auth('valid_email@mail.com', 'invalid_password')
        expect(acessToken).toBeNull()
    })

    it('should call Encrypter with correct values', async() => {
        const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()
        await sut.auth('valid_email@mail.com', 'any_password')
        expect(encrypterSpy.password).toBe('any_password')
        expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
    })

    it('should call TokenGenerator with correct userId', async() => {
        const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()
        await sut.auth('valid_email@mail.com', 'valid_password')
        expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
    })

    it('should return an acessToken if correct crendentials are provided', async() => {
        const { sut, tokenGeneratorSpy } = makeSut()
        const acessToken = await sut.auth('valid_email@mail.com', 'valid_password')
        expect(acessToken).toBe(tokenGeneratorSpy.acessToken)
        expect(acessToken).toBeTruthy()
    })
})