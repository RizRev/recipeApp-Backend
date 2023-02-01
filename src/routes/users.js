const express = require("express");
const router = express.Router();
const { usersController } = require("../controller/users");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");
const updatePhoto =  require("../middleware/upload");

// router.get('/', usersController.getusers);

router.post('/create', usersController.createPekerja);
router.post("/login", usersController.login);
router.get('/detail',protect, usersController.findUserdetail);
router.get('/register/verif/:email/:otp',usersController.verif);
router.get('/liked',protect,usersController.getLikedRecipe)
router.get('/created',protect,usersController.getCreatedRecipe)
router.get('/saved',protect,usersController.getSavedRecipe)
router.put('/update-photo',protect,updatePhoto, usersController.insertPhoto)



module.exports = router;