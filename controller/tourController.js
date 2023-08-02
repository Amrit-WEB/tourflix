const Tour = require('./../models/toursModel');

exports.getAllTours = async (req, res) => {

    try {
        //Build Query
        //1)Filtering
        //console.log(req.query)
        //in js obj is store in another variable by destructuring
        const queryObj = {...req.query}
        const excludeFields = ['sort','limit','page','fields']
        excludeFields.forEach(el=>delete queryObj[el])
        console.log(queryObj)

        //2)Advance Filtering
        let queryStr = JSON.stringify(queryObj)
        queryStr = JSON.parse(queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`));
        console.log(queryStr)

        //Execute Query
        let query = Tour.find(queryStr);
        
        //2)Sorting
        if(req.query.sort){
            query = query.sort(req.query.sort)
        }


        const tours = await query;

        //Response Send
        res.status(200).json({
            status: 'success',
            requestAt: req.requestTime,
            results: tours.length,
            data: {
                tours
            }
        })
    }
    catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }

}

exports.getTour = async (req, res) => {

    try {
        const tours = await Tour.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            requestAt: req.requestTime,
            results: tours.length,
            data: {
                tours
            }
        })
    }
    catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Not found'
        })
    }
}

exports.createTour = async (req, res) => {
    try {

        if(req.body.leftSheet > req.body.maxGroupSize){
            return res.status(404).json({
                status:'fail',
                message:'leftSheet Should be grater than maxGroupSize'
            })
        }
        const newTour = await Tour.create(req.body)

        res.status(201).json({
            status: "success",
            data : {
                newTour
            }
        })

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }

}

exports.updateTour = async (req, res) => {
    try{

        console.log(req.body)
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body ,{
            new:true,
            runValidators:true
        })

        res.status(200).json({
            status: 'success',
            updatesAt: req.requestTime,
            data:{
                tour
            }
        })

    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
    
}

exports.deleteTour = async (req, res) => {

    try{
        await Tour.findByIdAndRemove(req.params.id)

        res.status(204).json({
            status: 'success',
            data :null
        })

    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }

    
}
