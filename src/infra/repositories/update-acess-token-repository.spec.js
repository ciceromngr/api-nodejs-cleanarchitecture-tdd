const MongoHelper = require('../helpers/mongo-helper')
let db

class UpdateAcessTokenRepository {
    constructor(userModel) {
        this.userModel = userModel
    }
    async update(userId, acessToken) {
        await this.userModel.updateOne({
            _id: userId
        }, {
            $set: {
                acessToken
            }
        })
    }
}

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
        const fakeUser = await userModel.insertOne({
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }).then(result => {
            return result.insertedId
        })
        await sut.update(fakeUser, 'valid_acessToken')
        const updatedFakeUser = await userModel.findOne({ _id: fakeUser })
        expect(updatedFakeUser.acessToken).toBe('valid_acessToken')
    })

    it('should throw if no userModel is provider', async() => {
        const { sut, userModel } = makeSut()
        sut.userModel = null
        const fakeUser = await userModel.insertOne({
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }).then(result => {
            return result.insertedId
        })
        const promise = sut.update(fakeUser, 'valid_acessToken')
        expect(promise).rejects.toThrow()
    })
})