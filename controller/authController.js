// const randomstring = require('randomstring')
const crypto = require('crypto')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require('./../models/usersModel')
const sendEmail = require('./../utils/email')
const { decode } = require('punycode')

const signToken = (id) => {
    return jwt.sign({
        id: id
    }, process.env.JWT_TOKEN, {
        expiresIn: process.env.JWT_EXPIRES
    })
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    res.cookie('jwt', token, cookieOptions)

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

const otpGenerate = () => {
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
}



exports.singUp = async (req, res) => {
    try {
        //otp pahle db me save kar lo and after verification opt ko undefined kar do db se
        const otp = otpGenerate()
        req.body.otp = otp

        const newUser = await User.create(req.body)


        //OTP Send kar do user ke email par
        try {
            await sendEmail({
                email: newUser.email,
                subject: `OTP for Tourflix is ${otp}`,
                message: otp
            })

            res.status(200).json({
                status: 'success',
                message: 'OTP Sent to email',
                user: newUser._id
            })
        }
        catch (err) {

            res.status(404).json({
                satus: 'fail',
                message: 'Could not sent the mail ...try after sometime',
                err
            })
        }

        // const newUser = await User.create({
        //     name: req.body.name,
        //     email: req.body.email,
        //     password: req.body.password,
        //     passwordConfirm: req.body.passwordConfirm

        // })

        // const token = signToken(newUser._id)

        // res.status(201).json({
        //     status: 'success',
        //     message:'abhi ye tempuser hai...jab itp verify ho jayega tab permananet save hoga',
        //     // token: token,
        //     data: {
        //         newUser
        //     }
        // })

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err._message
        })
    }

}

