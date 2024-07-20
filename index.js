const express = require('express');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const corsOptions = require('./config/cors');
const PORT = 8080;
require('dotenv').config();

app.use(morgan(':method :url :status - :response-time ms'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions));

mongoose.connect(process.env.SITUNTING_DATABASE_URL);

app.get('/', (req, res) => {
  res.send('Welcome to Situnting Backend!');
});

// app.use('/auth', require('./routes/auth.route.js'));
app.use('/parents', require('./routes/parent.route.js'));
app.use('/children', require('./routes/child.route.js'));
app.use('/records', require('./routes/record.route.js'));
app.use('/reports', require('./routes/report.route.js'));
app.use('/summary', require('./routes/summary.route.js'));

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to db');
  app.listen(PORT, () => {
    console.log(`Service running on port ${PORT}`);
  });
});
