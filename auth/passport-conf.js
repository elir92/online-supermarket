const mongoose = require('mongoose');
const userSchema = require('../models/user.model');
const User = mongoose.model('users', userSchema);
const bcrypt = require('bcryptjs');

const passportHandlers = {
    signup: (req, username, password, done) => {
        //req.body contains all form fields from the signup form
        User.findOne({ username }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (user) {
                return done(null, false, { message: 'User exsists' });
            }
            if (req.body.password !== req.body.confirm_password) {
                return done(null, false);
            }
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            const newUser = new User(req.body);
            newUser.password = hash;
            newUser.save((err, newUser) => {
                if (err) {
                    return done(err);
                }
                return done(null, newUser);
            })
        })

    },
    login: (username, password, done) => {
        User.findOne({ username }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }
            const hashedPass = user.password;
            const decodedPass = bcrypt.compareSync(password, hashedPass); // true
            if (!decodedPass) {
                return done(null, false, { message: 'Incorrect password' });
            }

            return done(null, user);
        });
    },
    serializeUser: (user, done) => done(null, user),
    deserializeUser: (user, done) => done(null, user),
    validatedUser: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.json({ status: false });
    }
}

module.exports = passportHandlers;