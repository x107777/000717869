//imports
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

//connect to database
mongoose.connect(config.database);

//On connect
mongoose.connection.on('connected', () => {
    console.log('Connected to database ' + config.database);
});

//On connect
mongoose.connection.on('error', (err) => {
    console.log('database error ' + err);
});



const app = express();
app.use(session({ secret: 'your secret' }));

//Routes
const users = require('./routes/users');

//Port number
const port = 3000;

//CORS Middleware
app.use(cors());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));


//Body Parser Middleware
app.use(bodyParser.json());

//Password Middleware
require('./config/passport')(passport);

app.use('/users', users);

//Index route
app.get('/', (req, res) => {
    res.send('Invalid endpoint');
}); 

//any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

//Start server
app.listen(port, () => {
    console.log('Server started on port' + port);
});
