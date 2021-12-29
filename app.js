const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const limiter = require('./middlewares/rate-limiter');

const { PORT = 3000 } = process.env;
const { MONGODB_URL } = require('./config');

const app = express();

const auth = require('./middlewares/auth');
const cors = require('./middlewares/cors');
const errorHandler = require('./middlewares/error');

app.use(cors);

limiter.handleRateLimit(app);

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  autoIndex: true,
});

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);

router.handleRoutes(app, auth);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
