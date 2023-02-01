const multer = require("multer");
const storage = require("../config/cloudinary");
const { updatePhoto } = require("../model/users");

const upload = multer({
  storage: storage,
}).fields([
  {
    name: "photo",
    maxCount: 1,
  },
  {
    name: "video",
    maxCount: 1,
  },
]);
const uploadPhoto = multer({
  storage: storage,
}).fields([
  {
    name: "photo",
    maxCount: 1,
  }
]);

module.exports = upload,updatePhoto;




// const multer = require("multer");
// const { response } = require("./common");

// const storage = multer.diskStorage({
//   filename: function (req, file, cb) {
//     const uniq = Date.now() + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniq + ".png");
//   },
// });
// const upload = multer({
//   limits: { fileSize: 1 * Math.pow(1024, 2 /* MBs*/) },
//   storage,
//   fileFilter: (req, file, cb) => {
//     if (
//       file.mimetype == "image/png" ||
//       file.mimetype == "image/jpg" ||
//       file.mimetype == "image/jpeg" ||
//       file.mimetype == "video/mp4"
//     ) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
//     }
//   },
// });

// module.exports = upload;
