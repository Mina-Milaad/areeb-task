import jwt from 'jsonwebtoken'
import { catchError } from '../../middleware/catchError.js'
import { User } from '../../../databases/models/user.model.js'
import bcrypt from 'bcrypt'
import { AppError } from '../../utils/appError.js'
import { sendEmailPcode } from '../../email/emailPinCode.js'



const signup = catchError(async (req, res) => {

    let user = new User(req.body)
    await user.save()
    let token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY)
    res.json({ message: "success", token })

})


const signin = catchError(async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email })
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        let updatedUSer = await User.findByIdAndUpdate(user._id, { isActive: 'true' }, { new: true })
        let token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY)
        res.json({ message: "success", token, user })
    }
    next(new AppError('incorrect email or password', 401))
})

const profile = catchError(async (req, res, next) => {
    let user = req.user;
    console.log(req.user);
    return res.json(user)
})

const protectedRoutes = catchError(async (req, res, next) => {
    let { token } = req.headers
    let userPayload = null;
    if (!token) return next(new AppError("token not provided", 401))

    jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
        if (err) return next(new AppError(err, 401))
        userPayload = payload
    })

    let user = await User.findById(userPayload.userId)
    if (!user) return next(new AppError('user not found', 401))
    if (user.passwordChangedAt) {
        let time = parseInt(user.passwordChangedAt.getTime()) / 1000
        if (time > userPayload.iat) next(new AppError('invalid token .... login again', 401))
    }

    if (user.logoutAt) {
        let time = parseInt(user.logoutAt.getTime()) / 1000
        if (time > userPayload.iat) next(new AppError('invalid token .... login again', 401))
    }

    req.user = user
    next()
})


const allowoedTo = (...roles) => {
    return catchError(async (req, res, next) => {
        if (roles.includes(req.user.role)) {
            return next()
        }
        return next(new AppError("you not authorized to access this endpoint", 401))

    })
}

const forgettingPassword = catchError(async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return next(new AppError("not found email", 404));
    const pinCode = Math.floor(100000 + Math.random() * 900000).toString();
    const pinCodeExpire = new Date();
    pinCodeExpire.setMinutes(pinCodeExpire.getMinutes() + 10);
    user.pinCode = pinCode;
    user.pinCodeExpire = pinCodeExpire;
    user.resetVerified = false;

    await user.save();
    let token = jwt.sign({ userId: user._id }, process.env.JWT_KEY);
    let subjectOfEmail = "Forgetting Password";
    sendEmailPcode(user.email, user.pinCode, subjectOfEmail);

    res.json({ message: "send of message successfully", token });
});


const checkpinCode = catchError(async (req, res, next) => {
    let user = await User.findById(req.user.userId);
    console.log(user);
    if (user.pinCode !== req.body.pinCode || new Date() > user.pinCodeExpire)
        return next(new AppError("Invalid or expired PinCode", 401));
    user.pinCode = undefined;
    user.resetVerified = true;
    await user.save();
    let token = jwt.sign({ userId: user._id }, process.env.JWT_KEY);

    res.json({ message: "verification of pinCode is successfully", token });
});



const resetPassword = catchError(async (req, res, next) => {
    let user = await User.findOne({ _id: req.user.userId, resetVerified: true });

    user.password = req.body.newPassword;
    await user.save();
    let token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY);

    res.status(200).json({ message: "reset password is success ", token });
});


const changeUserPassword = catchError(async (req, res, next) => {
    let user = await User.findOne({ _id: req.user.userId })
    if (user, bcrypt.compareSync(req.body.oldPassword, user.password)) {
        await User.findOneAndUpdate({ _id: req.user.userId },
            { password: req.body.newPassword, passwordChangedAt: Date.now() })
        let token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY)
        res.json({ message: "success", token })
    }
    next(new AppError('incorrect email or password', 401))


})

const logout = catchError(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            logoutAt: Date.now(),
            isActive: false
        })
    res.json({ message: "you logOut successfuly" })

})


export {
    signup,
    signin,
    protectedRoutes,
    allowoedTo,
    forgettingPassword,
    checkpinCode,
    resetPassword,
    changeUserPassword,
    logout,
    profile
}