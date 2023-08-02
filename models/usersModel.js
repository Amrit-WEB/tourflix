const mongoose = require('mongoose')
const crypto = require('crypto')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User must have a name'],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide an email'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    image: [String],
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Password is requied'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Confirm Password should not be empty'],
        validate: {
            //only works on save
            validator: function (el) { return el === this.password },
            message: 'Password is not same'
        }
    },
    passwordChangedAt: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Number },
    otp:{type:Number}

})

//Password Encryption before sav into db
userSchema.pre('save', async function (next) {
    //only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    //hash the password by code of 12
    this.password = await bcrypt.hash(this.password, 12)

    //delete the passwordConfirm (isko db me save nhi karna hai...bs client side par kaam h iska)
    this.passwordConfirm = undefined;

    next();
});

userSchema.pre('save',function(next){
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
})


//comparing user jo login kar raha h uska password ko decrpty kar ke user db ke actual password se
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

//agar password token generate hone kebaad chage karega to usi ka comparision h
userSchema.methods.changePasswordAfter = async function (JWTTimestamp) {
    // console.log(this.passwordChangedAt)
    if (this.passwordChangedAt) {
        const changeTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        //console.log(JWTTimestamp + " " + changeTimestamp)
        return (JWTTimestamp < changeTimestamp);
    }

    //False means NOT changed
    return false;
}

userSchema.methods.createPasswordResetToken = function (){
        const resetToken = crypto.randomBytes(32).toString('hex')
       
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

        return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;