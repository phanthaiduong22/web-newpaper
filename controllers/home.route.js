const express = require("express");
const paperModel = require("../models/paper.model");
const categoryModel = require("../models/category.model");
const moment = require("moment");
const userModel = require("../models/user.model");
const router = express.Router();

router.get("/", async function (req, res) {
  const hotNews = await paperModel.hotNews(4);
  const mostWatched = await paperModel.hotNews(10);
  const latestNews = await paperModel.latestNews(10);
  const top10 = await paperModel.top10();

  for (let i of top10) {
    i.CreatedAt = moment(i.CreatedAt).format("Do MMMM YYYY");
    i.PublishDate = moment(i.PublishDate).format("Do MMMM YYYY");
  }

  for (let i of hotNews) {
    i.CreatedAt = moment(i.CreatedAt).format("Do MMMM YYYY");
    i.PublishDate = moment(i.PublishDate).format("Do MMMM YYYY");
  }

  for (let i of mostWatched) {
    i.CreatedAt = moment(i.CreatedAt).format("Do MMMM YYYY");
    i.PublishDate = moment(i.PublishDate).format("Do MMMM YYYY");
  }

  for (let i of latestNews) {
    i.CreatedAt = moment(i.CreatedAt).format("Do MMMM YYYY");
    i.PublishDate = moment(i.PublishDate).format("Do MMMM YYYY");
  }

  res.render("home", {
    layout: "main.hbs",
    top10,
    hotNews,
    mostWatched,
    latestNews,
    carousels: [
      { id: 1, active: "active" },
      { id: 2, active: "" },
      { id: 3, active: "" },
    ],
    active: { home: true },
    empty: hotNews.length === 0,
  });
});

module.exports = router;
