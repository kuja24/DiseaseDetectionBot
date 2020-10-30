require('dotenv').config()
const express = require('express')
const passport = require('passport')
const cookieSession = require('cookie-session')

require('./passport-setup')
const app = express();
app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
  }))

app.set('view engine','ejs')

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine","ejs")
app.use(express.static(__dirname + '/public'));

app.get('/',(req,res)=>{
    res.render("pages/index")
})
app.get('/failed', (req, res) => res.send('You Failed to log in!'))
// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get('/good', isLoggedIn, (req, res) =>{
    res.render("pages/profile",{name:req.user.displayName,pic:req.user.photos[0].value,email:req.user.emails[0].value})
})
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  }
);

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})

app.listen(5000,()=>{
    console.log("server started on https://localhost/5000")
})