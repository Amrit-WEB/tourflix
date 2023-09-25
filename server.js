const mongoose = require('mongoose')
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv')

dotenv.config({
    path:'./config.env'
})


const app = require('./app'); 

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD) //REMOTE DB CONNECTION
//const DB = process.env.DATABASE_LOCAL

// mongoose.connect(DB,{
//     useUnifiedTopology:true,
//     useNewUrlParser:true,
//     useCreateIndex:true,
//     useFindAndModify:false
// }).then((conn)=>{
//     //  console.log(conn.connections);
//     console.log('DB Connection Successful')
// })






// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(DB, {
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
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

//Server

const port = process.env.PORT;
app.listen(port,(req,res)=>{
    console.log('Server Running On Port ' + port)
})
