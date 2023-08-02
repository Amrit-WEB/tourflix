const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Tour = require('./../models/toursModel');
const Review = require('./../models/reviewModel');
const Booking = require('./../models/bookingModel');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb')

exports.getHome = async (req, res) => {
   
    const topReview = await Review.find().sort({rating:-1}).limit(3)

    res.status(200).render('home', {
        title: 'A Tour Booking Portal',
        topReview
    })
    
}

exports.getAllTours = async (req, res, next) => {
    try {
        const tours = await Tour.find();
        res.status(200).render('tours', {
            title: 'Exciting Tours',
            tours
        })
    } catch (err) {
        // res.status(404).render('error',{
        //     title:'Not Found'
        // })
        console.log(err)
    }

}

exports.getDetail = async (req, res) => {
    try {
        
        const tourDetail = await Tour.findById(req.params.id).populate({
            path:'guides',
            field:'name role image'
        });
    

        const reviewDetail = await Review.find({tour:ObjectId(req.params.id)})
        
        res.status(200).render('detail', {
            title: tourDetail.name,
            tourDetail,
            reviewDetail
        })
    } catch (err) {
        res.status(404).render('error', {
            err
        })
    }
}


exports.getLoginForm = async (req, res) => {

    res.status(200).render('login',{
        title:'Log into your account'
    })

}

exports.getSingupForm = async (req,res)=>{
    res.status(200).render('signup',{
        title:'Create an account'
    })
}
exports.getOtpForm = async (req,res)=>{
    res.status(200).render('otp',{
        title:'Verify Your OTP'
    })
}



//ACCOUNT
exports.getAccount = async(req,res)=>{
    
    res.status(200).render('me',{
        title: 'Your Account'
    })
}

exports.getUserReview = async (req, res, next) => {
    try {
        
        //get all tour id for review add
        const tourId = await Tour.find().select('_id name')

        //ye tarika bhi h userID ka but ye route already protect se hokar aa raha h to waha se req.user se user id mil ayega
        // //getting userId from cookie jwt
        // const cookieDecodeId = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_TOKEN)
        // const userId = cookieDecodeId.id 
        // // console.log(userId)
        // //yaha objectid ko import karna hoga mongodb se
        // const userReview = await Review.find({user:ObjectId(userId)});

        const userReview = await Review.find({user:req.user._id})
        const bookedTour = await Booking.find({user:req.user._id})

        //send response
        res.status(200).render('review', {
            title: 'Your Review',
            tourId,
            userReview,
            bookedTour
        })
        
    } catch (err) {
        console.log(err)
    }

}

exports.getUserBooking = async(req,res,next)=>{
    try {
        const userBooking  = await Booking.find({user:req.user._id})
        
        res.status(200).render('booking', {
            title: 'Your Booking',
            userBooking,
        })
    } catch (err) {
        res.status(404).render('error', {
            err
        })
    }
}

exports.getForgotForm = async(req,res,next)=>{
    try{
        res.status(200).render('forgot', {
            title: 'Forgot Password'
        })
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message : 'Something went wrong!'
        })
    }
}

exports.getResetForm = async(req,res,next)=>{
    try{
        res.status(200).render('reset', {
            title: 'Update Paswword'
        })
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message : 'Something went wrong!'
        })
    }
}
