const express = require('express');
const router = express.Router();

/**GET contact page */
router.get('/contact',function(req,res,next){
    res.render('contact',{});
});
module.exports = router;