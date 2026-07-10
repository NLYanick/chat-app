const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'images');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {    
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    
    let ext = path.extname(file.originalname);
    if (!ext && file.mimetype) {
      ext = '.' + file.mimetype.split('/')[1];
    }
    
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

module.exports = multer({ storage: storage });