const express = require('express');
const tourController = require('./../controller/tourController');
const authController = require('./../controller/authController');
const reviewRouter = require('./../routes/reviewRoutes')

const router = express.Router();

router.use('/:tourId/reviews',reviewRouter)

router.route('/').get(authController.protect, tourController.getAllTours).post(tourController.createTour);
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);


module.exports = router;
