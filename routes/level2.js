var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('level2', { title: 'Уровень 2:' });
});

module.exports = router;
