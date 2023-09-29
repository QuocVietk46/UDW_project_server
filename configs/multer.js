const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.')[1];
    cb(null, `${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
