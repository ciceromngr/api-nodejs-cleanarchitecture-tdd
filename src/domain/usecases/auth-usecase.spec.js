const { MissingParamError, InvalidParamError } = require("../../utils/errors")

class AuthUseCase {
    constructor(loadUserByEmailRepository) {
        this.loadUserByEmailRepository = loadUserByEmailRepository
    }
    async auth(email, password) {
        if (!email) {
            throw new MissingParamError('email')
        }
        if (!password) {
            throw new MissingParamError('password')
        }
        if (!this.loadUserByEmailRepository) {
            throw new MissingParamError('loadUserByEmailRepository')
        }
        if (!this.loadUserByEmailRepository.load) {
            throw new InvalidParamError('loadUserByEmailRepository')
        }

        const user = await this.loadUserByEmailRepository.load(email)

        if (!user) {
            return null
        }
    }
}

const makeSut = () => {
    class LoadUserByEmailRepositorySpy {
        async load(email) {
            this.email = email
        }
    }
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
    const sut = new AuthUseCase(loadUserByEmailRepositorySpy)

    return { sut, loadUserByEmailRepositorySpy }
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

    it('should retunr null if LoadUserByEmailRepository returns null', async() => {
        const { sut } = makeSut()
        const acessToken = await sut.auth('invalid_email@mail.com', 'any_password')
        expect(acessToken).toBeNull()
    })
})