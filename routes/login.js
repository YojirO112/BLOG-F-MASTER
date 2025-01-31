const express = require("express")
const router = express.Router();

const Users = require("../models/users")

router.post("/login/index",async(req,res)=>{
    const check_acc = await Users.FindAndValidate(req.body.username,req.body.password);
    if(check_acc){
        req.session.user_id = check_acc._id;
        req.flash("Success",`Welcome ${req.body.username}`)
        return res.redirect("/BlogO/post")
    }
    req.flash("error","Username or Password is wrong!!")
    res.redirect("/user/login")
})


router.post("/register/index",async(req,res)=>{
    const new_user = new Users({username : req.body.username})
    await Users.RegisterAndHash(new_user,req.body.password)
    await new_user.save();
    req.session.user_id = new_user._id;
    req.flash("Success",`Welcome ${req.body.username}`)
    res.redirect("/BlogO/post")
})

router.get("/login",(req,res)=>{
    res.render("product/login",{msg : req.flash("error")})
})

router.get("/register",(req,res)=>{
    res.render("product/register")
})

router.post("/logout",(req,res)=>{
    req.session.user_id = null;
    res.redirect("/user/login");
})

module.exports=router;