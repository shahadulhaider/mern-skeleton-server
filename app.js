const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');

require('./config/database');

const { notFound, errorHandler } = require('./middlewares');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
app.use(passport.initialize());

app.use('/api/users', userRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
