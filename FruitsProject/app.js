//const { MongoClient } = require("mongodb");
//---- Replace the uri string with your MongoDB deployment's connection string.
//const uri = "mongodb://localhost:27017";
//---- "mongodb+srv://<user>:<password>@<cluster-url>?retryWrites=true&w=majority";
//const client = new MongoClient(uri, {useUnifiedTopology: true});

//const dbName = "fruitsDB";
 
//async function run() {
  //try {
    //await client.connect(function(){
      //console.log("Connected successfully to server!");
    //});
  //const database = client.db(dbName);
  
  //const collection = database.collection('fruits'); 
 
  //const docs = [
  //{
    //name: 'Apple',
    //score: 8,
    //review: "Great fruit"
  //},
  //{
    //name: "Orange",
    //score: 6,
    //review: "Kinda sour"
  //},
  //{
    //name: "Bananna",
    //score: 9,
    //review: "Great stuff!"
  //}
  //];
 
  //const options = { ordered: true };
 
  //const result = await collection.insertMany(docs, options);
 
  //console.log(`${result.insertedCount} documents were inserted.`);

  //} finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  //}
//}
//run().catch(console.dir);

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/fruits2DB", {useUnifiedTopology: true})

const fruitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required:[true, "Please check your entry no name"]
    },
    rating: {
      type: Number,
      min: [1, 'Few number'],
      max: 10
    },
    review: String
  }
);

const Fruit = mongoose.model("Fruit", fruitSchema)
const fruit = new Fruit({
  name:"Apple",
  rating: 7,
  review: "Solid"
})

//fruit.save();

/*const Banana = new Fruit({
  name:"Banana",
  rating: 7,
  review: "Solid"
})
const WaterMelon = new Fruit({
  name:"WaterMelon",
  rating: 7,
  review: "Solid"
})
const Pear = new Fruit({
  name:"Pear",
  rating: 7,
  review: "Boring"
})*/

//Fruit.insertMany([Banana, WaterMelon, Pear], function(err){
  //if(err){
//    console.log(err);
//  }else{
    //console.log("Succesfully saved all the fruits to fruitsDB")
  //}
//});

const PeopleSchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
    job: String,
    favoriteFruit: fruitSchema
  }
);

const People = mongoose.model("People", PeopleSchema)


// Add a watermelon to the person
const WaterMelon = new Fruit({
  name:"WaterMelon",
  rating: 7,
  review: "Solid"
})
WaterMelon.save();

const person = new People({
  name:"Broster",
  age: 22,
  job: "Developer",
  favoriteFruit: WaterMelon
})

Fruit.find(function(err, fruits){
  if(err){
    console.log(err);
  }else{
    for(const fruit1 in fruits){
      console.log(fruits[fruit1].name);
    }
    mongoose.connection.close();
  }
})
person.save();

/*Fruit.updateOne({_id: "631534bcb6e8c4b506f543f2"}, {name:"Peach"}, function(err){
  if(err){
    console.log(err);
  }else{
    console.log("Succesfully updated the document")
  }
});*/

/*Fruit.deleteOne({name: "Peach"}, function(err){
  if(err){
    console.log(err);
  }else{
    console.log("Succesfully deleted regirested")
  }
})*/
/*People.deleteMany({job: "Developer"}, function(err){
  if(err){
    console.log(err);
  }else{
    console.log("Succesfully deleted regirested")
  }
})*/
