"use strict";

const orderModel = require("../models/order");
const userModel = require("../models/account_tvf");
const productModel = require("../models/product");
const warehouseModel = require("../models/warehouse");
const moment = require("moment");
const excelJS = require("exceljs");

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

    if (req.body?.quality) {
      let product_order = await warehouseModel.findOne({
        product_id: req.body.product,
      });
      if (
        parseInt(product_order.remaining_quality) < parseInt(req.body?.quality)
      ) {
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
          errors: {
            quality: { message: "Số lượng còn lại trong kho không đủ." },
          },
        });
        return;
      } else {
        let body = {
          remaining_quality:
            parseInt(product_order.remaining_quality) -
            parseInt(req.body.quality),
          total_quality: product_order.total_quality,
          buy_quality: product_order.buy_quality,
          product_id: product_order.product_id,
        };

        await warehouseModel.updateOne(
          { _id: req.body.product },
          { $set: body }
        );
      }
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

    if (req.body?.quality) {
      let product_order = await warehouseModel.findOne({
        product_id: req.body.product,
      });
      if (
        parseInt(product_order.remaining_quality) < parseInt(req.body?.quality)
      ) {
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
          errors: {
            quality: { message: "Số lượng còn lại trong kho không đủ." },
          },
        });
        return;
      } else {
        let body = {
          remaining_quality:
            parseInt(product_order.remaining_quality) -
            parseInt(req.body.quality),
          total_quality: product_order.total_quality,
          buy_quality: product_order.buy_quality,
          product_id: product_order.product_id,
        };

        await warehouseModel.updateOne(
          { _id: product_order.id },
          { $set: body }
        );
      }
    }

    const product_created = new orderModel(body);
    try {
      await product_created.save();
      res.redirect("/orders");
    } catch (error) {
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
      await orderModel.deleteOne({ _id: req.params.orderId });
      res.redirect("/orders");
    } catch (error) {
      res.status(500).send(error);
    }
  },
  exports: async (req, res) => {
    var fullUrl = req.protocol + "://" + req.get("host");
    try {
      const workbook = new excelJS.Workbook(); // Create a new workbook
      const worksheet = workbook.addWorksheet("Orders"); // New Worksheet
      const path = "./public/files"; // Path to download excel
      // Column for data in excel. key must match data key
      const sheetColumns = [{ header: "S no.", key: "full_name", width: 10 }];

      const listProducts = await productModel.find({});
      listProducts.forEach((product) => {
        sheetColumns.push({
          header: product.name,
          key: "key_" + product.id.toString().trim(),
          width: 30,
        });
      });
      sheetColumns.push({
        header: "Total",
        key: "total_month",
        width: 30,
      });

      worksheet.columns = sheetColumns;

      // worksheet.columns = [
      //   { header: "S no.", key: "s_no", width: 10 },
      //   { header: "full name", key: "full_name", width: 10 },
      //   { header: "email", key: "email", width: 10 },
      //   { header: "sdt", key: "sdt", width: 10 },
      //   { header: "account", key: "account", width: 10 },
      // ];
      // Looping through User data

      const aggregation = [
        {
          $match: {
            date: { $gte: new Date("2022-10-01"), $lt: new Date("2022-10-30") },
          },
        },
        {
          $group: {
            _id: { user: "$user", product: "$product" },
            user: { $first: "$user" },
            product: { $first: "$product" },
            total: { $sum: "$quality" },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "product",
            foreignField: "_id",
            as: "products",
          },
        },
        {
          $lookup: {
            from: "account_tvfs",
            localField: "user",
            foreignField: "_id",
            as: "users",
          },
        },
      ];

      const listOrders = await orderModel.aggregate(
        aggregation,
        function (err, orders) {
          return orders;
        }
      );

      const listAccount = await userModel.find({});

      let counter = 1;

      let list_user = [];
      listAccount.forEach((user) => {
        listProducts.forEach((value) => {
          user._doc["key_" + value.id] = 0;
          user._doc.total_month = 0;
        });

        list_user.push(user);
      });

      list_user = list_user.map((item) => {
        let total = 0;
        listOrders.forEach((order) => {
          if (order.user == item._id.toString().trim()) {
            item._doc["key_" + order.product] = order.total;
            total =
              total +
              parseInt(
                parseInt(order.total) * parseInt(order.products[0]?.sell_price)
              );
          }
        });
        item._doc.total_month = total;

        return item;
      });
      list_user = JSON.parse(JSON.stringify(list_user));

      list_user.forEach((item) => {
        worksheet.addRow(item);
      });
      // Making first line in excel bold
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });
      try {
        const data = await workbook.xlsx
          .writeFile(`${path}/orders.xlsx`)
          .then(() => {
            res.send({
              status: "success",
              message: "file successfully downloaded",
              path: `/files/orders.xlsx`,
            });
          });
      } catch (err) {
        console.log(err);
        res.send({
          status: "error",
          message: "Something went wrong",
        });
        return;
      }

      res.status(200).send({});
      return;
    } catch (error) {
      // res.status(500).send(error);
      console.log(error);
    }
  },
};
