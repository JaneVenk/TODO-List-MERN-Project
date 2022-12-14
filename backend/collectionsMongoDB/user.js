const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  lists: [{ type: mongoose.Types.ObjectId, ref: "List" }],
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
