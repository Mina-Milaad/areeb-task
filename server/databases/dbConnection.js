import { connect } from "mongoose";




export const dbConn = connect('mongodb://localhost:27017/areeb-Task')
    .then(() => {
        console.log("database Connected Successfully");
    })