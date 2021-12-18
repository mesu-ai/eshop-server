
const express= require('express');
const app=express();

const port= process.env.PORT || 5000;

app.get('/',(req,res)=>{
    res.send('Hello e-shop');
});

app.listen(port,()=>{
    console.log(`connect to port ${port}`);
})