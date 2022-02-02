const request = require('supertest')
const app = require('../config/app')

describe('CORS Middleware', () => {
    it('should enable CORS', async() => {
        app.get('/api/enable_CORS', (req, res) => {
            res.send('')
        })

        const res = await request(app).get('/api/enable_CORS')
        expect(res.headers['access-control-allow-origin']).toBe('*')
        expect(res.headers['access-control-allow-methods']).toBe('*')
        expect(res.headers['access-control-allow-headers']).toBe('*')
    })
})