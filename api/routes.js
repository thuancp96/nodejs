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
  // let bookController = require("./controllers/BookController");
  let userController = require("./controllers/UserController");
  let productController = require("./controllers/ProductsController");
  let warehouseController = require("./controllers/WareHouseController");
  let orderController = require("./controllers/OrderController");

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
  app
    .route("/users")
    .get(auth, authorController.get)
    .post(auth, authorController.store);
  app.route("/users/delete/:userId").get(auth, authorController.delete);
  app.route("/users/:userId").post(auth, authorController.update);
  app.route("/users/:userId").get(auth, authorController.detail);
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
  app.route("/add_accounts").get(auth, function (req, res) {
    res.render("components/accounts/form-user", {
      data: { type: "Create", url: "/accounts" },
      errors: {},
    });
  });
  app.route("/accounts").get(auth, accountTVFController.get);
  app
    .route("/accounts/delete/:accountID")
    .get(auth, accountTVFController.delete);
  app.route("/accounts").post(auth, accountTVFController.store);
  app
    .route("/accounts/:accountID")
    .get(auth, accountTVFController.detail)
    .post(auth, accountTVFController.update);

  // PRODUCT
  app.route("/add_product").get(auth, function (req, res) {
    res.render("components/product/form-product", {
      data: { type: "Tạo mới", url: "/products" },
      errors: {},
    });
  });
  app
    .route("/products")
    .get(auth, productController.get)
    .post(auth, upload, productController.store);
  app.route("/products/delete/:productID").get(auth, productController.delete);
  app
    .route("/products/:productID")
    .get(auth, productController.detail)
    .post(auth, upload, productController.update);

  // Warehouse

  app.route("/add_warehouse").get(auth, warehouseController.add);
  app
    .route("/warehouses")
    .get(auth, warehouseController.get)
    .post(auth, warehouseController.store);

  // ORDER
  app.route("/add_order").get(auth, orderController.add);
  app
    .route("/orders")
    .get(auth, orderController.get)
    .post(orderController.store);
  app
    .route("/orders/:orderId")
    .get(auth, orderController.detail)
    .post(auth, orderController.update);
  app.route("/orders/delete/:orderId").get(auth, orderController.delete);
  // EXPORT EXCEL
  app.route("/exports").post(auth, orderController.exports);
  app.route("/exports").get(auth, function (req, res) {
    res.redirect("/statistical");
  });
  app.route("/statistical").get(auth, orderController.statistical);
  app.route("/statistical/delete/:id").get(auth, orderController.remove);

  // API
  app.route("/all-user").get(auth, accountTVFController.index);
  app.route("/all-product").get(auth, productController.index);
  app.route("/order").post(auth, orderController.order);
};
