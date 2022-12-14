require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const checkAuth = require("./middleware/check-auth");


main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rdpy9qx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`);
}

const usersRoutes = require("./routes/user-routes");
const listRoutes = require("./routes/list-routes");
const noteRoutes = require("./routes/note-routes");

const app = express();
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/", usersRoutes);

app.use(checkAuth);

app.use("/lists", listRoutes);

app.use("/notes", noteRoutes);

app.listen(process.env.PORT || 5000, function () {
  console.log("Server is running on port 5000");
});


