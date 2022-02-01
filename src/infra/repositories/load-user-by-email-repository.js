module.exports = class LoadUserByEmailRepository {
    constructor(userModel) {
        this.userModel = userModel
    }
    async load(email) {
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