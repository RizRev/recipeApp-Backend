const express = require("express");
const router = express.Router();
const { usersController } = require("../controller/users");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");


router.post('/create',protect,upload, usersController.recipe);
router.get('/',usersController.getAll)
router.get('/like/:id_recipe',protect,usersController.Likerecipe)
router.get('/save/:id_recipe',protect,usersController.Saverecipe)
router.get('/recipe-details/:id_recipe',usersController.getResipe)
router.post('/comment-post/:id_recipe',protect,usersController.insertComment)
router.get('/comment-get/:id_recipe',usersController.getComment)
router.put('/edit/:id_recipe',upload,usersController.updateRecipe)

module.exports = router;