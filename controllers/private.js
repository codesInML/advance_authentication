const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

const getPrivateData = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: "You have access to this route."
    })
}

const changePassword = async (req, res, next) => {
    const {password}  = req.body;
    const {_id} = req.user;

    if(!password) {
        return next(new ErrorResponse("Please input your password"));
    }

    try {
        const user = await User.findById(_id).select("+password");
        user.password = password;
        await user.save();

        res.status(201).json({
            success: true,
            data: "Password changed successfully"
        })

    } catch (error) {
        next(new ErrorResponse("Could not change your password", 400))
    }
}

module.exports = {
    getPrivateData,
    changePassword
}