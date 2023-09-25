const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({
    path:'./config.env'
})


const app = require('./app'); 

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD) //REMOTE DB CONNECTION
//const DB = process.env.DATABASE_LOCAL

mongoose.connect(DB,{
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then((conn)=>{
    //  console.log(conn.connections);
    console.log('DB Connection Successful')
})

//Server

const port = process.env.PORT;
app.listen(port,(req,res)=>{
    console.log('Server Running On Port ' + port)
})
