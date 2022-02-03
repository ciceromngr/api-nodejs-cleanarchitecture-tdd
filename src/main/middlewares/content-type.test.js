const request = require('supertest')
const app = require('../config/app')

describe('Content type Middleware', () => {
    it('should return json content-type as default', async() => {
        app.get('/api/content_type', (req, res) => {
            res.send({})
        })

        await request(app)
            .get('/api/content_type')
            .expect('content-type', /json/)
    })

    it('should return xml content-type if forced', async() => {
        app.get('/api/content_type_xml', (req, res) => {
            res.type('xml')
            res.send('')
        })

        await request(app)
            .get('/api/content_type_xml')
            .expect('content-type', /xml/)
    })
})