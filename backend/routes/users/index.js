const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    res.send(`<h1>${req.query.theme} ${req.query.sort}</h1>`);
});

router.get('/:email', (req,res) => {
    console.log(req.cookies); //Isto tem que estar em views pós login
   res.render('profile', {email : req.params.email}); 
});



module.exports = router;