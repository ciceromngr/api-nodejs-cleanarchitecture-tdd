module.exports = class MissingParamError extends Error {
    constructor(paramErro) {
        super(`Missing Error: ${paramErro}`)
        this.name = 'MissingParamError'
    }
}