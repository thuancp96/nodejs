"use strict";
const userModel = require("../models/user");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

module.exports = {
  loginForm: async (req, response) => {
    var token = req?.cookies?.accessToken;
    if (token) {
      response.redirect("/");
      return;
    }
    try {
      response.render("components/login/index", {
        layout: "layouts/login-layout",
      });
    } catch (err) {
      // console.log(err);
    }
  },
  register: async (req, response) => {
    try {
      // Get user input
      const { first_name, last_name, email, password } = req.body;

      // Validate user input
      if (!(email && password && first_name && last_name)) {
        response.status(400).send("All input is required");
      }

      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await userModel.findOne({ email });

      if (oldUser) {
        return response.status(409).send("User Already Exist. Please Login");
      }

      //Encrypt user password
      let encryptedPassword = await bcrypt.hash(password, 10);

      // Create user in our database
      const user = await userModel.create({
        first_name,
        last_name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
      });

      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;

      // return new user
      response.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
  },
  login: async (req, res) => {
    try {
      // Get user input
      const { email, password } = req.body;

      // Validate user input
      if (!(email && password)) {
        res.status(400).send({ message: "All input is required" });
      }
      // Validate if user exist in our database
      const user = await userModel.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "24h",
          }
        );

        // save user token
        user.token = token;
        // user
        res.status(200).json(user);
        return;
      }
      res.status(400).send({ message: "Invalid Credentials" });
    } catch (err) {
      // console.log(err);
    }
  },
  logout: async (req, res) => {
    res.clearCookie("accessToken");
    res.redirect("/login");
    res.end();
  },
  get: async (req, response) => {
    const users = await userModel.find({});
    response.render("components/users/index", { users: users });
    // try {
    //   response.send(users);

    // } catch (error) {
    //   response.status(500).send(error);
    // }
  },
  detail: async (req, response) => {
    const user = await userModel.findOne({ _id: req.params.userId });
    try {
      // response.send(user);
      response.render("components/users/form-user", {
        data: { type: "Edit", user: user, url: `/users/${user.id}` },
        errors: {},
      });
    } catch (error) {
      response.status(500).send(error);
    }
  },
  update: async (req, response) => {
    const users = await userModel.updateOne(
      { _id: req.params.userId },
      { $set: req.body }
    );
    try {
      response.redirect("/users");
      // response.send(users);
    } catch (error) {
      const user = await userModel.findOne({ _id: req.params.userId });
      response.render("components/users/form-user", {
        data: { type: "Edit", user: user, url: `/users/${user.id}` },
        errors: users.errors,
      });

      // response.status(500).send(error);
    }
  },
  store: async (request, response) => {
    const user = new userModel(request.body);

    try {
      await user.save();
      response.redirect("/users");
    } catch (error) {
      response.render("components/users/form-user", {
        data: { type: "Create" },
        errors: user.errors,
      });
    }
  },
  delete: async (req, response) => {
    try {
      await userModel.deleteOne({ _id: req.params.userId });

      // response.send(user);
      response.redirect("/users");
    } catch (error) {
      response.status(500).send(error);
    }
  },
};
