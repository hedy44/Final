const express = require('express');
const router = express.Router();
const { locals } = require('../../controllers');
const authMiddleware = require('../../middlewares/auth.js');

router.get('/', (req, res) => {
    
    res.render('addlocal');
});

router.post('/',authMiddleware, locals.createLocal);
router.delete('/',authMiddleware, locals.deleteLocal);

module.exports = router;