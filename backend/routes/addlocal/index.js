const express = require('express');
const router = express.Router();
const { locals } = require('../../controllers');

router.get('/', (req, res) => {
    
    res.render('addlocal');
});

router.post('/', locals.createLocal);
router.delete('/', locals.deleteLocal);

module.exports = router;