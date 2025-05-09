import { Event } from "../../../databases/models/event.model.js";
import { User } from "../../../databases/models/user.model.js";
import { catchError } from "../../middleware/catchError.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import { AppError } from "../../utils/appError.js";
import path from 'path'
import sharp from 'sharp'


const addEvent = catchError(async (req, res, next) => {

    if (req.file) {
        let cleanedFilename = req.file.originalname
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_.]/g, '');
        const resizedFilename = encodeURIComponent(cleanedFilename);
        const outputPath = path.join("uploads", resizedFilename);
        await sharp(req.file.buffer)
            .toFile(outputPath);
        req.body.image = `http://localhost:4000/uploads/${cleanedFilename}`
    }

    let event = new Event(req.body)
    await event.save()
    res.json({ message: "success", event })

})


const allEvents = catchError(async (req, res, next) => {
    let apiFeatures = new ApiFeatures(Event.find(), req.query)
        .fields().filter().sort().search()

    let count = await Event.countDocuments({ ...req.query })
    apiFeatures = apiFeatures.paginate(count)
    let events = await apiFeatures.mongooseQuery
    res.json({ message: "success", paginate: apiFeatures.paginationResult, events })
})


const getEvent = catchError(async (req, res, next) => {

    let event = await Event.findById(req.params.id)
    event || next(new AppError("event not found", 404))
    !event || res.json({ message: "success", event })
})


const updateEvent = catchError(async (req, res, next) => {
    if (req.file) {
        let cleanedFilename = req.file.originalname
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_.]/g, '');
        const resizedFilename = encodeURIComponent(cleanedFilename);
        const outputPath = path.join("uploads", resizedFilename);
        await sharp(req.file.buffer)
            .toFile(outputPath);
        req.body.image = `http://localhost:4000/uploads/${cleanedFilename}`
    }

    let event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
    event || next(new AppError("event not found", 404))
    !event || res.json({ message: "success", event })
})


const deleteEvent = catchError(async (req, res, next) => {
    let event = await Event.findByIdAndDelete(req.params.id)
    event || next(new AppError("event not found", 404))
    !event || res.json({ message: "success", event })
})

const bookedEvent = catchError(async (req, res, next) => {
    let { eventId } = req.params
    let user = req.user;
    let event = await Event.findById(eventId);


    event || next(new AppError("event not found", 404))
    if (user.bookedEvents.includes(eventId)) {
        return res.status(400).json({ message: "You already booked this event." })
    }

    await User.findByIdAndUpdate(user._id, {
        $addToSet: { bookedEvents: eventId }, // ✅ عشان يمنع التكرار حتى لو نسيت الشرط
    });
    return res.status(200).json({ message: "event has booked successfully" })
})

export {
    addEvent,
    allEvents,
    getEvent,
    updateEvent,
    deleteEvent,
    bookedEvent
}