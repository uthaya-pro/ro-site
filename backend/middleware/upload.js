const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage — files go directly to the cloud, no local disk needed
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'tuty-ro-purifier',        // Cloudinary folder name
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ width: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
    public_id: (req, file) => `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, jpeg, png, webp, gif)'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
});

module.exports = upload;
module.exports.cloudinary = cloudinary;
