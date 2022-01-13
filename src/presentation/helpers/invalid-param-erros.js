module.exports = class InvalidParamError extends Error {
    constructor(paramErro) {
        super(`Invalid Error: ${paramErro}`)
        this.name = 'InvalidParamError'
    }
}