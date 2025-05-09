import { User } from "../../databases/models/user.model.js"
import { AppError } from "../utils/appError.js"



export const checkEmail = async(req , res,next) => {
    let isFound = await User.findOne({email : req.body.email})
    if (isFound) return next(new AppError(" email is already exist. " , 409))

    next()
    
}