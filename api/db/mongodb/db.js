const mongoose = require("mongoose");

const username = "thuancp96";
const password = "thuancp96";
const cluster = "cluster0.c5dfwdi";
const dbname = "mongodbVSCodePlaygroundDB";

exports.connect = () => {
  mongoose
    .connect(
      `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`,
      {}
    )
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("connect db failed");
      console.error(error);
    });
};
