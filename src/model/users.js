// const { search } = require("../routes/recipe");
const Pool = require("./../config/db");
const getusers = () => {
  return Pool.query(`SELECT * FROM users`);
};
const getResipe = (id_recipe) => {
  return Pool.query(`SELECT * FROM recipe where id_recipe='${id_recipe}'`);
};
const createPekerja = (data) => {
    const { id, name, password, email, phonenumber, auth, otp } = data;
    return new Promise((resolve, reject) => {
      Pool.query(
        `INSERT INTO users(id,name,password,email,phonenumber,auth,otp) VALUES('${id}','${name}','${password}','${email}',${phonenumber},0,${otp})`,
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }
        }
      );
    });
  };
  const findEmail = (email) => {
    return new Promise((resolve, reject) =>
      Pool.query(`SELECT * FROM users where email='${email}'`, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      })
    );
  };
  const createRecipe = (data2) => {
    const {id_users,name_recipe,ingredients,id_recipe,photo,video} = data2;
    return new Promise((resolve, reject) => {
      Pool.query(
        `INSERT INTO recipe(id_users,name_recipe,status,ingredients,id_recipe,photo,video) VALUES('${id_users}','${name_recipe}','create','${ingredients}','${id_recipe}','${photo}','${video}')`,
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }
        }
      );
    });
  };
  const findUser = (id) => {
    return new Promise((resolve, reject) =>
      Pool.query(`SELECT * FROM users where id='${id}'`, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      })
    );
  };
  const verification = (email) =>{
    return new Promise((resolve, reject) =>
      Pool.query(`UPDATE users SET auth=1 where email='${email}'`, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      })
    );
  }
  const createLog = (data) => {
    const {users_id,id_recipe} = data
    return new Promise((resolve, reject) =>
      Pool.query(`INSERT INTO log(users_id,id_recipe,activity) VALUES('${users_id}','${id_recipe}','create')`
      , (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      })
    );
  }
  const likeLog = (datalike) => {
    const {id_users,id_recipe} = datalike
    return new Promise((resolve, reject) =>
      Pool.query(`INSERT INTO log(users_id,id_recipe,activity) VALUES('${id_users}','${id_recipe}','like')`
      , (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      })
    );
  }
  const saveLog = (data) => {
    const {id_users,id_recipe} = data
    return new Promise((resolve, reject) =>
      Pool.query(`INSERT INTO log(users_id,id_recipe,activity) VALUES('${id_users}','${id_recipe}','save')`
      , (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      })
    );
  }
  const CreatedRecipe = (id) => {
    return new Promise((resolve, reject) =>
      Pool.query(`SELECT * FROM recipe where id_users='${id}'`, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      })
    );
  };
  const SavedRecipe = (id_users) => {
    return new Promise((resolve, reject) =>
      Pool.query(`SELECT log.id_recipe,recipe.name_recipe,recipe.photo FROM log inner join recipe on log.id_recipe = recipe.id_recipe where log.users_id='${id_users}' AND log.activity='save'`, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      })
    );
  };
  const LikedRecipe = (id_users) => {
    return new Promise((resolve, reject) =>
      Pool.query(`SELECT log.id_recipe,recipe.name_recipe,recipe.photo FROM log inner join recipe on log.id_recipe = recipe.id_recipe where log.users_id='${id_users}' AND log.activity='like'`, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      })
    );
  };
  const PostComment = (data) => {
    // console.log(users_id)
    const {users_id,id_recipe,comment} = data
    return new Promise((resolve, reject) =>
      Pool.query(`INSERT INTO comment(users_id,id_recipe,comment) VALUES('${users_id}','${id_recipe}','${comment}')`, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      })
    );
  };
  const GetComment = (id_recipe) => {
    return new Promise((resolve, reject) =>
      Pool.query(`SELECT comment.comment,users.name,users.photo FROM comment inner join users on comment.users_id=users.id where comment.id_recipe='${id_recipe}'`, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      })
    );
  };
  const updatePhoto = (id,data) => {
    const {photo} =  data
    return Pool.query(`UPDATE users SET photo='${photo}' WHERE id='${id}'`);
  };

  const getRecipe = (data) => {
    const {name} = data
    return Pool.query(`SELECT * FROM recipe WHERE name_recipe ilike '%${name}%'`)
  }
  const updateRecipe = data => {
    const {photo,name_recipe,video,ingredients,id_recipe} =  data
    console.log(data)
    return Pool.query(`UPDATE recipe SET photo='${photo}',name_recipe='${name_recipe}',ingredients='${ingredients}',video='${video}' WHERE id_recipe='${id_recipe}'`);
  };
module.exports = {
    getusers,
    createPekerja,
    findEmail,
    createRecipe,
    getResipe,
    findUser,
    verification,
    createLog,
    likeLog,
    saveLog,
    SavedRecipe,
    CreatedRecipe,
    LikedRecipe,
    PostComment,
    GetComment,
    updatePhoto,
    getRecipe,
    updateRecipe
};