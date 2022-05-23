//imports
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

//currentUser
let currentUser = null;

//register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        //--------------------------------------------NEW------------------------------------------------------------------------------------
        notes: 'Hello, I am a Note  :)',
        recipes: 'Hello, I am a Recipe :)'
        //--------------------------------------------NEW END------------------------------------------------------------------------------------
    });

    User.addUser(newUser, (err, user) => {
        if(err) {
            res.json({success: false, msg: 'Failed to register user'});
        } else{
            res.json({success: true, msg: 'User registered'});
        }
    });
});



//autheticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {  //trying to find user with the username
        if(err) throw err;
        if(!user) {
            return res.json({success: false, msg: 'User not found'});
        }
        User.comparePassword(password, user.password, (err, isMatch) => { //if user found, check if password is correct
            if(err) throw err;
            if(isMatch) {
                const token = jwt.sign({data: user}, config.secret, { //set token
                    expiresIn: 604800 // 1 week
                });
                res.json({ // if password is correct
                    success: true,
                    token: 'JWT '+token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        notes: user.notes,
                        recipes: user.recipes
                    }
                });
                currentUser = user;
            } else {
               return res.json({success: false, msg: 'wrong password'});
            }
        });
    });
});

//profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
    currentUser = req.user;
});

//--------------------------------------------NEW------------------------------------------------------------------------------------


//update Notes
router.put('/updateNotes', (req, res, next) => {

    User.getUserAndUpdateNotes(currentUser.username, req.body.notes, (err, user) => { //trying to find user with the current user username
        if(err) throw err;
        if(!user) {
            return res.json({success: false, msg: 'User not found'});
        }
        user.notes = req.body.notes;
                
        User.getUserByUsername(currentUser.username, (err, user) => { //trying to find user with the current user username to update user on server side
            if(err) throw err;
            if(!user) {
                return res.json({success: false, msg: 'User not found'});
            }
            res.json({
                success: true, msg: 'User Update', //updated user
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    notes: user.notes,
                    recipes: user.recipes
                }
            });
        });
        currentUser = user;

    });
});

//update Profile
router.put('/updateProfile', (req, res, next) => {

    User.getUserAndUpdateUsername(currentUser.id, req.body.username, (err, user) => {  //trying to find user with the current user id and pass on new username
        if(err) throw err;
        if(!user) {
            return res.json({success: false, msg: 'User not found'});
        }
        user.username = req.body.username;

        currentUser = user;
    });


    User.getUserAndUpdateEmail(currentUser.id, req.body.email, (err, user) => { //trying to find user with the current user id and pass on new email
        if(err) throw err;
        if(!user) {
            return res.json({success: false, msg: 'User not found'});
        }
        user.email = req.body.email;
                
        User.getUserById(currentUser.id, (err, user) => { //trying to find user with the current user id to update user on server side
            if(err) throw err;
            if(!user) {
                return res.json({success: false, msg: 'User not found'});
            }
            res.json({
                success: true, msg: 'User Update',  //updated user
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    notes: user.notes,
                    recipes: user.recipes
                }
            });
        });
        currentUser = user;

    });
});



//update recipes
router.put('/updateRecipes', (req, res, next) => {

    User.getUserAndUpdateRecipes(currentUser.username, req.body.recipes, (err, user) => { //trying to find user with the current user username
        if(err) throw err;
        if(!user) {
            return res.json({success: false, msg: 'User not found'});
        }
        user.recipes = req.body.recipes;
                
        User.getUserByUsername(currentUser.username, (err, user) => { //trying to find user with the current user username to update user on server side
            if(err) throw err;
            if(!user) {
                return res.json({success: false, msg: 'User not found'});
            }
            res.json({
                success: true, msg: 'User Update',  //updated user
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    notes: user.notes,
                    recipes: user.recipes
                }
            });
        });
        currentUser = user;

    });
});


//delete note
router.delete('/deleteNote', (req, res, next) => {
 
    User.getUserAndAddNote(currentUser.username, req.body.notes, (err, user) => { //trying to find user with the current user username and pass on the new empty string
        if(err) throw err;
        if(!user) {
            return res.json({success: false, msg: 'User not found'});
        }
       
        user.notes = req.body.notes;
                    
        User.getUserByUsername(currentUser.username, (err, user) => {
            if(err) throw err;
            if(!user) {
                return res.json({success: false, msg: 'User not found'});
            }
            res.json({
                success: true, msg: 'User Update', //updated user
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    notes: user.notes,
                    recipes: user.recipes
                }
            });
        });
        currentUser = user;

    });
});


//--------------------------------------------NEW END------------------------------------------------------------------------------------



module.exports = router;