require('dotenv').config();
const util = require('util')
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// module.exports = { cloudinary };
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "ecommerce_app/user_profiles",
      allowedFormats: ['jpeg', 'png', 'jpg'],
    },
  
  });
const parser = multer({ storage: storage , onError : function(err, next) {
    next(err);
}, });
module.exports = {parser };