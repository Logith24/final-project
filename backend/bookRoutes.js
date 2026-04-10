const express = require("express");
const router = express.Router();
const Book = require("./Book");

router.get("/", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

module.exports = router;