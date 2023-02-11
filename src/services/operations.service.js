const Operation = require('../models/Operation');
const User = require('../models/User');
const axios = require('axios');

async function getAll() {
  const operations = await Operation.find({}).lean();
  return { operations };
}

async function validateRequest(req) {
  const { operationType } = req.body;

  const operation = await Operation.findOne({ type: operationType });
  if (!operation) return { error: 'Invalid operation type' };

  const user = await User.findById(req.user.id);
  if (!user) return { error: 'User does not exist' };

  const insufficientBalance = user.balance < operation.cost;
  if (insufficientBalance) return { error: 'Insufficient balance' };

  return { requestIsValid: true, user, operation };
}

function validateValues(values) {
  if (!Array.isArray(values)) return { error: 'key "values" should be an array' };
  if (!values.length) return { error: 'Please provide at least one value.' };
  return { valid: true, error: null };
}

function addition({ values, user, operation }) {
  const { error } = validateValues(values);
  if (error) return { error };

  const result = values.reduce((x, y) => x + y);
  const remainingBalance = user.balance - operation.cost;
  return { result, remainingBalance };
}

function subtraction({ values, user, operation }) {
  const { error } = validateValues(values);
  if (error) return { error };

  const result = values.reduce((x, y) => x - y);
  const remainingBalance = user.balance - operation.cost;
  return { result, remainingBalance };
}

function division({ values, user, operation }) {
  const { error } = validateValues(values);
  if (error) return { error };

  const result = values.reduce((x, y) => x / y);
  const remainingBalance = user.balance - operation.cost;
  return { error, result, remainingBalance };
}

function multiplication({ values, user, operation }) {
  const { error } = validateValues(values);
  if (error) return { error };

  const result = values.reduce((x, y) => x * y);
  const remainingBalance = user.balance - operation.cost;
  return { result, remainingBalance };
}

function square_root({ values, user, operation }) {
  if (values[0] < 0) return { error: 'Only accept positive number for "square_root" operation' };
  const { error } = validateValues(values);
  if (error) return { error };

  const result = Math.sqrt(values[0]);
  const remainingBalance = user.balance - operation.cost;
  return { result, remainingBalance };
}

async function random_string({ user, operation, length, loweralpha = true, upperalpha = true }) {
  try {
    const response = await axios.get('https://www.random.org/strings', {
      params: {
        num: 1,
        len: length || 12,
        loweralpha: loweralpha ? 'on' : 'off',
        upperalpha: upperalpha ? 'on' : 'off',
        digits: 'on',
        unique: 'on',
        rnd: 'new',
        format: 'plain',
      },
    });
    const remainingBalance = user.balance - operation.cost;
    return { result: response.data, remainingBalance };
  } catch (error) {
    console.error(error.response?.data || error);
    return { error: error.response?.data.replace('len', 'length') || error.message };
  }
}

function getOperationHandler(type) {
  const operations = { addition, subtraction, multiplication, division, square_root, random_string };
  return operations[type];
}

module.exports = { validateRequest, validateValues, getOperationHandler, getAll };
