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
  str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/Đ/g, "D");
  str = str.replace(/đ/g, "d");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
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
