const express= require('express');
const app=express();
const cors=require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const port=process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient } = require('mongodb');
const { query } = require('express');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.chgli.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      
      await client.connect();
      const database = client.db("e-shop");
      const productCollection = database.collection("products");
      const flashsellCollection=database.collection("flashsell");

      console.log('connect to db');

      //get all products
      app.get('/products',async(req,res)=>{


        const category=req.query.category;
        

        const page=req.query.page;
        const size=parseInt(req.query.size);
        const cursor=productCollection.find({});
        const count=await cursor.count();
     
        let products;

        if(category){

           const query= {category:category};
           const cursor=productCollection.find(query);
           products= await cursor.toArray();
         }
        
        
        else if(page){
          products=await cursor.skip(page*size).limit(size).toArray();
        }
        
        else{
          products=await cursor.toArray();
        }
        
        res.send({
          count,products
        });

      });

      //get selected product
      app.get('/products/:id',async(req,res)=>{
        const id=req.params.id;
        const quary={_id:ObjectId(id)};
        const result=await productCollection.findOne(quary);
        res.send(result);

      });

      //get flshsell product

      app.get('/flashsell',async(req,res)=>{
        const cursor=flashsellCollection.find({});
        const result=await cursor.toArray();
        res.send(result);

      });


      console.log("Connected successfully to server");


    } finally {
     
    //  await client.close();
    }
  }
  run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('Hello e-shop');
});

app.listen(port,()=>{
    console.log(`connect to port ${port}`);
})