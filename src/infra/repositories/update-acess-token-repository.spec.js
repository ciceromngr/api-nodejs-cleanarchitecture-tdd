const { MissingParamError } = require('../../utils/errors')
const MongoHelper = require('../helpers/mongo-helper')
const UpdateAcessTokenRepository = require('./updata-acess-token-repository')
let userModel, fakeUserId

const makeSut = () => {
    return new UpdateAcessTokenRepository()
}

describe('UpdateAcessToken Repository', () => {
    beforeAll(async() => {
        await MongoHelper.connect(process.env.MONGO_URL)
        userModel = await MongoHelper.getCollection('users')
    });

    beforeEach(async() => {
        await userModel.deleteMany();
        fakeUserId = await userModel.insertOne({
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }).then(result => {
            return result.insertedId
        })
    });

    afterAll(async() => {
        await MongoHelper.disconnect();
    });

    it('should update the user with the given acessToken', async() => {
        const sut = makeSut()
        await sut.update(fakeUserId, 'valid_acessToken')
        const updatedFakeUser = await userModel.findOne({ _id: fakeUserId })
        expect(updatedFakeUser.acessToken).toBe('valid_acessToken')
    })

    it('should throw if no params are provider', async() => {
        const sut = makeSut()
        expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
        expect(sut.update(fakeUserId)).rejects.toThrow(new MissingParamError('acessToken'))
    })
})