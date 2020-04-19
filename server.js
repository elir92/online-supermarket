const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const async = require('async');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const logRoutes = require('./routes/log_routes')
const routes = require('./routes/routes');
const passportConfig = require('./auth/passport-conf');
const env = require('./env/dev-env');
const path = require('path');
const fileUpload = require('express-fileupload');
const PORT = 4000;


//Configurations
passport.use('local', new LocalStrategy(passportConfig.login));
passport.use('local-sign', new LocalStrategy({
    passReqToCallback: true
}, passportConfig.signup));
passport.serializeUser(passportConfig.serializeUser);
passport.deserializeUser(passportConfig.deserializeUser);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET_SESSION_KEY,
    resave: false,
    unset: 'destroy',
    saveUninitialized: false,
    name: 'user_cookie',
    cookie: {
        httpOnly: false,
        maxAge: 7 * 24 * 3600 * 1000
    },
    store: new MongoStore({
        url: process.env.CONNECTION_STRING
    })
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.use(fileUpload());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/layout.html'));
});

// Routes
app.use(logRoutes);
app.use('/api', passportConfig.validatedUser, routes);


// Running the server
mongoose.Promise = global.Promise;
async.waterfall([
    callback => mongoose.connect(process.env.CONNECTION_STRING, { useMongoClient: true }, err => callback(err)),
    callback => app.listen(PORT, err => callback(err))
], (err, results) => {
    if (err) {
        return console.log('Database is not connected');
    }
    return console.log(`Server up and running on port ${PORT} and connected to mongo DB`);
});
