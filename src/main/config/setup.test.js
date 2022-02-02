const request = require('supertest')
const app = require('./app')

describe('App Setup', () => {
    it('should disable x-powered-by header', async() => {
        app.get('/api/disable-x-powered-by', (req, res) => {
            res.send('')
        })

        const res = await request(app).get('/api/disable-x-powered-by')
        expect(res.headers['x-powered-by']).toBeUndefined()
    })
})