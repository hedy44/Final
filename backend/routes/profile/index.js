const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.js');

router.get('/',authMiddleware, (req, res) => {
    
   
        res.render('profile', {email: req.user.email});
    
});

module.exports = router;