const express = require('express');
const passport = require('passport');
const logRoutes = express.Router();
const mongoQuery = require('../dal/mongo');


logRoutes.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/welcome.html#!/login?status=1'
    }), (req, res) => {
        const adminFlag = req.session.passport.user.role;
        adminFlag === 'admin' ? res.redirect('layout.html#!/admin') : res.redirect('/layout.html');
    }
);

logRoutes.post('/signup',
    passport.authenticate('local-sign', {
        successRedirect: '/layout.html',
        failureRedirect: '/welcome.html#!/sign?status=2'
    })
);

logRoutes.get('/logout', (req, res) => {
    req.logout();
    req.session = null;
    res.redirect('/welcome.html#!/login');
});

logRoutes.post('/verifyid', mongoQuery.checkUserId);



module.exports = logRoutes;