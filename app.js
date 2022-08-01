const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

app.set("view engine", "ejs");
app.listen(3000, function () {
  console.log("Ahmad Software server running!");
});

const todo = [];
const workItems = [];

app.get("/", function (req, res) {
  let day = date.getDate();
  res.render("list", { listTitle: day, newListItem: todo, value: "todo" });
});

app.post("/", function (req, res) {
  item = req.body.todo;
  if (req.body.list === "work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    todo.push(item);
    res.redirect("/");
  }
});

app.get("/work", function (req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItem: workItems,
    value: "work",
  });
});

app.post("/work", function (req, res) {
  item = req.body.todo;
  workItems.push(item);

  res.redirect("/work");
});

app.get("/about", function (req, res) {
  res.render("about");
});
