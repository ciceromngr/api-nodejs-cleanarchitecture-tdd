const request = require('supertest')
const app = require('../config/app')

describe('JSON parser Middleware', () => {
    it('should parse body as json', async() => {
        app.post('/api/json_parser', (req, res) => {
            res.send(req.body)
        })

        await request(app)
            .post('/api/json_parser')
            .send({ email: 'teste@teste.com' })
            .expect({ email: 'teste@teste.com' })

    })
})