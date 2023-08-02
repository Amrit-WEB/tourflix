const express = require('express')
const reviewController = require('./../controller/reviewController')
const authController = require('./../controller/authController')

//mergeParams ko true karne se is route me previous route ka params ko access kar sakte h ....nested routing ise hi karna chahiye
//POST /tour/:tourId/reviews OR POST /reviews ye dono routes ke liye yahi niche wala route kaam karega 
const router = express.Router({mergeParams:true});

//router.get('/',reviewController.getAllReviews).post('/',authController.protect,authController.restrictTo('user'),reviewController.createReview)
router.route('/').get(reviewController.getAllReviews).post(reviewController.createReview)
router.route('/:id').delete(reviewController.deleteReview)



module.exports = router
