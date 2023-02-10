require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

const app = express();

app.use(cors())
app.use(express.json());
app.use('/api/v1', ...routes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.info('Connected to MongoDB');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.info('Server started on port: ' + PORT));
});
