const express = require('express');
const router = express.Router();
const { user } = require('../../controllers');


router.get('/', (req, res) => {
    res.render('register');
});

router.post('/', user.create);

module.exports = router;