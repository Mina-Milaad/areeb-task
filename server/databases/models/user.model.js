import mongoose from "mongoose";
import bcrybt from 'bcrypt'


const schema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: String,

    phone: {
        type: String,
        require: true,
        unique: true
    },
    address: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },

    isActive: {
        type: Boolean,
        default: true
    },
    pinCode: String,
    pinCodeExpire: String,
    resetVerified: Boolean,
    passwordChangedAt: Date,
    logoutAt: Date,
    bookedEvents: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Event"
        }
    ]
}, { timestamps: true, versionKey: false })


schema.pre('save', function () {
    this.password = bcrybt.hashSync(this.password, 8)
})

schema.pre('findOneAndUpdate', function () {
    if (this._update.password) this._update.password = bcrybt.hashSync(this._update.password, 8)
})


export const User = mongoose.model('User', schema)