const express = require('express');
const router = express.Router();
//const { user } = require('../../controllers');
const authMiddleware = require('../../middlewares/auth.js');

router.get('/',authMiddleware, (req, res) => {
   
    
        res.render('logged',{email: req.user.email});
    
});

module.exports = router;