const MongoHelper = require('./mongo-helper')
describe('Mongo Helper', () => {
    it('should reconnect when getDb() is invoked nad client is disconnected', async() => {
        const sut = MongoHelper
        await sut.connect(process.env.MONGO_URL)
        expect(sut.db).toBeTruthy()
        await sut.disconnect()
        expect(sut.db).toBeFalsy()
        await sut.getDb()
        expect(sut.db).toBeTruthy()
        await sut.disconnect()
    })
})