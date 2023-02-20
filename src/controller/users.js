const Modelusers = require("../model/users")
const {findEmail,
      createPekerja,createRecipe,verification}=require("../model/users")
const { response } = require("../middleware/common");
const { v4: uuidv4 } = require("uuid");
const {generateToken} = require("../middleware/auth")
const bcrypt = require("bcryptjs");
const email = require("../middleware/email");
const Host = process.env.HOST;
const Port = process.env.PORT;
const usersController = {
    getusers: (req, res, next) => {
        Modelusers.getusers()
          .then((result) =>
            response(res, 200, true, result.rows, "get data success")
          )
          .catch((err) => response(res, 404, false, err, "get data fail"));
      },
      createPekerja: async (req, res, next) => {
        let {
          rows: [users],
        } = await findEmail(req.body.email);
        if (users) {
          return response(res, 404, false, "email already use", "register fail");
        }
    
        let digits = "0123456789";
        let otp = "";
        for (let i = 0; i < 6; i++) {
          otp += digits[Math.floor(Math.random() * 10)];
        }
    
        let salt = bcrypt.genSaltSync(10);
        let password = bcrypt.hashSync(req.body.password);
        let password1 = req.body.password;
        let confirm = req.body.confirm;
    
        let data = {
          id: uuidv4(),
          email: req.body.email,
          password,
          name: req.body.name,
          phonenumber: req.body.phonenumber,
          confirm,
          auth: req.body.auth,
          otp,
        };
        if (password1 !== confirm)
          return response(res, 417, false, null, "password tidak sesuai");
        try {
          const result = await createPekerja(data);
          if (result) {
            console.log(result);
            let sendEmail = await email(
              data.email,
              otp,
              `https://${Host}:${Port}/${email}/${otp}`,
              data.fullname
            );
            if (sendEmail == "email not sent!") {
              return response(res, 404, false, null, "register fail");
            }
            response(
              res,
              200,
              true,
              { email: data.email },
              "register success please check your email"
            );
          }
        } catch (err) {
          console.log(err);
          response(res, 404, false, err, "register fail");
        }
      },
      login: async (req,res,next)=>{
        console.log('email',req.body.email)
        console.log('password',req.body.password)
        let {rows:[users]} = await findEmail(req.body.email)
        if(!users){
            return response(res, 404, false, null," email not found")
        }
        const password = req.body.password
        const validation = bcrypt.compareSync(password,users.password)
        if(!validation){
            return response(res, 404, false, null,"wrong password")
        }
        delete users.password
        console.log(users.validation)
        if (users.auth == 0) {
            return response(res, 404, false, null, "account not verified");
          }
        delete users.password
        let payload = {
            id: users.id,
            name: users.name,
            email: users.email
        }
        users.token = generateToken(payload)
        response(res, 200, false, users,"login success")
},recipe: async (req,res,next)=>{
  try {
    const {
      video: [video],
    } = req.files;
    const {
      photo: [photo],
    } = req.files;
    req.body.video = video.path;
    req.body.photo = photo.path;
    // photo : photo.path
    // const photo = photo.path
    const id_users = req.payload.id
    const id_recipe = uuidv4()
    const {name_recipe,
    ingredients} = req.body
    const data1 = {
      id_users,
      name_recipe,
      ingredients,
      id_recipe,
      photo: photo.path,
      video: video.path
    }
    Modelusers.createRecipe(data1)
    const data2 = {
      id_users,
      id_recipe
    }
    Modelusers.createLog(data2)
    response(
      res,
      200,
      true,
      data1,
      "add recipe success"
    );
  } catch (err) {
    console.log(err);
    response(res, 404, false, err, "add recipe fail");
  }
  // Modelusers.createRecipe(req.body)
  //         .then((result) =>
  //           response(res, 200, true, result.rows, "input recipe success")
  //         )
  //         .catch((err) => response(res, 404, false, err, "input recipe fail"));
},getResipe: (req, res, next) => {
  Modelusers.getResipe(req.params.id_recipe)
    .then((result) =>
      response(res, 200, true, result.rows, "get resipe success")
    )
    .catch((err) => response(res, 404, false, err, "get resipe fail"));
},findUserdetail: (req, res, next) => {
  const id = req.payload.id
  Modelusers.findUser(id)
    .then((result) =>
      response(res, 200, true, result.rows, "get user detail success")
    )
    .catch((err) => response(res, 404, false, err, "get user detail fail"));
},verif: async (req, res) => {
  const { email, otp } = req.params;
  const {
    rows: [users],
  } = await Modelusers.findEmail(email);
  if (!users) {
    return response(res, 404, false, null, "email not found");
  }

  if (users.otp == otp) {
    await verification(email);
    return response(
      res,
      200,
      true,
      req.body.email,
      "verification account success"
    );
  }
  return response(res, 404, false, null, "wrong otp please check your email");
},Likerecipe: async (req,res,next)=>{
  try {
    const id_users = req.payload.id
    const id_recipe = req.params.id_recipe
    const data1 = {
      id_users,
      id_recipe
    }
    Modelusers.likeLog(data1)
    response(
      res,
      200,
      true,
      data1,
      "like recipe success"
    );
  } catch (err) {
    console.log(err);
    response(res, 404, false, err, "like recipe fail");
  }

},Saverecipe: async (req,res,next)=>{
  try {
    const id_users = req.payload.id
    const id_recipe = req.params.id_recipe
    const data1 = {
      id_users,
      id_recipe
    }
    Modelusers.saveLog(data1)
    response(
      res,
      200,
      true,
      data1,
      "save recipe success"
    );
  } catch (err) {
    console.log(err);
    response(res, 404, false, err, "save recipe fail");
  }

},getLikedRecipe: async (req,res,next)=>{
  try {
    const id_users = req.payload.id
    const data1 = {
      id_users
    }
    const result = await Modelusers.LikedRecipe(id_users)
    response(
      res,
      200,
      true,
      result.rows,
      "get liked recipe success"
    );
  } catch (err) {
    console.log(err);
    response(res, 404, false, err, "get liked recipe fail");
  }

},getSavedRecipe: async (req,res,next)=>{
  try {
    const id_users = req.payload.id
    const data1 = {
      id_users
    }
    console.log(id_users)
    const result = await Modelusers.SavedRecipe(id_users)
    response(
      res,
      200,
      true,
      result.rows,
      "like saved recipe success"
    );
  } catch (err) {
    console.log(err);
    response(res, 404, false, err, "like recipe fail");
  }

},getCreatedRecipe: async (req,res,next)=>{
  try {
    const id = req.payload.id
    // const data1 = {
    //   id_users
    // }
    const result = await Modelusers.CreatedRecipe(id)
    response(
      res,
      200,
      true,
      result.rows,
      "get created recipe success"
    );
  } catch (err) {
    console.log(err);
    response(res, 404, false, err, "get liked recipe fail");
  }

},
insertComment: async (req,res,next)=>{
  try {
    const users_id = req.payload.id
    const comment = req.body.comment
    const id_recipe = req.params
    const data1 = {
      users_id,
      id_recipe: id_recipe.id_recipe,
      comment
    }
    await Modelusers.PostComment(data1)
    console.log(data1)
    response(
      res,
      200,
      true,
      data1,
      "insert comment success"
    );
  } catch (err) {
    console.log(err);
    response(res, 404, false, err, "insert comment fail");
  }
},
getComment: async (req,res,next)=>{
  try {
    // const id_recipe = req.params.id_recipe
    // const data1 = {
    //   id_recipe
    // }
    const result = await Modelusers.GetComment(req.params.id_recipe)
    response(
      res,
      200,
      true,
      result.rows,
      "get comment success"
    );
  } catch (err) {
    console.log(err);
    response(res, 404, false, err, "get comment fail");
  }
},updatePhoto: async (req, res) => {
  const id = req.payload.id;
  // const{photo:[photo]} = req.body.photo
  
  // const photo = req.files.photo
  const {
    photo: [photo],
  } = req.files;
  req.body.photo = photo.path;
  const data = {

    photo: photo.path
  }
  // console.log(photo)
  Modelusers.updatePhoto(id,data)
    .then((result) =>
      response(res, 200, false, result, "Update Foto Berhasil")
    )
    .catch((err) => response(res, 400, false, err, "Update Foto Gagal"));
},insertPhoto: async (req, res) => {
  try {
    const id = req.payload.id;
    console.log(id);
    const {
      photo: [photo],
    } = req.files;
    req.body.photo = photo.path;
    await Modelusers.updatePhoto(id, photo.path);
    return response(res, 200, true, req.body, "Update Photo Success");
  } catch (err) {
    console.log(err);
    return response(res, 404, false, err, "Update Photo Fail");
  }
},getAll: (req, res, next) => {
  const name = req.query.name || ''
  const data = {name}
  Modelusers.getRecipe(data)
    .then((result) =>
      response(res, 200, true, result.rows, "get data success")
    )
    .catch((err) => response(res, 404, false, err, "get data fail"));
},updateRecipe: async (req, res) => {
  // const id = req.payload.id;
  const id_recipe = req.params.id_recipe
  console.log(req.files)
  console.log(req.body)
  // const {
  //   video: [video]
  // } = req.files;
  const {name_recipe,ingredients} = req.body
  const {
    photo: [photo],
    video: [video]
  } = req.files;
  // req.body.photo = photo.path;
  // req.body.video = video.path;
  const data = {
    id_recipe,
    name_recipe,
    ingredients,
    video: video.path,
    photo: photo.path
  }
  // const data = {
  //     id_recipe,
  //     name_recipe ,
  //     ingredients,
  //     video: "http//apaja.com",
  //     photo: "http//sama.com"
  //   }
  // console.log(photo)
  Modelusers.updateRecipe(data)
    .then((result) =>
      response(res, 200, false, result, "Update recipe Berhasil")
    )
    .catch((err) => response(res, 400, false, err, "Update recipa Gagal"));
},allUser: async(req,res,next) => {
  Modelusers.getusers()
  .then((result) =>
      response(res, 200, false, result.rows, "get user Berhasil")
    )
    .catch((err) => response(res, 400, false, err, "Update recipa Gagal"));
}}


exports.usersController = usersController;