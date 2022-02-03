const cors = require("../middlewares/cors")
const jsonParser = require("../middlewares/json-parser")

module.exports = (app, express) => {
    app.disable('x-powered-by')
    app.use(jsonParser)
    app.use(cors)
}