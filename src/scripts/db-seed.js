const mongoose = require('mongoose');
const Operation = require('../models/Operation');

const operations = [
  { type: 'addition', cost: 1 },
  { type: 'subtraction', cost: 1 },
  { type: 'multiplication', cost: 2 },
  { type: 'division', cost: 2 },
  { type: 'square_root', cost: 3 },
  { type: 'random_string', cost: 3 },
];

mongoose
  .connect('mongodb://127.0.0.1:27017/restcalc')
  .then(() => {
    console.log('MongoDB connected...');

    Operation.deleteMany({})
      .then(() => {
        console.log('Operations collection cleared...');

        Operation.insertMany(operations)
          .then(() => {
            console.log('Operations seeded...');
            process.exit();
          })
          .catch((error) => {
            console.error(error);
            process.exit();
          });
      })
      .catch((error) => {
        console.error(error);
        process.exit();
      });
  })
  .catch((error) => {
    console.error(error);
    process.exit();
  });
