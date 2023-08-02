const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,'Booking must belong to a tour']
    },
    user:{
        type : mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'Booking must belonging to a user']
    },
    participants:{
        type:Number,
        required:[true,'Booking must have a number of people']
    },
    priceAtBooking:{
        type:Number,
        required:[true,'Booking must have a price at the time of booking']
    },
    priceTotal:{
        type:Number,
        required:[true,'Booking must have a price']
    },
    createdAt:{
        type:Date,
        default : Date.now()
    },
    paymentId :{
        type:String
    }
})

bookingSchema.pre(/^find/,function(next){
    this.populate('user').populate({
        path:'tour',
        field:'name'
    })
    next();
})

const Booking = mongoose.model('Booking',bookingSchema);

module.exports = Booking;