const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name : process.env.NAME,
    api_key : process.env.KEY,
    api_secret : process.env.SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary,
    params : {
        folder : "Blog-O",
        allowedFormats : ["jpeg","png","jpg","svg"]
    }
})

module.exports={
    cloudinary,
    storage
}