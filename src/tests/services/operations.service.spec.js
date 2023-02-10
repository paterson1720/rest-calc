const Operation = require('../../models/Operation');
const User = require('../../models/User');
const axios = require('axios');
const service = require('../../services/operations.service');

describe('operation.service', () => {
  jest.mock('../../models/Operation', () => ({
    find: jest.fn().mockResolvedValueOnce([{ type: 'addition' }, { type: 'subtraction' }]),
    findOne: jest.fn().mockResolvedValue({ type: 'addition', cost: 10 }),
  }));

  jest.mock('../../models/User', () => ({
    findById: jest.fn().mockResolvedValue({ id: 'user_id', balance: 100 }),
  }));

  jest.mock('axios', () => ({
    get: jest.fn().mockResolvedValue({ data: 'random_string' }),
  }));

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('validateRequest', () => {
    it('should return an error when operation type is not valid', async () => {
      Operation.findOne = jest.fn().mockResolvedValue(null);
      const req = { body: { operationType: 'invalid' }, user: { id: 'user_id' } };
      const result = await service.validateRequest(req);
      expect(result).toEqual({ error: 'Invalid operation type' });
    });

    it('should return an error when user does not exist', async () => {
      Operation.findOne = jest.fn().mockResolvedValue({ type: 'addition', cost: 10 });
      User.findById = jest.fn().mockResolvedValue(null);
      const req = { body: { operationType: 'addition' }, user: { id: 'user_id' } };
      const result = await service.validateRequest(req);
      expect(result).toEqual({ error: 'User does not exist' });
    });

    it('should return an error when balance is insufficient', async () => {
      User.findById = jest.fn().mockResolvedValue({ balance: 5 });
      const req = { body: { operationType: 'addition' }, user: { id: 'user_id' } };
      const result = await service.validateRequest(req);
      expect(result).toEqual({ error: 'Insufficient balance' });
    });

    it('should return a success response when request is valid', async () => {
      User.findById = jest.fn().mockResolvedValue({ id: 'user_id', balance: 100 });
      const req = { body: { operationType: 'addition' }, user: { id: 'user_id' } };
      const result = await service.validateRequest(req);
      expect(result).toEqual({
        requestIsValid: true,
        user: { id: 'user_id', balance: 100 },
        operation: { type: 'addition', cost: 10 },
      });
    });
  });

  describe('getAll', () => {
    it('should return an object with "operations" key', async () => {
      Operation.find = () => ({
        lean: jest.fn().mockReturnValue([]),
      });
      const result = await service.getAll();
      expect(result).toEqual({ operations: expect.any(Array) });
    });
  });

  describe('validateValues', () => {
    it('should return an object with "valid" key set to true if values is an array with at least one element', () => {
      const result = service.validateValues([1, 2, 3]);
      expect(result).toEqual({
        valid: true,
        error: null,
      });
    });

    it('should return an object with "error" key if values is not an array', () => {
      const result = service.validateValues({});
      expect(result).toEqual({
        error: 'key "values" should be an array',
      });
    });

    it('should return an object with "error" key if values is an empty array', () => {
      const result = service.validateValues([]);
      expect(result).toEqual({
        error: 'Please provide at least one value.',
      });
    });
  });
});
