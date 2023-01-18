// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "toko",
//     resource_type: "auto",
//     allowedFormats: ["jpeg", "png", "jpg", "mp4"],
//   },
// });
// // module.exports = cloudinary;
// module.exports = storage;

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "recipe",
    resource_type: "auto",
    allowedFormats: ["jpeg", "png", "jpg","mp4","mkv"],
  },
});

// module.exports = cloudinary;
module.exports = storage;
