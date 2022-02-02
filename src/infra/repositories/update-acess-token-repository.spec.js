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

    beforeAll(async() => {
        await MongoHelper.connect(process.env.MONGO_URL)
        db = await MongoHelper.getDb()
    });

    beforeEach(async() => {
        await db.collection('users').deleteMany();
    });

    afterAll(async() => {
        await MongoHelper.disconnect();
    });

    it('should update the user with the given acessToken', async() => {
        const { sut, userModel } = makeSut()
        const fakeUserId = await userModel.insertOne({
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }).then(result => {
            return result.insertedId
        })
        await sut.update(fakeUserId, 'valid_acessToken')
        const updatedFakeUser = await userModel.findOne({ _id: fakeUserId })
        expect(updatedFakeUser.acessToken).toBe('valid_acessToken')
    })

    it('should throw if no userModel is provider', async() => {
        const { sut, userModel } = makeSut()
        sut.userModel = null
        const fakerUserId = await userModel.insertOne({
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }).then(result => {
            return result.insertedId
        })
        const promise = sut.update(fakerUserId, 'valid_acessToken')
        expect(promise).rejects.toThrow()
    })

    it('should throw if no params are provider', async() => {
        const { sut, userModel } = makeSut()
        const fakerUserId = await userModel.insertOne({
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }).then(result => {
            return result.insertedId
        })
        expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
        expect(sut.update(fakerUserId)).rejects.toThrow(new MissingParamError('acessToken'))
    })
})