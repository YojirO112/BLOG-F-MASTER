const mongoose = require("mongoose");
const Users = require("./users")

mongoose.connect('mongodb://127.0.0.1:27017/BlogOApp')
    .then(d=>console.log("Data Connection Secured"))
    .catch(err=> console.log("Data Connection Error"));

const dataschema = new mongoose.Schema({
    Owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users"
    },

    title : {
        type : String
    },

    context : {
        type : String
    },

    images : [
        {
            url : String,
            filename : String
        }
    ],

    Date : {
        type : Date,
        default : Date.now
    }
})

const Data = mongoose.model("Data",dataschema);
module.exports=Data;