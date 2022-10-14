"use strict";

const productModel = require("../models/product");

module.exports = {
  index: async (req, res) => {
    const products = await productModel.find({});
    res.send(products);
  },
  get: async (req, res) => {
    const products = await productModel.find({});
    res.render("components/product/index", { products: products });
    return;
  },
  detail: async (req, res) => {
    const product = await productModel.findOne({ _id: req.params.productID });
    try {
      res.render("components/product/form-product", {
        data: {
          type: "Cập nhật",
          product: product,
          url: `/products/${product.id}`,
        },
        errors: {},
      });
    } catch (error) {
      res.status(500).send(error);
    }
  },
  update: async (req, res) => {
    let body = req.body;
    if (req?.file) {
      body = {
        ...{ image: "/uploads/" + req?.file?.filename },
        ...req.body,
      };
    }
    const product = await productModel.updateOne(
      { _id: req.params.productID },
      { $set: body }
    );
    try {
      res.redirect("/products");
    } catch (error) {
      res.render("components/product/form-product", {
        data: { type: "Edit", url: `/products/${product.id}` },
        errors: product.errors,
      });
    }
  },
  store: async (req, res) => {
    let product = {
      ...{
        image: req?.file?.filename ? "/uploads/" + req?.file?.filename : "",
      },
      ...req.body,
    };
    const product_created = new productModel(product);

    try {
      await product_created.save();
      res.redirect("/products");
    } catch (error) {
      res.render("components/product/form-product", {
        data: { type: "Create", product: req?.body },
        errors: product_created.errors,
      });
    }
  },
  delete: async (req, res) => {
    try {
      await productModel.deleteOne({ _id: req.params.productID });
      res.redirect("/products");
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
