"use strict";

const orderModel = require("../models/order");
const userModel = require("../models/account_tvf");
const productModel = require("../models/product");
const moment = require("moment");

module.exports = {
  get: async (req, res) => {
    const orders = await orderModel
      .find({})
      .populate("product")
      .populate("user");
    res.render("components/order/index", { orders: orders });
  },
  add: async (req, res) => {
    const products = await productModel.find({});
    const users = await userModel.find({});
    res.render("components/order/form-order", {
      data: { type: "Thêm ", products: products, url: "/orders", users: users },
      errors: {},
    });
  },
  detail: async (req, res) => {
    const order = await orderModel.findOne({ _id: req.params.orderId });
    const products = await productModel.find({});
    const users = await userModel.find({});
    try {
      // response.send(user);
      res.render("components/order/form-order", {
        data: {
          type: "Cập nhật ",
          order: order,
          url: `/orders/${order.id}`,
          users: users,
          products: products,
        },
        errors: {},
      });
    } catch (error) {
      res.status(500).send(error);
    }
  },
  update: async (req, res) => {
    let quality = req.body?.quality;
    if (!quality) {
      const products = await productModel.find({});
      const users = await userModel.find({});
      res.render("components/order/form-order", {
        data: {
          type: "Edit",
          users: users,
          url: `/orders/${req.params.orderId}`,
          order: req.body,
          products: products,
        },
        errors: { quality: { message: "Số lượng là bắt buộc" } },
      });
      return;
    }

    const orders = await orderModel.updateOne(
      { _id: req.params.orderId },
      { $set: req.body }
    );

    try {
      res.redirect("/orders");
      // res.send(users);
    } catch (error) {
      const products = await productModel.find({});
      const users = await userModel.find({});
      res.render("components/order/form-order", {
        data: {
          type: "Edit",
          users: users,
          url: `/orders/${req.params.orderId}`,
          order: req.body,
          products: products,
        },
        errors: orders.errors,
      });
    }
  },
  store: async (req, res) => {
    let time = moment().format("h:mm:ss a MM/DD/YYYY");
    let body = {
      ...{
        date: time,
      },
      ...req.body,
    };
    const product_created = new orderModel(body);
    try {
      await product_created.save();
      res.redirect("/orders");
    } catch (error) {
      console.log(error);
      const products = await productModel.find({});
      const users = await userModel.find({});
      res.render("components/order/form-order", {
        data: {
          type: "Thêm ",
          products: products,
          url: "/orders",
          users: users,
          order: body,
        },
        errors: product_created.errors,
      });
    }
  },
  delete: async (req, res) => {
    try {
      await orderModel.deleteOne({ _id: req.params.productID });
      res.redirect("/products");
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
