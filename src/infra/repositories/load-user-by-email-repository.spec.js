const MongoHelper = require('../helpers/mongo-helper')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')
const MissingParamError = require('../../utils/errors/missing-param-erros')

const makeSut = () => {
    const sut = new LoadUserByEmailRepository()
    return { sut }
}

describe('LoadUserByEmail Repository', () => {
    let userModel

    beforeAll(async() => {
        await MongoHelper.connect(process.env.MONGO_URL)
        userModel = await MongoHelper.getCollection('users')
    });

    beforeEach(async() => {
        await userModel.deleteMany();
    });

    afterAll(async() => {
        await MongoHelper.disconnect();
    });

    it('should return null if no user is found', async() => {
        const { sut } = makeSut()
        const user = await sut.load('invalid_email@mail.com')
        expect(user).toBeNull()
    })

    it('should return an user if user is found', async() => {
        const { sut } = makeSut()
        await userModel.insertOne({ email: 'valid_email@mail.com' });
        const user = await sut.load('valid_email@mail.com')
        expect(user.email).toBe('valid_email@mail.com')
    })

    it('should throw if no email is provider', async() => {
        const { sut } = makeSut()
        const promise = sut.load()
        expect(promise).rejects.toThrow(new MissingParamError('email'))
    })
})