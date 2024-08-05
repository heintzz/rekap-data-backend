const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://situnting-pegundungan.vercel.app',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  headers: ['Authorization', 'Content-Type'],
};

module.exports = corsOptions;
