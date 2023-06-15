const express = require('express');
const router = express.Router();
const { user } = require('../../controllers');

router.get('/', (req, res) => {
    

    if(req.session.authorized){
        res.render('profile', {email: req.session.user.email})
    }else{
        res.render('login');
        }
    
});

 router.post('/', user.login);


module.exports = router;