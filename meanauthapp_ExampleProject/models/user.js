//imports
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');



//User schema
let UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    //--------------------------------------------NEW------------------------------------------------------------------------------------
    notes: {
        type: String
    },
    recipes: {
        type: String
    }
    //--------------------------------------------NEW END------------------------------------------------------------------------------------
});


let User = module.exports = mongoose.model('User', UserSchema);

//get user by Id, uses findbyId
module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

//get user by Username, uses findOne, needs the username as a query
module.exports.getUserByUsername = function(username, callback) {
    const query = {username: username};
    User.findOne(query, callback);
}
//--------------------------------------------NEW------------------------------------------------------------------------------------

//get user by Username and updates that user, uses findOneAndUpdate, needs the username and toupdate Object (notes) as a query
module.exports.getUserAndUpdateNotes = function(username, notes, callback) {
    const findQuery = {username: username};
    const updateDataQuery = {notes: notes};
    User.findOneAndUpdate(findQuery, updateDataQuery, callback);
}

//get user by Id and updates that user, uses findByIdAndUpdate, needs toupdate Object (username) as a query
module.exports.getUserAndUpdateUsername = function(id, username, callback) {
    const updateDataQuery = {username: username};
    User.findByIdAndUpdate(id, updateDataQuery, callback);
}

//get user by Id and updates that user, uses findByIdAndUpdate, needs toupdate Object (email) as a query
module.exports.getUserAndUpdateEmail = function(id, email, callback) {
    const updateDataQuery = {email: email};
    User.findByIdAndUpdate(id, updateDataQuery, callback);
}

//get user by Username and updates that user, uses findOneAndUpdate, needs the username and toupdate Object (recipes) as a query
module.exports.getUserAndUpdateRecipes = function(username, recipes, callback) {
    const findQuery = {username: username};
    const updateDataQuery = {recipes: recipes};
    User.findOneAndUpdate(findQuery, updateDataQuery, callback);
}
//--------------------------------------------NEW END------------------------------------------------------------------------------------

//creates new User to database, password gets encyrpted
module.exports.addUser = function(newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
    User = newUser;
}

//checks if password is correct
module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
}


