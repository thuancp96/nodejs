"use strict";
const expressLayouts = require("express-ejs-layouts");
var multer = require("multer");
var express = require("express");
var app = express();

const auth = require("./middleware/auth");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + "_" + file.originalname);
  },
});
var upload = multer({ storage: storage }).single("image");

module.exports = function (app) {
  let accountTVFController = require("./controllers/AccountTVFController");
  let authorController = require("./controllers/AuthorController");
  let bookController = require("./controllers/BookController");
  let userController = require("./controllers/UserController");
  app.use(expressLayouts);

  app.route("").get(auth, function (req, res) {
    res.render("index", {});
  });

  // jwt

  app
    .get("/login", userController.loginForm)
    .post("/register", userController.register)
    .post("/login", userController.login)
    .get("/logout", userController.logout);

  app.get("/welcome", auth, (req, res) => {
    res.status(200).send({ message: "Welcome 🙌 " });
  });

  // Author
  app.route("/add_user").get(function (req, res) {
    res.render("components/users/form-user", {
      data: { type: "Create", url: "/users" },
      errors: {},
    });
  });
  app.route("/users").get(authorController.get).post(authorController.store);
  app.route("/users/delete/:userId").get(authorController.delete);
  app.route("/users/:userId").post(authorController.update);
  app.route("/users/:userId").get(authorController.detail);
  // .put(userController.update)
  // .delete(userController.delete);

  // BOOK
  // app.route("/add_book").get(bookController.createBook);
  // app
  //   .route("/books")
  //   .get(bookController.get)
  //   .post(upload, bookController.store);
  // app.route("/books/delete/:bookId").get(bookController.delete);
  // app.route("/books/clone/:bookId").get(bookController.delete);
  // app
  //   .route("/books/:bookId")
  //   .get(bookController.detail)
  //   .post(upload, bookController.update);

  // MANAGER ACCOUNT TVF
  app.route("/add_accounts").get(function (req, res) {
    res.render("components/accounts/form-user", {
      data: { type: "Create", url: "/accounts" },
      errors: {},
    });
  });
  app.route("/accounts").get(accountTVFController.get);
  app.route("/accounts/delete/:accountID").get(accountTVFController.delete);
  app.route("/accounts").post(accountTVFController.store);
  app
    .route("/accounts/:accountID")
    .get(accountTVFController.detail)
    .post(accountTVFController.update);
};
