"use strict";

const warehouseModel = require("../models/warehouse");
const productModel = require("../models/product");

module.exports = {
  get: async (req, res) => {
    const warehouses = await warehouseModel.find({}).populate("product_id");
    res.render("components/warehouse/index", { warehouses: warehouses });
  },
  add: async (req, res) => {
    const products = await productModel.find({});
    res.render("components/warehouse/form-warehouse", {
      data: { type: "Nhập ", products: products, url: "/warehouses" },
      errors: {},
    });
  },
  detail: async (req, res) => {},
  update: async (req, res) => {},
  store: async (req, res) => {
    const products = await productModel.find({});
    if (!req?.body?.buy_quality) {
      res.render("components/warehouse/form-warehouse", {
        data: {
          type: "Nhập ",
          products: products,
          url: "/warehouses",
          warehouse: req.body,
        },
        errors: { buy_quality: { message: "Số lượng nhập vào bắt buộc" } },
      });
      return;
    }

    const warehouse_product = await warehouseModel.findOne({
      product_id: req.body.product_id,
    });

    if (warehouse_product) {
      let body = {
        ...{
          remaining_quality:
            parseInt(warehouse_product.remaining_quality) +
            parseInt(req.body.buy_quality),
          total_quality:
            parseInt(warehouse_product.total_quality) +
            parseInt(req.body.buy_quality),
        },
        ...req.body,
      };

      const product = await warehouseModel.updateOne(
        { _id: warehouse_product.id },
        { $set: body }
      );

      res.redirect("/warehouses");
    } else {
      let body = {
        ...{
          remaining_quality: req.body.buy_quality,
          total_quality: req.body.buy_quality,
        },
        ...req.body,
      };
      const product_created = new warehouseModel(body);
      try {
        await product_created.save();
        res.redirect("/warehouses");
      } catch (error) {
        res.render("components/warehouse/form-warehouse", {
          data: { type: "Nhập ", products: products, url: "/warehouses" },
          errors: product_created.errors,
        });
      }
    }
  },
  delete: async (req, res) => {
    try {
      await warehouseModel.deleteOne({ _id: req.params.productID });
      res.redirect("/products");
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
