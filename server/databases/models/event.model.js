import mongoose from "mongoose";



const schema = new mongoose.Schema({
    eventName: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true,
        minLenght: 30,
        maxLength: 2000
    },
    category: {
        type: String,
        enum: ['Theater', 'Concert', 'Festival', 'Other'],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: String,

}, { timestamps: true, versionKey: false })


export const Event = mongoose.model('Event', schema)