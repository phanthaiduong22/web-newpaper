const express = require("express");
const paperModel = require("../models/paper.model");
const categoryModel = require("../models/category.model");
const moment = require("moment");
const router = express.Router();

router.get("/", async function (req, res) {
  const hotNews = await paperModel.hotNews(4);
  const mostWatched = await paperModel.hotNews(10);
  const latestNews = await paperModel.latestNews(10);

  for (let i of hotNews) {
    i.CreatedAt = moment(i).format("Do MMMM YYYY");
  }

  res.render("home", {
    layout: "main.hbs",
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
