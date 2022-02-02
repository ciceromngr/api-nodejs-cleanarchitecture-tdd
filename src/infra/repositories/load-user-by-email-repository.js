const MissingParamError = require("../../utils/errors/missing-param-erros")

module.exports = class LoadUserByEmailRepository {
    constructor(userModel) {
        this.userModel = userModel
    }
    async load(email) {
        if (!email) throw new MissingParamError('email')

        const user = await this.userModel.findOne({ email }, {
            projection: {
                password: 1,
                email: 1,
                _id: 1
            }
        })
        return user
    }
}