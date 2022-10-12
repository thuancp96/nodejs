"use strict";
const bookModel = require("../models/book");
const userModel = require("../models/author");

module.exports = {
  get: async (req, response) => {
    const books = await bookModel.find({}).populate("author");
    response.render("components/book/index", { books: books });
    // try {
    //   response.send(users);

    // } catch (error) {
    //   response.status(500).send(error);
    // }
  },
  createBook: async (req, response) => {
    const users = await userModel.find({});
    console.log(users);
    response.render("components/book/form-book", {
      data: { type: "Create", url: "/books", users: users },
      errors: {},
    });
  },
  detail: async (req, response) => {
    const book = await bookModel.findOne({ _id: req.params.bookId });
    const users = await userModel.find({});
    try {
      // response.send(user);
      response.render("components/book/form-book", {
        data: {
          type: "Edit",
          book: book,
          url: `/books/${book.id}`,
          users: users,
        },
        errors: {},
      });
    } catch (error) {
      response.status(500).send(error);
    }
  },
  update: async (request, response) => {
    let book = request.body;
    if (request?.file) {
      book = {
        ...{ coverImage: "/uploads/" + request.file.filename },
        ...request.body,
      };
    }
    const books = await bookModel.updateOne(
      { _id: request.params.bookId },
      { $set: book }
    );

    try {
      response.redirect("/books");
      // response.send(users);
    } catch (error) {
      const user = await bookModel.findOne({ _id: request.params.userId });
      response.render("components/book/form-book", {
        data: { type: "Edit", user: user, url: `/book/${books.id}` },
        errors: users.errors,
      });
    }
  },
  store: async (request, response) => {
    let book = {
      ...{ coverImage: "/uploads/" + request.file.filename },
      ...request.body,
    };
    const book_created = new bookModel(book);

    try {
      await book_created.save();
      response.redirect("/books");
    } catch (error) {
      response.render("components/book/form-book", {
        data: { type: "Create" },
        errors: book_created.errors,
      });
    }
  },
  clone: async (request, response) => {
    const book = await bookModel.findOne({ _id: req.params.bookId });

    let body = {
      title: book?.title,
      description: book?.description,
      pagecount: book?.pagecount,
      price: book?.price,
      author: book?.author?.id,
      coverImage: book?.coverImage,
    };
    const book_created = new bookModel(body);

    try {
      await book_created.save();
      response.redirect("/books");
    } catch (error) {
      response.render("components/book/form-book", {
        data: { type: "Create" },
        errors: book_created.errors,
      });
    }
  },
  delete: async (req, response) => {
    try {
      await bookModel.deleteOne({ _id: req.params.bookId });
      // response.send(user);
      response.redirect("/books");
    } catch (error) {
      response.status(500).send(error);
    }
  },
};
