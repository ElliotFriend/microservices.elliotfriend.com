var express = require('express');
var router = express.Router();

/* GET request headers */
router.get('/', (req, res, next) => {
  let responseObject = {
    ipaddress: req.ip,
    language: req.get('accept-language'),
    software: req.get('user-agent'),
  };

  res.json(responseObject);
});

module.exports = router;
