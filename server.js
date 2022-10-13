const express = require("express");
const app = express();
var cookieParser = require("cookie-parser");
app.use(cookieParser());

const bodyParser = require("body-parser");

require("./api/db/mongodb/db").connect();

require("dotenv").config();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let routes = require("./api/routes"); //importing route
routes(app);

app.use(express.static("public"));
app.set("/views", "./views");
app.set("layout", "./layouts/admin-layout");

app.set("view engine", "ejs");

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

// FLIE
// app.engine("html", require("ejs").renderFile);

app.listen(port);

// CONNECT DB
// const username = process.env.DB_USER_MONGODB || "thuancp96";
// const password = process.env.DB_PASS_MONGODB || "thuancp96";
// const cluster = process.env.CLUSTER_MONGODB || "cluster0.c5dfwdi";
// const dbname = process.env.DB_NAME_MONGODB || "mongodbVSCodePlaygroundDB";

// mongoose.connect(
//   `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`,
//   {}
// );

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error: "));
// db.once("open", function () {
//   console.log(__dirname);
//   console.log("Connected successfully");
// });

console.log("RESTful API server started on: " + port);
