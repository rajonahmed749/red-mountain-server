const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const port = process.env.PORT || 4000;

const app = express();
app.use(bodyParser.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bqa8e.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.send("This is first server after a long time")
  console.log("database connected")
})



client.connect(err => {
  const serviceCollection = client.db("redMountain").collection("services");

  // get all services
  app.get('/allServices', (req, res) => {
    serviceCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })

  // add service one by one
  app.post('/addService', (req, res) => {
    const newService = req.body;    
    serviceCollection.insertOne(newService)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  });

  


});



app.listen(process.env.PORT || port)