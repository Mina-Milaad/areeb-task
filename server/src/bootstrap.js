import authRouter from "./modules/auth/auth.routes.js"
import eventRouter from "./modules/event/event.routes.js"


export const bootstrap = (app) => {

    app.use('/auth', authRouter),
        app.use('/event', eventRouter)
}