const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review Can not be empty']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a author']
    }
}, {
    toJSON: { virtual: true },
    toObject: { virtual: true }
})

reviewSchema.pre(/^find/, function (next) {
    //1st method
    // this.populate({
    //     path:'tour user',
    //     select:'name name image'
    // })
    this.populate({
        path: 'tour',
        select: 'name images'
    }).populate({
        path: 'user',
        select: 'name image'
    })
    next()
})


const Review = mongoose.model('Review', reviewSchema)
module.exports = Review