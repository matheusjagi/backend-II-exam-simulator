var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var multer = require('multer');
var configMulter = multer({
    storage: multer.diskStorage({
        destination: function(req, file, callback){
            callback(null, './app/public/uploads');
        },
        filename: function(req, file, callback){
            callback(null, Date.now()+'-'+file.originalname);
        }
    })
});
var app = express();
app.upload = configMulter;
app.set('view engine','ejs');
app.set('views','./app/views'); 
app.use(express.static('./app/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressValidator());
app.use(expressSession({
    secret: 'fdhi7rfh85hf',
    resave: false, 
    saveUninitialized: false
}));
consign()
    .include('app/routes')
    .then('config/dbConnection.js')    
    .then('app/models')
    .then('app/controllers')
    .into(app);
module.exports = app;

