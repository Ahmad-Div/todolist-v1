//All modules

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const lodash = require("lodash");

//All modules

//App using These

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

//App using These

//Set up Database

mongoose.connect(
  "mongodb+srv://ahmadsoftware:aghlqtyo@cluster0.hxd579x.mongodb.net/todoDB"
);

const itemsSchema = mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemsSchema);

const listSchema = mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

const List = mongoose.model("List", listSchema);

//Set up Database

//Initial items for database

const Before = new Item({
  name: "Study Before",
});
const Now = new Item({
  name: "Study Now",
});

const After = new Item({
  name: "Study After",
});

const defaultItems = [Before, Now, After];

//Get Routs

app.get("/", function (req, res) {
  // let day = date.getDate();

  Item.find((err, item) => {
    console.log(item);
    if (!err) {
      if (item.length === 0) {
        Item.insertMany(defaultItems, (err) => {
          if (!err) {
            console.log("Successfully saved default items to database");
          } else {
            throw err;
          }
        });
        res.redirect("/");
      } else {
        res.render("list", {
          listTitle: "Today",
          newListItem: item,
          value: "todo",
        });
        console.log("items added to website from database");
      }
    } else {
      throw err;
    }
  });
});

app.get("/:listType", (req, res) => {
  let listType = req.params.listType;
  listType = lodash.capitalize(listType);

  List.findOne({ name: listType }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: listType,
          items: defaultItems,
        });

        list.save();
        res.redirect(`/${listType}`);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItem: foundList.items,
          value: `${listType}`,
        });
      }
    } else {
      throw err;
    }
  });
});

app.get("/about/admin", function (req, res) {
  res.render("about");
});

//Get Routs

//Post Routs

app.post("/", function (req, res) {
  const newItem = req.body.todo;
  const listName = req.body.list;

  const item = new Item({
    name: newItem,
  });

  if (listName === "todo") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, (err, foundList) => {
      if (err) {
        throw err;
      } else {
        foundList.items.push(item);
        foundList.save();
        res.redirect(`/${listName}`);
      }
    });
  }
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const currentList = req.body.listName;

  if (currentList === "todo") {
    Item.findByIdAndRemove(`${checkedItemId}`, (err) => {
      if (!err) {
        console.log("Item Removed");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: currentList },
      { $pull: { items: { _id: checkedItemId } } },
      (err, foundList) => {
        if (!err) {
          res.redirect(`/${currentList}`);
        }
      }
    );
  }
});

//Post Routs
