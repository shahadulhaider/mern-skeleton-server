const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');

require('./config/database');

const indexRouter = require('./routes/index');
const { notFound, errorHandler } = require('./middlewares');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(cors());

app.use('/', indexRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
