const express = require('express');
const viewController = require('./../controller/viewController')
const authController = require('./../controller/authController')

const router = express.Router();



router.get('/',viewController.getHome)
router.get('/tours',authController.isLoggedIn,viewController.getAllTours)
router.get('/tours/:id',authController.isLoggedIn,viewController.getDetail)

router.get('/login',authController.isLoggedIn,viewController.getLoginForm)
router.get('/signup',authController.isLoggedIn,viewController.getSingupForm)
router.get('/otp',authController.isLoggedIn,viewController.getOtpForm)
router.get('/forgotpassword',authController.isLoggedIn,viewController.getForgotForm)
router.get('/resetpassword/:token',authController.isLoggedIn,viewController.getResetForm)

//PROTECTED ROUTE
router.get('/me',authController.protect,viewController.getAccount)
router.get('/review',authController.protect,viewController.getUserReview)
router.get('/booking',authController.protect,viewController.getUserBooking)


module.exports = router;