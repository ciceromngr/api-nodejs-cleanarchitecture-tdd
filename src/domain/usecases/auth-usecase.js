const { MissingParamError, InvalidParamError } = require("../../utils/errors")

module.exports = class AuthUseCase {
    constructor({ loadUserByEmailRepository, updateAccessTokenRepository, encrypter, tokenGenerator } = {}) {
        this.loadUserByEmailRepository = loadUserByEmailRepository
        this.updateAccessTokenRepository = updateAccessTokenRepository
        this.encrypter = encrypter
        this.tokenGenerator = tokenGenerator
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
        const isvalid = user && await this.encrypter.compare(password, user.password)

        if (isvalid) {
            const acessToken = await this.tokenGenerator.generator(user.id)
            await this.updateAccessTokenRepository.update(user.id, acessToken)
            return acessToken
        }

        return null
    }
}