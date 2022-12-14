"use strict";
const userModel = require("../models/account_tvf");

module.exports = {
  index: async (req, response) => {
    const accounts = await userModel.find({});
    try {
      response.send(accounts);
    } catch (error) {
      response.status(500).send(error);
    }
  },
  get: async (req, response) => {
    const accounts = await userModel.find({});
    const type = req?.query?.type;
    if (type == "web") {
      try {
        response.send(accounts);
      } catch (error) {
        response.status(500).send(error);
      }
    } else {
      response.render("components/accounts/index", { accounts: accounts });
    }
  },
  detail: async (req, response) => {
    const user = await userModel.findOne({ _id: req.params.accountID });
    try {
      response.render("components/accounts/form-user", {
        data: { type: "Edit", accounts: user, url: `/accounts/${user.id}` },
        errors: {},
      });
    } catch (error) {
      response.status(500).send(error);
    }
  },
  update: async (req, response) => {
    var full_name = req?.body?.full_name;
    let account = "";
    if (full_name) {
      account = nameToNickName(full_name);
    }
    const body = { ...{ account: account }, ...req.body };

    try {
      await userModel.updateOne({ _id: req.params.accountID }, { $set: body });
      response.redirect("/accounts");
      // response.send(users);
    } catch (error) {
      let email = req?.body?.email;
      const user = await userModel.findOne({ email });
      if (user) {
        const user = await userModel.findOne({ _id: req.params.accountID });
        response.render("components/accounts/form-user", {
          data: { type: "Edit", accounts: user, url: `/accounts/${user.id}` },
          errors: {
            email: {
              message: "The specified email address is already in use.",
            },
          },
        });
        return;
      }
      // response.status(500).send(error);
    }
  },
  store: async (request, response) => {
    var full_name = request?.body?.full_name;
    let account = "";
    if (full_name) {
      account = nameToNickName(full_name);
    }

    const body = { ...{ account: account }, ...request.body };
    const type = request?.query?.type;
    if (type == "web") {
      return;
    } else {
      let email = request?.body?.email;
      if (email) {
        const user = await userModel.findOne({ email });
        if (user) {
          response.render("components/accounts/form-user", {
            data: { type: "Create", accounts: body },
            errors: {
              email: {
                message: "The specified email address is already in use.",
              },
            },
          });
          return;
        }
      }
      const user = new userModel(body);

      try {
        await user.save();
        response.redirect("/accounts");
      } catch (error) {
        response.render("components/accounts/form-user", {
          data: { type: "Create", accounts: body },
          errors: user.errors,
        });
      }
    }
  },
  delete: async (req, response) => {
    try {
      await userModel.deleteOne({ _id: req.params.accountID });
      // response.send(user);
      response.redirect("/accounts");
    } catch (error) {
      response.status(500).send(error);
    }
  },
};

function toNonAccentVietnamese(str) {
  str = str.replace(/A|??|??|??|???|??|???|???|???|???|??|???|???|???|???/g, "A");
  str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a");
  str = str.replace(/E|??|??|???|???|??|???|???|???|???/, "E");
  str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e");
  str = str.replace(/I|??|??|??|???/g, "I");
  str = str.replace(/??|??|???|???|??/g, "i");
  str = str.replace(/O|??|??|??|???|??|???|???|???|???|??|???|???|???|???/g, "O");
  str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o");
  str = str.replace(/U|??|??|??|???|??|???|???|???|???/g, "U");
  str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u");
  str = str.replace(/Y|??|???|???|???/g, "Y");
  str = str.replace(/???|??|???|???|???/g, "y");
  str = str.replace(/??/g, "D");
  str = str.replace(/??/g, "d");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huy???n s???c h???i ng?? n???ng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ??, ??, ??, ??, ??
  return str;
}

function nameToNickName(full_name) {
  if (!full_name) return;
  let str = "";
  let arr = toNonAccentVietnamese(full_name).split(" ");
  if (arr.length > 0) {
    arr.forEach((element, i) => {
      if (i + 1 >= arr.length) {
        str =
          element.charAt(0).toUpperCase() +
          element.slice(1).toLowerCase() +
          str;
      } else {
        let item = element.substr(0, 1);
        if (typeof item == "string") {
          str += item.toUpperCase();
        }
      }
    });
  }
  return str;
}
