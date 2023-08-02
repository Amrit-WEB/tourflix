const express = require('express');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');

const router = express.Router();

router.post('/signup',authController.singUp)
router.patch('/signup/:otp',authController.otpVerification)
router.post('/login',authController.login)
router.get('/logout',authController.logout)

router.post('/forgotpassword',authController.forgotPassword)
router.patch('/resetpassword/:token',authController.resetPassword)

router.patch('/uploaduserimage',userController.uploadUserPhoto,userController.uploadUserImage)

router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getUserId).patch(userController.updateUser).delete(userController.deleteUser);


module.exports =  router;
