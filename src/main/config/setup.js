const cors = require("../middlewares/cors")

module.exports = (app, express) => {
    app.disable('x-powered-by')
    app.use(express.json())
    app.use(cors)
}