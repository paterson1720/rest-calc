const mongoose = require('mongoose');
const Operation = require('../models/Operation');

const operations = [
  { type: 'addition', label: 'Addition', cost: 2 },
  { type: 'subtraction', label: 'Subtraction', cost: 2 },
  { type: 'multiplication', label: 'Multiplication', cost: 2 },
  { type: 'division', label: 'Division', cost: 3 },
  { type: 'square_root', label: 'Square Root', cost: 4 },
  { type: 'random_string', label: 'Random String', cost: 5 },
];

mongoose
  .connect(
    'mongodb+srv://koderspace:cCl8xmZqaNxnLdZW@cluster0.cb6qv.mongodb.net/restcalc-prod?retryWrites=true&w=majority'
  )
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
