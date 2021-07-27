const express = require("express");
const paperModel = require("../models/paper.model");
const moment = require("moment");

const router = express.Router();

router.get("/", async function (req, res) {
  res.render("Search Something");
});

router.post("/", async function (req, res) {
  const searchList = await paperModel.search(req.body.search);

  for (let i of searchList) {
    i.CreatedAt = moment(i).format("Do MMMM YYYY");
  }
  res.render("search", {
    searchList,
  });
});

module.exports = router;
