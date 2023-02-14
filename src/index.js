require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const rfs = require('rotating-file-stream');

const routes = require('./routes');

const app = express();

const accessLogStream = rfs.createStream('requests.log', {
  interval: '1d',
  path: './logs',
});

process.env.NODE_ENV !== 'production' && app.use(morgan('dev'));
app.use(morgan('combined', { stream: accessLogStream }));
app.use(cors());
app.use(express.json());
app.use('/api/v1', ...routes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.info('Connected to MongoDB');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.info('Server started on port: ' + PORT));
});
