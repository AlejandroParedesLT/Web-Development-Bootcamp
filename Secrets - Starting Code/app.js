//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require('lodash');
const bcrypt = require('bcrypt');
//const encrypt = require("mongoose-encryption");
const md5 = require("md5");
const session = require('express-session')
const passport = require("passport")
//const passport = require("passport-local")
const passportLocalMongoose = require("passport-local-mongoose")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate')
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret:"Our little secret.",
    resave:false,
    saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());
//mongoose.connect("mongodb+srv://alejandroparedeslatorre:pUccAparedes3966@cluster0.ubaom.mongodb.net/UserDB", {useUnifiedTopology: true});
mongoose.connect("mongodb://localhost:27017/UserDB");
//mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
          //required:[true, "Please check your entry no email"]
        },
        password: {
            type: String,
          //required:[true, "Please check your entry no password"]
        },
        googleId:{
            type: String,
        },
        secret: {
            type: String,
        },
    }
);

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
//userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ['password']});


const User = mongoose.model("User", userSchema);
passport.use( User.createStrategy()); 
//passport.use( new LocalStrategy(User.authenticate())); 
//passport.serializeUser(User.serializeUser());
//passport.deserializeUser(User.deserializeUser());

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id); 
   // where is this user.id going? Are we supposed to access this anywhere?
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/secrets",
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

//App functions
app.get("/", function(req, res){
    res.render("home.ejs")
})

app.route('/auth/google')
.get(passport.authenticate('google', {
scope: ['profile']
}));

app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
});

app.get("/login", function(req, res){
    res.render("login.ejs")
})

app.get("/register", function(req, res){
    res.render("register.ejs")
})

/*app.get("/secrets", function(req, res){
    if(req.isAuthenticated()){
        res.render("secrets.ejs")
    }else{
        res.redirect("/login")
    }
    
});*/

app.get("/secrets", function(req, res){
    User.find({"secret":{$ne:null}},function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                res.render("secrets.ejs", {usersWithSecrets:foundUser});
            }
        }
    })
})


app.route("/submit")
    .get(function(req, res){
        if(req.isAuthenticated()){
            res.render("submit.ejs")
        }else{
            res.redirect("/login")
        }
    })
    .post(function(req, res){
        const submittedSecret = req.body.secret;
        User.findById(req.user.id, function(err, foundUser){
            if(err){
                console.log(err);
            }else{
                if(foundUser){
                    foundUser.secret = submittedSecret;
                    foundUser.save(function(){
                        res.redirect("/secrets");
                    })
                }
            }
        })
    })

app.get("/logout", function(req, res){
    req.logout(function(err) {  // do this
        if (err) { return next(err); }// do this
        res.redirect('/');
      });
})

app.post("/register", function(req, res){

    /*bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
            email: req.body.username,
            password: hash//md5(req.body.password)
        })
        newUser.save(function(err){
            if(err){
                console.log(err);
            }else{
                res.render("Secrets");
            }
        })
    });*/
    /*User.register({username: req.body.username}, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            //const authenticate = User.authenticate();
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets.ejs");
            });
        }
    })*/
    User.register({username:req.body.username},req.body.password,function(err,user){
        if(err){ 
          console.log("Error in registering.",err);
          res.redirect("/register");
        }else{
            passport.authenticate("local")(req,res, function(){
                res.redirect("/secrets");
            });
            
        }
    });
})

app.post("/login", function(req, res){
    /*const username = req.body.username;
    const password = req.body.password//md5(req.body.password);
    User.findOne({email:username}, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                //if(foundUser.password===password){
                bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
                    // result == true
                    if(result === true){
                        res.render("secrets");
                    }
                });
                   
                //}    
            }
        }
    })*/
    
    const user = new User({
        username:req.body.username,
        password:req.body.password
    });
    
    console.log(user.username);
    console.log(user.password);

    req.login(user, function(err){
        if(err){
            console.log(err)
        }else{
            passport.authenticate("local")(req,res, function(){
                res.redirect("/secrets"); /// si le pones terminacion no funciona
            });
        }
    });

})

//App rendering
app.listen(4000, function() {
    console.log("Server started on port 4000");
});