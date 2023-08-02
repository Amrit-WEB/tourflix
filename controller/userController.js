const User = require("../models/usersModel")
const multer = require('multer');


//IMAGE UPLOAD
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/users');
    },
    filename: (req, file, cb) => {
        //extension lo current file ka
        const ext = file.mimetype.split('/')[1];
        //filename jisse save hoga
        //console.log(req.body)
        cb(null,`user-${req.body.userId}-${Date.now()}.${ext}`)
        
    }
})

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb('Please Upload Image FileType', false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadUserPhoto = upload.single('photo') //yaha par photo likhe h to api se bhi photo hi milna chahiye variable name me


exports.uploadUserImage = async (req, res, next) => {
    try {

        if (req.file) {
             imageName = req.file.filename;
        }
        // console.log(req.body.userId)

        await User.findByIdAndUpdate(req.body.userId,{image:imageName},{
            new:true,
            runValidators:true
        })
        res.status(200).json({
            status: 'success',
            message: 'uploaded Successfully'
        })

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            meassage: err
        })
    }
}




//DETAILS USER

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json({
            status: 'success',
            data: {
                users
            }
        })
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'routes not created yet'
        })
    }
}
exports.createUser = (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: err
    })

}
exports.getUserId = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'routes not created yet'
    })
}

exports.updateUser = async (req, res) => {
    try {
        //Profile change ka request aayega to profile update karenege
        if (req.body.changeProfile) {
            const newBody = {
                name: req.body.name
            }

            await User.findByIdAndUpdate(req.params.id, newBody, {
                new: true,
                runValidators: true
            })

            return res.status(200).json({
                status: 'success',
                updatesAt: req.requestTime,
                message: 'Profile Updated Succesfully'
            })
        }

        //Password change karne ka request aaya to password change karenge
        if (req.body.changePassword) {
            //req.body se tino chiz nikal liye
            const { currentPassword, newPassword, confirmPassword } = req.body
            //Id se user find kiye
            const user = await User.findById(req.params.id).select('+password')

            //1)check karenge ki current password shi h ya galat
            if (!user || !(await user.correctPassword(currentPassword, user.password))) {

                return res.status(403).json({
                    status: 'fail',
                    message: 'Your Current Password is Wrong'
                })
            }
            //2)check karenge ki confirm aur new same same h ya nhi
            if (newPassword !== confirmPassword) {
                return res.status(403).json({
                    status: 'fail',
                    message: 'Confirm Password Not Match '
                })
            }
            //3)sab chiz thik raha to password ko hash me convert karege fir save karenge db me
            //4)passwordchangetAt property ko bhi update karenge 
            //actually password update me kabhi bhi validation nhi kaam karega and isliye findbyidandupdate nhi use karte isme

            user.password = newPassword;
            user.passwordConfirm = confirmPassword;
            await user.save()

            return res.status(200).json({
                status: 'success',
                updatesAt: req.requestTime,
                message: 'Password Updated Succesfully'
            })
        }


    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}


exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'routes not created yet'
    })
}








