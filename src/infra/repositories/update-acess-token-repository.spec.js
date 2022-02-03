const { MissingParamError } = require('../../utils/errors')
const MongoHelper = require('../helpers/mongo-helper')
const UpdateAcessTokenRepository = require('./updata-acess-token-repository')
let db

const makeSut = () => {
    const userModel = db.collection('users')
    const sut = new UpdateAcessTokenRepository(userModel)
    return { sut, userModel }
}

describe('UpdateAcessToken Repository', () => {
    let fakeUserId
    beforeAll(async() => {
        await MongoHelper.connect(process.env.MONGO_URL)
        db = await MongoHelper.getDb()
    });

    beforeEach(async() => {
        const userModel = db.collection('users')
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
        const { sut, userModel } = makeSut()
        await sut.update(fakeUserId, 'valid_acessToken')
        const updatedFakeUser = await userModel.findOne({ _id: fakeUserId })
        expect(updatedFakeUser.acessToken).toBe('valid_acessToken')
    })

    it('should throw if no userModel is provider', async() => {
        const { sut } = makeSut()
        sut.userModel = null
        const promise = sut.update(fakeUserId, 'valid_acessToken')
        expect(promise).rejects.toThrow()
    })

    it('should throw if no params are provider', async() => {
        const { sut } = makeSut()
        expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
        expect(sut.update(fakeUserId)).rejects.toThrow(new MissingParamError('acessToken'))
    })
})