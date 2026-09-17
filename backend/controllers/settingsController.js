const Setting = require('../models/Setting');
const { success } = require('../utils/response');

// GET /api/settings — public
const getSettings = async (req, res, next) => {
  try {
    const rows = await Setting.find();
    const settings = {};
    rows.forEach((row) => { settings[row.key] = row.value; });
    return success(res, settings);
  } catch (err) {
    next(err);
  }
};

// PUT /api/settings — admin
const updateSettings = async (req, res, next) => {
  try {
    const settings = req.body;

    const ops = Object.entries(settings).map(([key, value]) =>
      Setting.findOneAndUpdate(
        { key },
        { key, value },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    );
    await Promise.all(ops);

    const rows = await Setting.find();
    const updatedSettings = {};
    rows.forEach((row) => { updatedSettings[row.key] = row.value; });

    return success(res, updatedSettings, 'Settings updated successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getSettings, updateSettings };
