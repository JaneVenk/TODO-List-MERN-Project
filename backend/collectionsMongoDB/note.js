const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  text: String,
  list: { type: mongoose.Types.ObjectId, ref: "List" },
});

const Note = new mongoose.model("Note", noteSchema);

module.exports = Note;
