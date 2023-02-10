const Record = require('../models/Record');

async function getAllPaginated({ userId, page, limit }) {
  const query = {
    user: userId,
    $or: [
      {
        deleted: { $exists: false },
      },
      { deleted: false },
    ],
  };
  const totalDocuments = await Record.countDocuments(query);
  const totalPage = Math.round(totalDocuments / limit);
  const hasNextPage = page < totalPage;
  const hasPreviousPage = page > 0;
  const nextPage = hasNextPage ? page + 1 : null;
  const previousPage = hasPreviousPage ? page - 1 : null;

  if (page > 1 && page > totalPage) page = totalPage;

  const records = await Record.find(query)
    .populate('operation')
    .skip(page * limit)
    .limit(limit)
    .sort({ date: -1 });

  return {
    records,
    pagination: {
      totalDocuments,
      totalPage,
      currentPage: page,
      limit,
      hasNextPage,
      hasPreviousPage,
      previousPage,
      nextPage,
    },
  };
}

async function deleteOne({ recordId, userId }) {
  const record = await Record.findOneAndUpdate(
    {
      _id: recordId,
      user: userId,
    },
    { $set: { deleted: true } }
  ).lean();
  return { record };
}

module.exports = { getAllPaginated, deleteOne };
