const Review = require('./../models/reviewModel');

exports.getAllReviews = async (req, res, next) => {
    const reviews = await Review.find();

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    })
}

exports.createReview = async (req, res, next) => {
    console.log(req.params)
    //Allow nested routes
    if (!req.body.tour) {
        // req.body.tour = req.params.tourId;
        return res.status(403).json({
            status:'fail',
            message:'Review must have a tour'
        })
    }
    if (!req.body.user) {
        //req.body.tour = req.user.id;
        return res.status(403).json({
            status:'fail',
            message:'Review must have a user'
        })
    }
    
    const newReview = await Review.create(req.body);
    res.status(200).json({
        status: 'success',
        data: {
            review: newReview
        }
    })
}

exports.deleteReview = async (req, res, next) => {
    
    await Review.findByIdAndRemove(req.params.id)

    res.status(202).json({
        message:null
    })
}