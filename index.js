const express = require("express");
const methodOverride = require("method-override");
const app = express();
app.use(methodOverride("_method"))
const path = require("path")
const mongoose = require("mongoose")
const ejsMate = require("ejs-mate")
const bcrypt = require("bcrypt")
const session = require("express-session")
const flash = require("connect-flash")
require('dotenv').config()

const login = require("./routes/login");
const event = require("./routes/content");

app.engine("ejs",ejsMate)
app.use(express.urlencoded({extended : true}));
app.use(session({secret : process.env.SESSION_SECRET}))
app.use(flash())
app.use("/user",login);
app.use("/BlogO",event);
app.use(express.static(path.join(__dirname,"public")));

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.listen(3000,()=>{
    console.log("PORT 3000 connected");
})