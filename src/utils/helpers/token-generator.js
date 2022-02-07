const jwt = require('jsonwebtoken')
const MissingParamError = require("../errors/missing-param-erros")

module.exports = class TokenGenerator {
    constructor(secret) {
        this.secret = secret
    }
    async generator(id) {
        if (!this.secret) {
            throw new MissingParamError('secret')
        }
        if (!id) {
            throw new MissingParamError('id')
        }
        return jwt.sign({ _id: id }, this.secret)
    }
}