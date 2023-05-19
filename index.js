const express = require('express');
const app = express();
const path = require('path');
const db = require('./models');
const hbs = require('hbs');
const session = require('express-session');
const dotenv = require('dotenv').config({path:'./.env'});
const cookieParser = require('cookie-parser');

//Importing router Object
const users = require('./routes/users');
const login = require('./routes/login');
const register = require('./routes/register');
const logout = require ('./routes/logout');
const sensors = require('./routes/sensors');
const locals = require('./routes/locals');
const graphs = require('./routes/graphs');
const addsensor = require('./routes/addsensor');
const addlocal = require('./routes/addlocal');
const sensorsread = require('./routes/sensorsread');
const logged = require('./routes/logged');
const profile = require('./routes/profile');



//Set template view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

//Path to use static files , css, images , etc.
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

const partialsPath= path.join(__dirname, './views/partials');
hbs.registerPartials(partialsPath);

//Responsible for populating the req.body with data
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(
    {
    secret: 'ninguempodesaberdisto',
    cookie:{
        sameSite:'strict'
    }
    }    
));




//ROTAS
app.use('/users', users);
app.use('/login', login);
app.use('/register', register);
app.use('/logout', logout);
app.use('/sensors', sensors);
app.use('/locals', locals);
app.use('/graphs' , graphs);
app.use('/addsensor', addsensor);
app.use('/addlocal', addlocal);
app.use('/sensorsread', sensorsread);
app.use('/logged', logged);
app.use('/profile', profile);






app.use((req,res,next) => {
    console.log(new Date().toLocaleDateString());
    next();
})


app.get('/', 
    (req, res, next) => {
         res.render('notlogged')});

app.all('/my-route', (req, res)=>{
    res.send('This route could have been acessed with any HTTP method!')
});




//Database Connection
(async () => {
    await db.sequelize.sync();
    console.log("Connected!");
})();


//Server connection

const PORT = process.env.PORT || 3000;

app.listen(PORT || 3000, () => { 
   console.log(`listening on *: ${PORT}`);
});