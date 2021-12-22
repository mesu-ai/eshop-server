const express= require('express');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const cors=require('cors');
const app=express();


const port= process.env.PORT || 5000;

// middleware
app.use(cors()); 
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.chgli.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      
      await client.connect();
      const database = client.db("e-shop");
      const productDB = database.collection("product");

    
      console.log("Connected successfully to server");


    } finally {
     
    //  await client.close();
    }
  }
  run().catch(console.dir);


client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

app.get('/',(req,res)=>{
    res.send('Hello e-shop');
});

app.listen(port,()=>{
    console.log(`connect to port ${port}`);
})