exports.otpVerification = async (req, res) => {
    try {
        //finding that user with otp
        //const tempUser = await User.findOne({otp:req.params.otp})

        const tempUser = await User.findById(req.params.otp)

        if (!tempUser.otp) {
            return res.status(404).json({
                status: 'fail',
                message: `user is already verified`
            })
        }

        if (tempUser.otp == req.body.otp) {
            //save that temporary account into permanenent and remove the otp property from user

            tempUser.otp = undefined

            const validNewUser = await tempUser.save({ validateBeforeSave: false })


            //after verfication a valid user is created so next process is to make a token for login
            // const token = signToken(newUser._id)

            // return res.status(201).json({
            //     status: 'success',
            //     token: token,
            //     data: {
            //         validNewUser
            //     }
            // })
            const onlyData = {
                name: validNewUser.name,
                _id: validNewUser._id,
                email: validNewUser.email
            }
            createSendToken(onlyData, 201, res)

        } else {
            // 'otp match nhi kiya isliye hm delete kar rahe htempuser ko'

            await User.findByIdAndRemove(tempUser._id)

            return res.status(202).json({
                message: null
            })

        }

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'User does not exist'
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(403).json({
                status: 'fail',
                message: 'Please Provide Email Or Password Both'
            })
        }

        const user = await User.findOne({ email }).select('+password')


        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(403).json({
                status: 'fail',
                message: 'Unauthorized User OR Password Incorrect'
            })

        } else {

            //check user agar bypass kardiya(account create karke otp nhi verigy karwaya ) aur login karne aayagea to tempAccount to create rehne se login ho jayega isliye usko reverify karwana parega otp
            if (user.otp) {
                await User.findByIdAndRemove(user._id)
                return res.status(403).json({
                    status: 'fail',
                    message: 'User Not Verified Yet , Please Verify That OTP'
                })
            }

            const onlyData = {
                name: user.name,
                _id: user._id,
                email: user.email
            }
            createSendToken(onlyData, 200, res)
        }

    } catch (err) {
        console.log(err)
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.logout = (req, res) => {
    console.log(req)
    res.cookie('jwt', 'Logged Out', {
        expires: new Date(Date.now() + 1 * 1000),
        httpOnly: true
    })
    res.status(200).json({
        status: 'success'
    })
}


exports.protect = async (req, res, next) => {
    try {
        // console.log(req.headers.authorization)
        // console.log(req.cookies)

        let token;
        //1) Getting Token and check of it's exists
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt
        }

        if (!token) {
            return res.status(401).render('error', {
                status: 'fail',
                title: 'Unauthorized Access',
                message: 'You are not logged in! Please log in to get access'
            })

            // return res.status(401).json({
            //     status: 'fail',
            //     message: 'You are not logged in! Please log in to get access'
            // })
        }
        //2) Verification of token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_TOKEN)
        //console.log(decoded)
        //agar jwt malformed hoga to decoded me resulte nhi aayega aur ye msg dikhayega
        // if(!decoded){
        //     return res.status(401).render('error',{
        //         status:'fail',
        //         message:'Token Unauthorized',
        //         title:'Unauthorized Access'
        //     })
        // }


        //3) Check if user still exists
        const currentUser = await User.findById(decoded.id)
        if (!currentUser) {
            // return res.status(401).json({
            //     status: 'fail',
            //     message: 'The User belonging to this token does no longer exist'
            // })
            return res.status(401).render('error', {
                status: 'fail',
                title: 'Unauthorized Access',
                message: 'The user belonging to this token does no longer exist'
            })
        }

        //4) Check if user change password after the jwt was issued

        if (!currentUser.changePasswordAfter(decoded.iat)) {
            // return res.status(401).json({
            //     status: 'fail',
            //     message: 'User Recently Changed the Password ! Please log in again'
            // })
            return res.status(401).render('error', {
                status: 'fail',
                title: 'Unauthorized Access',
                message: 'User Recently Changed the Password ! Please LogIn again'
            })
        }

        //5) If everything is ok then next() ie GRANT ACCESS FOR PROTECTED ROUTE
        req.user = currentUser;
        res.locals.user = currentUser;
        next();
    }
    catch (err) {
        console.log(err)
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

// exports.restrictTo = (...roles) =>{
//     return (req,res,next)=>{
//         if(!roles.includes(req.user.role){
//             return res.status(403).json({
//                 status:'fail',
//                 message : 'you do not have permission to perform this action'
//             })
//         })

//         next(); 
//     }
// }

exports.forgotPassword = async (req, res) => {
    try {

        //console.log(req.body)
        //1.)Get user based on POSTed email
        const user = await User.findOne({
            email: req.body.email
        })

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User does not exits'
            })
        }
        //2.)Generate the random token

        //My Approach <<

        //const resetToken = randomstring.generate(32)
        // const resetToken = crypto.randomBytes(32).toString('hex')
        // console.log(resetToken)
        // const tokenExpires = Date.now() + 10 * 60 * 1000;
        // const encryptToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // const updatedUser = await User.findByIdAndUpdate(user._id, {
        //     passwordResetToken: encryptToken,
        //     passwordResetExpires: tokenExpires
        // }, {
        //     new: true,
        //     runValidators: false
        // })

        //>>


        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false })


        //3.)Send it to user's email
        const resetURL = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`
        const message = `Forgot Password By Clicking the below link. ${resetURL}`


        try {
            console.log(message)
            
            await sendEmail({
                email: user.email,
                subject: message,
                message: message
            })

            return res.status(200).json({
                status: 'success',
                message: 'Token Sent to email'
            })
        }
        catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false })

            return res.status(404).json({
                satus: 'fail',
                message: 'Could not sent the mail ...try after sometime',
                err
            })
        }


    } catch (err) {
        res.status(404).json({
            satus: 'fail',
            message: err._message
        })
    }
}

exports.resetPassword = async (req, res, next) => {
    try {
        //console.log(req.body)
        //1) get user based on the token
        const hasedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
        

        //2)if token has not  expired,and there is user,set the new password
        const user = await User.findOne({
            passwordResetToken: hasedToken,
            passwordResetExpires: { $gt: Date.now() }
        })
        //console.log(user)

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'Token expired or invalid'
            })
        }

        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
       
        await user.save();


        //3)update chagePasswordAt property for the user -- this is already happen in userModel


        //4)log the user in,send JWT

        const onlyData = {
            name: user.name,
            _id: user._id,
            email: user.email
        }
        createSendToken(onlyData, 200, res)
    }
    catch (err) {
        res.status(404).json({
            status:'fail',
            message:err
        })
    }

}



//ONLY for rendered pages, no error!
exports.isLoggedIn = async (req, res, next) => {

    if (req.cookies.jwt) {
        try {
            //1) Verification of token inside cookie
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_TOKEN)


            //2) Check if user still exists
            const currentUser = await User.findById(decoded.id)
            if (!currentUser) {
                return next();
            }

            //3) Check if user change password after the jwt was issued
            if (!currentUser.changePasswordAfter(decoded.iat)) {
                return next();
            }

            //4)There is a looged in user
            res.locals.user = currentUser; //res.locals is global variable for pug template and user is variable which is acceble by any pug template becuase of res.locals
            return next();

        } catch (err) {
            return next();
        }
    }
    next();
}