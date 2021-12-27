const rateLimit = require('express-rate-limit');

const handleRateLimit = (app) => {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  });

  app.use(limiter);
};

module.exports = {
  handleRateLimit,
};
