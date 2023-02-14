const Record = require('../models/Record');
const User = require('../models/User');
const service = require('../services/operations.service');
const logger = require('../utils/logger');

async function calculate(req, res) {
  try {
    const { operationType, values, upperalpha, loweralpha, length } = req.body;

    const { requestIsValid, error, user, operation } = await service.validateRequest(req);
    if (!requestIsValid) return res.status(400).json({ error });

    const operationHandler = service.getOperationHandler(operationType);
    if (!operationHandler) return res.status(400).json({ error: 'Invalid operation type' });

    const operationResult = await operationHandler({ values, user, operation, upperalpha, loweralpha, length });
    if (operationResult.error) return res.status(400).json({ error: operationResult.error });

    const { result, remainingBalance } = operationResult;

    await Record.create({
      operation: operation._id,
      user: user._id,
      amount: operation.cost,
      user_balance: remainingBalance,
      operation_response: operationResult,
      date: Date.now(),
    });

    await User.findByIdAndUpdate(user._id, { balance: remainingBalance });

    return res.status(200).json({ result, remainingBalance });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function getAllOperations(req, res) {
  try {
    const { operations } = await service.getAll();
    return res.status(200).json({ operations });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { calculate, getAllOperations };
