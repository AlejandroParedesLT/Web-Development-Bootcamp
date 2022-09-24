//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require('lodash');

const homeStartingContent = "Este es tu blog personal, es un placer conocerte";
const aboutContent = "Somos una empresa de desarrollo de blogs, inscríbete para empezar a usar el tuyo";
const contactContent = "Contactame aqui: hola@gmail.com";

const app = express();
//let posts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://alejandroparedeslatorre:pUccAparedes3966@cluster0.ubaom.mongodb.net/BlogDB", {useUnifiedTopology: true})

const PostSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required:[true, "Please check your entry no name"]
    },
    description: {
      type: String,
      required:[true, "Please check your entry no name"]
    }
  }
);

const Post = mongoose.model("Post", PostSchema);


//--------------------------------------------- Main Page --------------------------------------
app.get("/", function(req, res){
  //console.log(Post.find({}, function(err, posts){return posts.name}));
  Post.find({}, function(err, posts){
    res.render("home.ejs", {
      Message1:homeStartingContent
      , ComposePosts:posts});
  })
});

app.get('/posts/:postId/', (req, res) => {
  //console.log(posts[1].)
  const reqpostId = req.params.postId;
  //console.log(pageName);
  Post.findOne({_id:reqpostId}, function(err,post){
    res.render("post.ejs",{
      titleInPostejs:post.name
      ,TextInPostejs:post.description
    })
  })

  //posts.forEach(function(post){
    //const storedTitle = _.lowerCase(post.posttitle);
    //console.log(storedTitle);
    //if(storedTitle === pageName){
      //console.log("Found")
    //res.render("post.ejs", {
        //Message1:storedTitle
        //, content:post.posttext});
    //}
  //});
})

app.get("/about", function(req, res){
  res.render("about.ejs", {Message2:aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact.ejs", {Message3:contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose.ejs", {Message3:contactContent});
});

app.post("/compose", function(req, res){
  const post = new Post({
    name:req.body.postTitle
    , description:req.body.postText
  });
  post.save(function(err){
    res.redirect("/")
  });
  //posts.push(post);
  res.redirect("/");
});

//<% for(let i = 0; i<= ComposePosts.length; i++){ %>

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
