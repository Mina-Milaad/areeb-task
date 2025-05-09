import Joi from 'joi'

export const addEventValidation = Joi.object({
    eventName: Joi.string().required(),
    description: Joi.string().min(30).max(2000).required(),
    category: Joi.string().valid('Theater', 'Concert', 'Festival', 'Other').required(),
    date: Joi.date().required(),
    venue: Joi.string().required(),
    price: Joi.number().min(0).required(),
    image: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif', 'image/jpg').required(),
        size: Joi.number().max(5242880).required(),
        buffer: Joi.any(),
    }).required()
})



export const updateEventValidation = Joi.object({
    id: Joi.string().hex().required(),

    eventName: Joi.string(),
    description: Joi.string().min(30).max(2000),
    category: Joi.string().valid('Theater', 'Concert', 'Festival', 'Other'),
    date: Joi.date(),
    venue: Joi.string(),
    price: Joi.number().min(0),
    image: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif', 'image/jpg').required(),
        size: Joi.number().max(5242880).required(),
        buffer: Joi.any(),

    })
})