const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.js');


router.get('/',authMiddleware, (req, res) => {
    
   
        res.render('profile', {email: req.user.email,
                                gender: req.user.gender,
                                username: req.user.username,
                                firstName: req.user.firstName,
                                lastName: req.user.lastName,
                                age: req.user.age});
    
});


module.exports = router;