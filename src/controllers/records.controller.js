const service = require('../services/records.service');

async function getAllPaginated(req, res) {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const result = await service.getAllPaginated({ page, limit, userId });
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteOneRecord(req, res) {
  try {
    const { recordId } = req.params;
    const userId = req.user.id;
    const { record } = await service.deleteOne({ recordId, userId });
    return res.status(200).json({ record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getAllPaginated, deleteOneRecord };
