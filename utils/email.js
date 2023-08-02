const nodemailer = require('nodemailer')

const sendEmail = async options => {
    //1)create a transporter
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    //2)defien the email options
    const mailOptions = {
        from:'Amritanshu <hello@amritanshu.io>',
        to: options.email,
        subject : options.subject,
        message : options.message
    }

    //3)Actually send the email
    await transport.sendMail(mailOptions)
}

module.exports = sendEmail