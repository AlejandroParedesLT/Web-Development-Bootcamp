const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}))

app.get("/", function(request, res){
    res.sendFile(__dirname+"/index.html");
});

app.post("/", function(req, res){
    var num1 = Number(req.body.num1);
    var num2 = Number(req.body.num2);
    //console.log(req.body.num1);
    var result = num1 + num2;
    res.send("The result is: "+result);
});

app.get("/bmicalculator", function(req, res){
    res.sendFile(__dirname+"/bmiCalculator.html");
});


app.post("/bmicalculator", function(req, res){
    var weight = parseFloat(req.body.weight);
    var height = parseFloat(req.body.height);
    var bmi = weight / (height * height);
    console.log(weight);
    console.log(height);
    console.log(bmi);
    res.send("The result is: "+bmi);
});

app.listen(3000, function(){
    console.log("Server has started in port 3000");
});
