"use strict";

const util = require("util");
const userModel = require("../models/author");
const moment = require("moment");

module.exports = {
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
