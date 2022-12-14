const express = require("express");
const router = express.Router();
const { default: mongoose } = require("mongoose");

const Note = require("../collectionsMongoDB/note");
const List = require("../collectionsMongoDB/list");

const UserHasAccess = require("../modules/access-check-module");

router.get("/:listid", async function (req, res, next) {
  const listId = req.params.listid;

  try {
    const list = await List.findById(listId).populate("user");

    if (!UserHasAccess(list, req.userData.userId)) {
      return next(new Error("User access error. Failed to show notes."));
    }

    const listNotes = await Note.find({ list: listId });

    res.json({
      notes: listNotes,
      listTitle: list.title,
      listColor: list.color,
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/addnote/:listid", async function (req, res, next) {
  const listId = req.params.listid;

  const { text } = req.body;

  const newNote = new Note({
    text: text,
    list: listId,
  });

  try {
    const list = await List.findById(listId).populate("user");

    if (!UserHasAccess(list, req.userData.userId)) {
      return next(new Error("User access error. Failed to add note."));
    }

    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newNote.save();
    await list.notes.push(newNote);
    await list.save();
    await sess.commitTransaction();
    res.json({ note: newNote });
  } catch (error) {
    return next(error);
  }
});

router.delete("/delete/:noteid", async function (req, res, next) {
  const noteId = req.params.noteid;

  try {
    const note = await Note.findById(noteId).populate("list");

    if (!note) {
      return next(
        new Error(`Trying to request non-existent note with id ${noteId}`)
      );
    }

    const listId = note.list._id.toString();

    const list = await List.findById(listId).populate("user");

    if (!UserHasAccess(list, req.userData.userId)) {
      return next(new Error("User access error. Failed to delete note."));
    }

    const sess = await mongoose.startSession();
    sess.startTransaction();
    await note.remove();
    note.list.notes.pull(note);
    await note.list.save();
    await sess.commitTransaction();
    res.sendStatus(200);
  } catch (error) {
    return next(error);
  }
});

router.patch("/update/:noteid", async function (req, res, next) {
  const noteId = req.params.noteid;

  const { text } = req.body;

  try {
    const note = await Note.findById(noteId).populate("list");

    if (!note) {
      return next(
        new Error(`Trying to request non-existent note with id ${noteId}`)
      );
    }

    const listId = note.list._id.toString();

    const list = await List.findById(listId).populate("user");

    if (!UserHasAccess(list, req.userData.userId)) {
      return next(
        new Error("User access error. Failed to update note.")
      );
    }

    await Note.updateOne({ _id: noteId }, { $set: { text: text } });

    const updatedNote = await Note.findById(noteId);

    res.json({ note: updatedNote });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
