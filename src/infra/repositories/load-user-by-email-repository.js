const MissingParamError = require("../../utils/errors/missing-param-erros")
const MongoHelper = require("../helpers/mongo-helper")
module.exports = class LoadUserByEmailRepository {
    async load(email) {
        if (!email) throw new MissingParamError('email')
        const userModel = await MongoHelper.getCollection('users')
        const user = await userModel.findOne({ email }, {
            projection: {
                password: 1,
                email: 1,
                _id: 1
            }
        })
        return user
    }
}