const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.listen(3000, function () {
  console.log("Ahmad Software server running!");
});

app.use("view engine", "ejs");

app.get("/", function (req, res) {
  res.write("Hello\t");
  let today = new Date();

  if (today.getDay() === 6 || today.getDay() === 0) {
    res.write("Yay it's the weekend");
  } else {
    res.write("Boo! I have to work!");
  }
  res.send();
});
