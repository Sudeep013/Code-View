var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Codeview' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Codeview - sharing and viewing code ' });
});

router.route('/contact')
      .get(function(req,res,next) {
        res.render('contact', { title: 'Codeview' })
      }) 
      .post(function(req, res, next) {
          res.render('thank', { title: 'Codeview' });
        });
      


module.exports = router;
