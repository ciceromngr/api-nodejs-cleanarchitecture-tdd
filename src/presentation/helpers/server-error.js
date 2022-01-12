module.exports = class ServerError extends Error {
    constructor() {
        super('Server Errror')
        this.name = 'ServerError'
    }
}