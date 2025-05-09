import { Router } from "express";
import { allowoedTo, protectedRoutes } from "../auth/auth.controller.js";
import { uploadSingleFile } from "../../fileUpload/fileUpload.js";
import { validate } from "../../middleware/validate.js";
import { addEventValidation, updateEventValidation } from "./event.validation.js";
import { addEvent, allEvents, bookedEvent, deleteEvent, getEvent, updateEvent } from "./event.controller.js";

const eventRouter = Router()

eventRouter.route('/')
    .post(protectedRoutes, allowoedTo('admin'), uploadSingleFile("image"), validate(addEventValidation), addEvent)
    .get(protectedRoutes, allowoedTo("admin", "user"), allEvents)

eventRouter.route('/:id')
    .put(protectedRoutes, allowoedTo('admin'), uploadSingleFile("image"), validate(updateEventValidation), updateEvent)
    .get(protectedRoutes, allowoedTo("admin", "user"), getEvent)
    .delete(protectedRoutes, allowoedTo("admin"), deleteEvent)

eventRouter.route("/book/:eventId").post(protectedRoutes, allowoedTo("user"), bookedEvent)


export default eventRouter