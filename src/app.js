const express = require('express');
const session = require('express-session');
const handlebars = require('express-handlebars');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const router = require('./controllers/SiteController');
const Database = require('./config/data');
const fileUpload = require('express-fileupload');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
//session
app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'somesecret', 
    cookie: { maxAge: 60000 }}));
//teamplate engine
app.engine('hbs', handlebars({
    extname: 'hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));
// enable file upload
app.use(fileUpload({
    createParentPath: true,
    limits: { fileSize: 1000 * 1024 * 1024 }
}))

app.use('/', router);


app.listen(8000);