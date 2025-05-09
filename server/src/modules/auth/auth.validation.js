import Joi from "joi";

export const signupValidation = Joi.object({
    userName: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    phone: Joi.string().pattern(/^\d{10,15}$/).required(),
    address: Joi.string().optional(),
});



export const signinValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});


export const forgettingPasswordValidation = Joi.object({
    email: Joi.string().email().required(),
});


export const checkpinCodeValidation = Joi.object({
    pinCode: Joi.string().length(6).pattern(/^[0-9]{6}$/).required()
});

export const resetPasswordValidation = Joi.object({
    newPassword: Joi.string().min(8).required(),
    rePassword: Joi.any().valid(Joi.ref('newPassword')).required().messages({
        'any.only': 'rePassword must match newPassword',
    })
});

export const changeUserPasswordValidation = Joi.object({
    oldPassword: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required(),
    rePassword: Joi.string().valid(Joi.ref('newPassword')).required()
});