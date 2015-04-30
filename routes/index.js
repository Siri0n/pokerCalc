var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { hands: [1,2,3,4], basic: [[5,6,7,8]] });
});

module.exports = router;
