//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require('lodash');
const { get } = require("lodash");

const homeStartingContent = "Este es tu blog personal, es un placer conocerte";
const aboutContent = "Somos una empresa de desarrollo de blogs, inscríbete para empezar a usar el tuyo";
const contactContent = "Contactame aqui: hola@gmail.com";

const app = express();
//let posts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://alejandroparedeslatorre:pUccAparedes3966@cluster0.ubaom.mongodb.net/wikiDB", {useUnifiedTopology: true})

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required:[true, "Please check your entry no name"]
    },
    content: {
      type: String,
      required:[true, "Please check your entry no name"]
    }
  }
);

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

.get(function(req, res){
    Article.find({}, function(err, foundArticles){
        if(!err){
            res.send(foundArticles);
        }else{
            res.send(err);
        }
    });
})

.post(function(req, res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save(function(err){
        if(!err){
            res.send("Succefully added new article");
        }else{
            res.send(err);
        }
    });
})

.delete(function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Succefully deleted all articles");
        }else{
            res.send(err);
        }
    })
});

//--------------- A specific

app.route("/articles/:articleTitle")
//JsHint: 6.0
.get(function(req, res){
    Article.findOne({title:req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No articles matching that title was found");
        }
    })
})

.put(function(req, res){
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite:true},
        function(err){
            if(!err){
                res.send("Successfully updated article");
            }else{
                res.send(err);
            }
        }
    );
})

.patch(function(req, res){
    Article.update(
        {title:req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully updated article");
            }else{
                res.send(err);
            }
            
        }
    );
})

.delete(function(req, res){
    Article.deleteOne({title:req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Successfully deleted article");
            }else{
                res.send(err);
            }
        }
    )
})
/*app.get("/articles", function(req, res){
    Article.find({}, function(err, foundArticles){
        if(!err){
            res.send(foundArticles);
        }else{
            res.send(err);
        }
    });
});*/

/*app.post("/articles", function(req, res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save(function(err){
        if(!err){
            res.send("Succefully added new article");
        }else{
            res.send(err);
        }
    });
})*/

/*app.delete("/articles", function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Succefully deleted all articles");
        }else{
            res.send(err);
        }
    })
})*/

app.listen(3000, function() {
    console.log("Server started on port 3000");
});