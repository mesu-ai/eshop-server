const express= require('express');
const app=express();
const cors=require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const fileUpload=require('express-fileupload');

const port=process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());


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
      const orderCollection=database.collection("orders");

      console.log('connect to db');

      //get all products
      app.get('/products',async(req,res)=>{


        const category=req.query.category;
        const name=req.query.name;
        

        const page=req.query.page;
        const size=parseInt(req.query.size);
        const cursor=productCollection.find({});
        let count;
     
        let products;

        if(name){
          const query={name:name};
          const cursor=productCollection.find(query);
          products=await cursor.toArray();
          res.send(products);

        }

        else if(category){

           const query= {category:category};
           const cursor=productCollection.find(query);
           products= await cursor.toArray();
           res.send(products);
         }
        
        
        else if(page){
          count=await cursor.count();
          products=await cursor.skip(page*size).limit(size).toArray();
          res.send({count,products});
        }
        
        else{
          products=await cursor.toArray();
          res.send(products);
        }
        
        // res.send({
        //   count,products
        // });

      });

      //get selected product
      app.get('/products/:id',async(req,res)=>{
        const id=req.params.id;
        const quary={_id:ObjectId(id)};
        const result=await productCollection.findOne(quary);
        res.send(result);

      });

      app.post('/products',async(req,res)=>{
        const cursor=req.body;
        const result=await productCollection.insertOne(cursor);
        res.json(result);

      });

      // app.post('/products',async(req,res)=>{
      //   const name=req.body.name;
      //   const seller=req.body.seller;
      //   const price=req.body.price;
      //   const shipping=req.body.shipping;
      //   const category=req.body.category;
      //   const stock=req.body.stock;
      //   const star=req.body.star;
      //   const starCount=req.body.starCount;
      //   const features=req.body.features;
       
      //   // console.log('body',req.body);
      //   // console.log('files',req.files);
      //   const pic=req.files.image;
      //   const picData=pic.data;
      //   const encodedPic= picData.toString('base64');
      //   const imageBuffer=Buffer.from(encodedPic,'base64');
      //   const productInfo={
      //     name,seller,price,shipping,category,stock,star,starCount,features,image:imageBuffer
      //   }

      //   const result=await productCollection.insertOne(productInfo);
      //   console.log(productInfo);

      //   res.json({success:true});

      // });

      //get flshsell product

      app.get('/flashsell',async(req,res)=>{
        const cursor=flashsellCollection.find({});
        const result=await cursor.toArray();
        res.send(result);

      });

      //get selected product

      app.get('/flashsell/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)};
        const result=await flashsellCollection.findOne(query);
        res.send(result);

      });

      app.get('/orders',async(req,res)=>{
        const email=req.query.email;
        let cursor;

        if(email){
          const query={email:email};
          cursor=orderCollection.find(query);

        }else{
          cursor=orderCollection.find({});
        }
        
        
        const result= await cursor.toArray();
        res.send(result);

      });


      app.post('/orders',async(req,res)=>{
        const orderPlace=req.body;
        const result=await orderCollection.insertOne(orderPlace);
        res.json(result);

      });

      // app.get('/orders/:id',async(req,res)=>{



      // })

      app.delete('/orders/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)};
        const result=await orderCollection.deleteOne(query);
        res.send(result);
      })


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