const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 1, message: 'Limite atingido' })


module.exports = app => {
    app.use(logger('dev'));
    app.use(helmet());
    app.use(limiter)
    app.use(cookieParser());
    app.use(bodyParser.json())
    app.use(cors())

}