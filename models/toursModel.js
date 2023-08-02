const mongoose = require('mongoose')
// const User = require('./usersModel')

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A Tour must have a name'],
        unique: true,
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'A Tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A Tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A Tour must have a difficulty'],
        enum:{
            values : ['easy','medium','difficult'],
            message : 'Difficulty is either : easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min:[1,'Rating must be above 1.0'],
        max:[5,'Rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A Tour must have a price']
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'A Tour must have a summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A Tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    currentDate:{type:Date},
    startDates:[Date],
    startLocation : {
        //GeoJSON for geo spartial data
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String
    },
    locations:[{
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String,
        day:Number
    }],
    guides:[
        {type: mongoose.Schema.ObjectId,
        ref:'User'
        }
    ],
    leftSheet:{type:Number}
},
{
    toJSON : {virtual:true},
    toObject : { virtual :true}
})

// tourSchema.pre('save',async function(next){
//     const guidesPromises = this.guides.map(async id => await User.findById(id))
//     this.guides = await Promise.all(guidesPromises);
//     next();
// })


//ye tour me jitne guide ka tour id hoga uska sab data lakar gettours me dega
tourSchema.pre(/^find/,function(next){
    this.populate({
        path:'guides',
        select:'-__v -passwordChangedAt'
    })
    next()
})



const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour



//save data in DB
        // const testTour = new Tour({
        //     name: 'The Park Camper',
        //     rating:4.7,
        //     price:497
        // })
        // testTour.save().then( doc => {
        //     console.log('Saved to DB' + doc)
        // }
        // ).catch(err=>{
        //     console.log(err)
        // })