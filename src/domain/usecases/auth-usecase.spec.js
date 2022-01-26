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

const makeEncrypterWithError = () => {

    class EncrypterSpy {
        async compare() {
            throw new Error()
        }
    }

    return new EncrypterSpy()
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

const makeTokenGeneratorWithError = () => {

    class TokenGeneratorSpy {
        async generator() {
            throw new Error()
        }
    }

    return new TokenGeneratorSpy()
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

const makeLoadUserByEmailRepositoryWithError = () => {
    class LoadUserByEmailRepositorySpy {
        async load() {
            throw new Error()
        }
    }
    return new LoadUserByEmailRepositorySpy()
}

const makeUpdateAccessToken = () => {
    class UpdateAccessTokenRepositorySpy {
        async update(userId, accessToken) {
            this.userId = userId
            this.accessToken = accessToken
        }
    }
    const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy()

    return updateAccessTokenRepositorySpy
}

const makeSut = () => {
    const encrypterSpy = makeEncrypter()
    const tokenGeneratorSpy = makeTokenGenerator()
    const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
    const updateAccessTokenRepositorySpy = makeUpdateAccessToken()
    const sut = new AuthUseCase({
        loadUserByEmailRepository: loadUserByEmailRepositorySpy,
        encrypter: encrypterSpy,
        tokenGenerator: tokenGeneratorSpy,
        updateAccessTokenRepository: updateAccessTokenRepositorySpy
    })

    return {
        sut,
        loadUserByEmailRepositorySpy,
        encrypterSpy,
        tokenGeneratorSpy,
        updateAccessTokenRepositorySpy
    }
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

    it('should call UpdateAccessTokenRepository with correct values', async() => {
        const { sut, loadUserByEmailRepositorySpy, updateAccessTokenRepositorySpy, tokenGeneratorSpy } = makeSut()
        await sut.auth('valid_email@mail.com', 'valid_password')
        expect(updateAccessTokenRepositorySpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
        expect(updateAccessTokenRepositorySpy.accessToken).toBe(tokenGeneratorSpy.acessToken)
    })

    it('should throw if invalid dependecies are provided', () => {
        const invalid = {}
        const loadUserByEmailRepository = makeLoadUserByEmailRepository()
        const encrypter = makeEncrypter()
        const suts = [].concat(
            new AuthUseCase(),
            new AuthUseCase({
                loadUserByEmailRepository: null
            }),
            new AuthUseCase({
                loadUserByEmailRepository: invalid
            }),
            new AuthUseCase({
                loadUserByEmailRepository,
                encrypter: null
            }),
            new AuthUseCase({
                loadUserByEmailRepository,
                encrypter: invalid
            }),
            new AuthUseCase({
                loadUserByEmailRepository,
                encrypter,
                tokenGenerator: null
            }),
            new AuthUseCase({
                loadUserByEmailRepository,
                encrypter,
                tokenGenerator: invalid
            })
        )
        for (const sut of suts) {
            const promisse = sut.auth('any_email@mail.com', 'any_password')
            expect(promisse).rejects.toThrow()
        }
    })

    it('should throw if any dependecy throws', () => {
        const loadUserByEmailRepository = makeLoadUserByEmailRepository()
        const encrypter = makeEncrypter()
        const suts = [].concat(
            new AuthUseCase({
                loadUserByEmailRepository: makeLoadUserByEmailRepositoryWithError()
            }),
            new AuthUseCase({
                loadUserByEmailRepository,
                encrypter: makeEncrypterWithError()
            }),
            new AuthUseCase({
                loadUserByEmailRepository,
                encrypter,
                tokenGenerator: makeTokenGeneratorWithError()
            })
        )
        for (const sut of suts) {
            const promisse = sut.auth('any_email@mail.com', 'any_password')
            expect(promisse).rejects.toThrow()
        }
    })
})