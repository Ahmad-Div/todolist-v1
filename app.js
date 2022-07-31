const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("view engine", "ejs");
app.listen(3000, function () {
  console.log("Ahmad Software server running!");
});

let todo = [];

app.get("/", function (req, res) {
  let today = new Date();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  let day = today.toLocaleDateString("en-US", options);
  res.render("list", { kindOfDay: day, newListItem: todo });
});

app.post("/", function (req, res) {
  item = req.body.todo;
  todo.push(item);
  res.redirect("/");
});
