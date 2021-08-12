require('dotenv').config();
let express = require('express');
let router = express.Router();
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
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

/* POST the long url to the database and receive the shorturl back */
router.post('/', async (req, res, next) => {
  const invalidResponse = { error: 'invalid url' };
  const re = /^https?\:\/\//
  let url = req.body.url;

  // Test for only HTTP(S) URLs
  if (!re.test(url)) {
    // Non-HTTP(S) URL given, send error
    res.status(400).json(invalidResponse);
    return;
  } else {
    // Test for a valid domain
    dns.lookup(url.replace(re, ''), async (err, address, family) => {
      if (err) {
        // Domain not found, send error
        console.log(err);
        res.status(400).json(invalidResponse);
        return;
      } else {
        // Create the shortURL and send it to the database
        let shortURL = new ShortenedURL({
          originalURL: url,
        });
        let shortDoc = await shortURL.save();

        // Respond with success
        res.status(200).json({
          original_url: url,
          short_url: shortDoc.shortURL
        })
        return;
      }
    });
  }
})

router.get('/:shorturl', async (req, res, next) => {
  let nanoId = req.params.shorturl;
  // Find the original URL in the database, increase click-count
  let doc = await ShortenedURL.findOneAndUpdate({ shortURL: nanoId }, { $inc: { numberClicks: 1 } });
  // Redirect user to originalURL
  res.redirect(doc.originalURL);
  return;
})

module.exports = router;
