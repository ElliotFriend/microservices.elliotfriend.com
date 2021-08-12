var express = require('express');
var router = express.Router();
var multer = require('multer');

/* Configure file upload storage */
let storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.fieldname}`)
  }
});
let upload = multer({ storage: storage });

router.get('/', (req, res, next) => {
  res.render('upload', {title: 'Request Headers Parser'});
});

router.post('/', upload.single('upfile'), (req, res, next) => {
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
  });
});

module.exports = router;
