module.exports = {
  mongoUri: process.env.MONGODB_URI
    || process.env.MONGO_HOST
    || 'mongodb://localhost:27017/mern-skeleton',
  jwtSecret: process.env.JWT_SECRET
    || '$2y$12$LJCkMbtkz3tW00sHlT1.kegxLTzcDgon7UOndeYdLx/vog6Yw8q3i'
};
