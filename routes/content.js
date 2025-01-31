const express = require("express")
const router = express.Router();
const multer  = require('multer')
const {storage} = require("../cloudinary/cloud")
const dayjs = require("dayjs")

const upload = multer({storage})

const Users = require("../models/users");
const Data = require("../models/data");

const require_login = (req,res,next)=>{
    if(!req.session.user_id){
        return res.redirect("/user/login")
    }
    next();
}

router.use(require_login);

router.get("/post",async(req,res)=>{
    const user_data = await Data.find({}).populate("Owner");
    const logged_id = req.session.user_id;
    res.render("content/home",{msg : req.flash("Success"),user_data,logged_id});
})

router.get("/upload/:id",(req,res)=>{
    const logged_id = req.session.user_id;
    res.render("content/upload",{logged_id});
})

router.post("/upload/:id/post", upload.array("cover"), async(req,res)=>{
    const user = await Users.findById(req.params.id);
    const new_data = new Data(req.body);
    new_data.Owner=user;
    req.files[0] && new_data.images.push({url : req.files[0].path , filename : req.files[0].filename})
    if(!req.files[0]){
        new_data.images.push({url : "https://res.cloudinary.com/dpi07kxqs/image/upload/v1695577206/Blog-O/o8qo2suc7uoqqcob1zka.png" , filename : "Stock Image"})
    }
    await new_data.save();
    await user.save();
    res.redirect("/BlogO/post");
})

router.get("/post/:id", async(req,res)=>{
    const get_post = await Data.findById(req.params.id).populate("Owner");
    const logged_id = req.session.user_id;
    let day_iso = dayjs(get_post.Date);
    day_iso = day_iso.format("MMM DD, YYYY")
    let allow = false;
    if(get_post.Owner._id.equals(logged_id)){
        allow = true
    }
    const post_img = get_post.images[0].url;
    res.render("content/viewpost",{get_post,logged_id,day_iso,allow,post_img})
})

router.get("/profile/:id", async(req,res)=>{
    const get_user_post = await Data.find({Owner : req.params.id}).populate("Owner")
    const logged_id = req.session.user_id;
    const username = get_user_post[0].Owner.username
    res.render("content/viewprofile",{get_user_post,username,logged_id})
})

router.get("/post/:id/edit" , async(req,res)=>{
    const get_post = await Data.findById(req.params.id);
    const logged_id = req.session.user_id;
    if(!get_post.Owner.equals(logged_id)){
        return res.redirect("/BlogO/post")
    }
    res.render("content/editpost",{get_post,logged_id})
})

router.put("/post/:id/update" , async(req,res)=>{
    const get_post = await Data.findById(req.params.id)
    if(!get_post.Owner.equals(req.session.user_id)){
        return res.send("You are not authorized to update data")
    }
    await Data.findByIdAndUpdate(req.params.id,{title : req.body.title , context : req.body.context});
    res.redirect(`/BlogO/post/${req.params.id}`)
})

router.delete("/post/:id/delete", async(req,res)=>{
    const get_post = await Data.findById(req.params.id)
    if(!get_post.Owner.equals(req.session.user_id)){
        return res.redirect("/BlogO")
    }
    await get_post.deleteOne();
    res.redirect("/BlogO/post")
})

module.exports = router