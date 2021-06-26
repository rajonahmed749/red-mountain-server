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
  res.send("This is Red Mountain Kids Server")
  console.log("database connected")
})


client.connect(err => {
  const serviceCollection = client.db("redMountain").collection("services");
  const orderCollection = client.db("redMountain").collection("orders");

  console.log(err);
    // All services
    app.get('/allServices', (req, res) => {
      serviceCollection.find({})
        .toArray((err, documents) => {
          res.send(documents)
        })
    })

    // add one service
    app.post('/addService', (req, res) => {
      const newService = req.body;
      serviceCollection.insertOne(newService)
        .then(result => {
          res.send(result.insertedCount > 0)
        })
    });

    // checkout services
    app.get("/service/:id", (req, res) => {
      serviceCollection.find({ _id: ObjectId(req.params.id) })
        .toArray((err, documents) => {
          res.send(documents[0]);
        })
    })

    // place an Order
    app.post('/addOrder', (req, res) => {
      const newService = req.body;
      orderCollection.insertOne(newService)
        .then(result => {
          res.send(result.insertedCount > 0)
        })
    });

    // get user specific order
    app.get('/getOrders/:id', (req, res) => {
      const email = req.params.id;
      orderCollection.find({ user: email })
        .toArray((err, orders) => {
          res.send(orders);
        })
    })

    // all orders 
    // app.get("/allOrders",(req, res) =>{
    //   orderCollection.find({})
    //   .toArray((err, allOrders) => {
    //     res.send(allOrders);
    //   })
    // })

    // delete order 
    app.delete("/delete/:id", (req, res)=>{
      const id = req.params.id
      orderCollection.deleteOne({_id: ObjectId(id)})
      .then(result => {
        res.send(result.deletedCount> 0)
      })
    })



});



app.listen(process.env.PORT || port)