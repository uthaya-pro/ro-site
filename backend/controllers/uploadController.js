const { success, error } = require('../utils/response');

const uploadImage = (req, res) => {
  if (!req.file) {
    return error(res, 'No file uploaded.', 400);
  }

  // With Cloudinary, multer populates:
  //   req.file.path       → secure CDN URL  (e.g. https://res.cloudinary.com/...)
  //   req.file.filename   → public_id
  return success(res, {
    url:       req.file.path,
    public_id: req.file.filename,
  }, 'Image uploaded successfully.');
};

module.exports = { uploadImage };
