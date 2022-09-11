//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require('lodash');
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//mongoose.connect("mongodb+srv://alejandroparedeslatorre:pUccAparedes3966@cluster0.ubaom.mongodb.net/UserDB", {useUnifiedTopology: true});
mongoose.connect("mongodb://localhost:27017/UserDB")

const userSchema = new mongoose.Schema(
    {
        email: {
          type: String,
          required:[true, "Please check your entry no email"]
        },
        password: {
          type: String,
          required:[true, "Please check your entry no password"]
        }
    }
);

userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ['password']});


const User = mongoose.model("User", userSchema);
//App functions
app.get("/", function(req, res){
    res.render("home.ejs")
})

app.get("/login", function(req, res){
    res.render("login.ejs")
})

app.get("/register", function(req, res){
    res.render("register.ejs")
})

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("Secrets");
        }
    })
})

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username}, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password===password){
                    res.render("secrets");
                }    
            }
        }
    })
})

//App rendering
app.listen(4000, function() {
    console.log("Server started on port 4000");
});