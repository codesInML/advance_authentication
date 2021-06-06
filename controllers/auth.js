const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')

const register = async (req, res, next) => {
    const {username, email, password} = req.body;

    if(!username || !email || !password) {
        return next(new ErrorResponse("Please fill out all fields", 400));
    }

    try {
        const user = await User.create({
            username, email, password
        });

        // res.status(201).json({
        //     success: true,
        //     token: 'lkajflajlfalkdfa'
        // })
        sendToken(user, 201, res);
    } catch (error) {
        // res.status(500).json({
        //     success: false,
        //     error: error.message
        // })
        next(error);
    }
};

const login = async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password) {
        // res.status(400).json({
        //     success: false,
        //     error: "Please provide email and password"
        // });
        return next(new ErrorResponse("Please provide email and password", 400))
    }
    try {
        const user = await User.findOne({email}).select("+password");

        if(!user) {
            // res.status(404).json({
            //     success: false,
            //     error: "Invalid credentials"
            // });
        return next(new ErrorResponse("Invalid credentials", 404))
        }

        const isMatch = await user.matchPasswords(password)

        if(!isMatch) {
            // res.status(401).json({
            //     success: false,
            //     error: "Invalid Credentials"
            // });
        return next(new ErrorResponse("Invalid credentials", 401))
        }

        // res.status(200).json({
        //     success: true,
        //     user,
        //     token: "ihdfkgdjkfhaifhadsioadf"
        // })
        sendToken(user, 200, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
};

const forgotPassword = async (req, res, next) => {
    const {email} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user) {
            return next(new ErrorResponse("Email could not be sent", 404));
        }

        const resetToken = user.getResetPasswordToken();

        await user.save();

        const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please go to this link to reset your password</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `

        try {
            
        } catch (error) {
            
        }

    } catch (error) {
        
    }
};

const resetPassword = (req, res, next) => {
    res.send('Reset Password Route');
    next();
};

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({
        success: true,
        token
    })
}

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword
}
