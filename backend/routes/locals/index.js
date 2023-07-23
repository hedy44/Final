const express = require('express');
const router = express.Router();
const { locals } = require('../../controllers');
const authMiddleware = require('../../middlewares/auth.js');


router.get('/',authMiddleware, async (req, res) => {
    try {
      const getLocals= await locals.getAllLocals(req.user.id);
      res.render('locals', { locals: getLocals });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/editlocal/:id',authMiddleware, locals.renderEditLocalPage);
router.post('/editlocal/:id',authMiddleware, locals.editLocal);



module.exports = router;