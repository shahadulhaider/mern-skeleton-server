module.exports = {
  port: process.env.port || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri:
    process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
    'mongodb://localhost:27017/mern-skeleton',
  jwtSecret:
    process.env.JWT_SECRET ||
    '$2y$12$LJCkMbtkz3tW00sHlT1.kegxLTzcDgon7UOndeYdLx/vog6Yw8q3i',
  snedgrid: {
    apiKey:
      process.env.SENDGRID_API_KEY ||
      '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',
    fromEmail: process.env.FROM_EMAIL || 'noreplay@example.com',
    fromName: process.env.FROM_NAME || 'Example',
  },
};
