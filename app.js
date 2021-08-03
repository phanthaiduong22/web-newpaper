const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();
const app = express();

app.use(cors({ origin: "*" }));

app.use(morgan("dev"));
app.use(cookieParser());

app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use("/public", express.static("public"));

require("./middlewares/session.mdw")(app);
require("./middlewares/view.mdw")(app);
require("./middlewares/locals.mdw")(app);
require("./middlewares/routes.mdw.js")(app);

app.use("/", (req, res) => {
  res.render("404");
});

const PORT = 3001;
app.listen(PORT, function () {
  console.log(`EC Web App listening at http://localhost:${PORT}`);
});
