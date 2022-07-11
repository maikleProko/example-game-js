var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('level1', { title: 'Уровень 1: ' });
});

module.exports = router;
