const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
// const cookieParser = require('cookie-parser')
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// 


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.necrkau.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
    const TaskCollection = client.db('JobTask').collection('Task');
    const NotificationCollection = client.db('JobTask').collection('Notification');
    
    app.get('/Task', async (req, res) => {
      
      const filter = req.query
      let query = {
        // FoodName : {$regex: filter.search, $options:'i'}
      };
      
      if (req.query?.email) {
        query = {

          email: req.query.email
        }
      }
      const cursor = TaskCollection.find(query)
      const result = await cursor.toArray();
      res.send(result)
    });
    app.post('/Task',async (req, res)=>{
      const Task = req.body;
      
      
      const result = await TaskCollection.insertOne(Task)
      res.send(result);
    });
    app.get('/Notification', async (req, res) => {
      
      const filter = req.query
      let query = {
        // FoodName : {$regex: filter.search, $options:'i'}
      };
      
      if (req.query?.email) {
        query = {

          email: req.query.email
        }
      }
      const cursor = NotificationCollection.find(query)
      const result = await cursor.toArray();
      res.send(result)
    });
    app.post('/Notification',async (req, res)=>{
      const Notification = req.body;
      
      
      const result = await NotificationCollection.insertOne(Notification)
      res.send(result);
    });


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
