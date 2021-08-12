require('dotenv').config();
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const { nanoid } require('nanoid');
const dns = require('dns');

/* Configure everything for the MongoDB instance. */
const { Schema } = mongoose;
mongoose.connect(process.env.MONGO_URI, {
                                          useNewUrlParser: true,
                                          useUnifiedTopology: true
                                        });

const urlSchema = new Schema({
  originalURL: {
    type: String,
    required: true,
  },
  shortURL: {
    type: String,
    default: () => nanoid(10),
  },
  numberClicks: {
    type: Number,
    default: 0,
  }
});

const ShortenedURL = mongoose.model('ShortenedURL', urlSchema);

const findURLById = (urlId, done) => {
  ShortenedURL.findURLById(urlId, (err, data) => {
    if (err) return console.error(err);
    done(null, data);
  });
};

/* GET present a simple form. */
router.get('/', (req, res, next) => {
  res.render('shorten', {title: 'URL Shortener'});
});



module.exports = router;
