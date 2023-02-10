const Record = require('../../models/Record');
const { getAllPaginated, deleteOne } = require('../../services/records.service');

jest.mock('../../models/Record', () => {
  return {
    countDocuments: jest.fn(),
    find: jest.fn(),
    findOneAndUpdate: jest.fn(),
  };
});

describe('getAllPaginated', () => {
  it('should return records with pagination information', async () => {
    Record.countDocuments.mockReturnValueOnce(20);
    Record.find.mockReturnValueOnce({
      populate: jest.fn(() => ({
        skip: jest.fn(() => ({
          limit: jest.fn(() => ({
            sort: jest.fn(),
          })),
        })),
      })),
    });

    await getAllPaginated({ userId: 'user123', page: 0, limit: 10 });

    expect(Record.countDocuments).toHaveBeenCalledWith({
      user: 'user123',
      $or: [
        {
          deleted: { $exists: false },
        },
        { deleted: false },
      ],
    });
    expect(Record.find).toHaveBeenCalledWith({
      user: 'user123',
      $or: [
        {
          deleted: { $exists: false },
        },
        { deleted: false },
      ],
    });
  });
});

describe('deleteOne', () => {
  it('should delete a record and return the record', async () => {
    Record.findOneAndUpdate = jest.fn(() => ({ lean: jest.fn().mockReturnValueOnce({ _id: 1, deleted: true }) }));

    const result = await deleteOne({ recordId: 'record123', userId: 'user456' });

    expect(Record.findOneAndUpdate).toHaveBeenCalledWith(
      {
        _id: 'record123',
        user: 'user456',
      },
      { $set: { deleted: true } }
    );
    expect(result).toEqual({ record: { _id: 1, deleted: true } });
  });
});
