const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.')[1];
    cb(null, `${file.originalname.split('.')[0]}_${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
