var express = require('express');
var router = express.Router();

/* GET timestamp from the server. */
router.get('/', (req, res, next) => {
  var nowDate = new Date();
  res.json({
    unix: nowDate.valueOf(),
    utc: nowDate.toUTCString()
  });
});

/* GET timestamp information for a given string. */
router.get('/:timestamp', (req, res, next) => {
  let timeString = req.params.timestamp;
  if (/\d{5,}/.test(timeString)) {
    let timeInt = parseInt(timeString);
    res.json({
      unix: timeInt,
      utc: new Date(timeInt).toUTCString()
    });
  } else {
    let dateObj = new Date(timeString);
    return dateObj.toString() === "Invalid Date"
      ? res.json({ error: "Invalid Date" })
      : res.json({
          unix: dateObj.valueOf(),
          utc: dateObj.toUTCString()
        });
  }
});

module.exports = router;
