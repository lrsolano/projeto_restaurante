const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');



module.exports = app => {
    app.use(logger('dev'));
    app.use(helmet());
    app.use(cookieParser());
    app.use(bodyParser.json())
    app.use(cors())

}