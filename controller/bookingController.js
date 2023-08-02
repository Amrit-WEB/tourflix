const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Tour = require('./../models/toursModel')
const Booking = require('./../models/bookingModel')

exports.getCheckoutSession = async (req, res, next) => {
    //1)Get currently booked tour
    const tour = await Tour.findById(req.params.tourId)

    //get no.of people from req query
    const queryObj = { ...req.query }

    //2)Create Checkout Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/tours`,
        cancel_url: `${req.protocol}://${req.get('host')}/tours/${tour._id}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [{
            price_data: {
                currency: 'inr',
                unit_amount: tour.price * queryObj.people * 100,
                product_data: {
                    name: `${tour.name} Tour`,
                    description: tour.summary,
                    images: ['https://img.freepik.com/free-photo/full-shot-travel-concept-with-landmarks_23-2149153258.jpg']
                }
            },
            quantity: 1
        }],
        mode: 'payment'

    })


    //create temp payment statement in db
    await Booking.create({
        tour: req.params.tourId,
        user: req.user._id,
        participants: queryObj.people,
        priceAtBooking: tour.price,
        priceTotal : queryObj.people * tour.price,
        paymentId: session.id
    })
    // await Booking.create({
    //     tour: req.params.tourId,
    //     user: req.user._id,
    //     participants: queryObj.people,
    //     priceAtBooking: tour.price,
    //     priceTotal : queryObj.people * tour.price
    //     //paymentId: session.id
    // })

    //reduce number of sheet for that tour (sold out ticket)
    tour.leftSheet = tour.leftSheet - queryObj.people ;
    await tour.save()


    //3)Send Response to the user    
    res.status(200).json({
        status: 'success',
        message: 'Payment Session Created',
        session: session
    })
}