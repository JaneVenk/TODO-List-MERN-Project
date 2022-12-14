const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  title: String,
  description: String,
  color: String,
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  notes: [{ type: mongoose.Types.ObjectId, ref: "Note" }],
});

const List = new mongoose.model("List", listSchema);

module.exports = List;
