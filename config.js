const {
  JWT_SECRET_DEV = 'dev-key',
  MONGODB_URL = 'mongodb://localhost:27017/moviesdb',
} = process.env;

module.exports = {
  JWT_SECRET_DEV,
  MONGODB_URL,
};
