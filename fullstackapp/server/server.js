require('dotenv').config()

const express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    Auth0Strategy = require('passport-auth0'),
    massive = require('massive'),
    session = require('express-session');

const app = express()

//MIDDLEWARE

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());


//DB CONNECTION
massive(process.env.CONNECTIONSTRING).then(db => {
    app.set('db', db)
})


//AUTHENTICATION
passport.use(new Auth0Strategy({
    domain: process.env.AUTH_DOMAIN,
    clientID: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    callbackURL: process.env.AUTH_CALLBACK
}, function (accessToken, refreshToken, extraParams, profile, done) {
    const db = app.get('db');

    db.find_user(profile.id).then(user => {
        if (user[0]) {
            return done(null, user);
        } else {
            db.create_user([profile.displayName, profile.emails[0].value, profile.picture, profile.id])
                .then(user => {
                    return done(null, user[0]);
                })
        }
    })
}))
//INVOKED ONCE TO SET UP
passport.serializeUser(function (user, done) {
    console.log("SERIALIZING")
    console.log(user);
    done(null, user);
})
//USER COMES FROM SESSION - INVOKED ON EVERY ENDPOINT.
passport.deserializeUser(function(user, done) {
    console.log('please work')
    app.get('db').find_session_user(user[0].id).then( user => {
        return done(null, user[0]);
    })
})

app.get('/auth', passport.authenticate('auth0'));
app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: 'http://localhost:3000/#/private/',
    failureRedirect: 'http://localhost:3000/#/'
}))
app.get('/auth/me', (req, res) => {
    console.log(req.user);
    if (!req.user) {
        return res.status(404).send('User not found')
    } else {
        return res.status(200).send(req.user);
    }
})
app.get('/auth/logout', (req, res) => {
    req.logOut();
    return res.redirect(302, 'http://localhost:3000/#/');
})

let port = 3005;

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})