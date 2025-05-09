
import { addEventValidation, updateEventValidation } from "../modules/event/event.validation.js";
import { AppError } from "../utils/appError.js"



export const validate = (schema) => {

    return (req, res, next) => {

        let filter = {};

        if (schema == addEventValidation || schema == updateEventValidation) {
            filter = { image: req.file, ...req.body, ...req.params, ...req.query }
        } else {
            filter = { ...req.params, ...req.body, ...req.query };
        }

        let { error } = schema.validate(filter, { abortEarly: false })



        if (!error) {

            next()
        } else {

            let errMsgs = error.details.map((err) => err.message)

            next(new AppError(errMsgs, 401))
        }
    }
}


