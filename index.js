//Import Library
const express = require("express");
const helmet = require("helmet")
var bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const cookieParser = require("cookie-parser");

//Import File Local
const mainRouter = require("./src/routes/index");
const { response } = require("./src/middleware/common");
const app = express();
const port = 3003;

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// app.use(cors());

const corsOptions = {
  origin: "https://magical-meringue-f7f79e.netlify.app/",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(bodyParser.json());

app.use(bodyParser.json());

app.use(morgan("dev"));
app.use("/", mainRouter);
// const corsOptions = {
//   origin: "*",
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };
// app.use(cors(corsOptions));

app.all("*", (req, res, next) => {
  response(res, 404, false, null, "404 Not Found");
});

/* app.get("/", (req, res) => {
  res.send("Hello World!");
}); */

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
