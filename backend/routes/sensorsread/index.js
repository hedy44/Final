const express = require('express');
const router = express.Router();
const { user } = require('../../controllers');

router.get('/', (req, res) => {
    
    res.render('sensorsread');
});


module.exports = router;