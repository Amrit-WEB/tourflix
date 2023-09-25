const path = require('path')
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')


const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const viewRouter = require('./routes/viewRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const bookingRouter = require('./routes/bookingRoutes')

const app = express();

app.set('view engine', 'pug');
app.set('views',path.join(__dirname,'src/views'))

//1) Global Middleware
//serving static files
app.use(express.static(path.join(__dirname,'public')))

//Set security HTTP headers
// app.use(helmet())

//Developement Logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(express.json());

app.use(cookieParser())

app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    //console.log(req.headers)
    //console.log(req.cookies)
    next();
});

//3) Routes
//Page Render Routes
app.use(`/`,viewRouter)
//APIs Routes
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/review',reviewRouter);
app.use('/api/v1/booking',bookingRouter);


module.exports = app;


