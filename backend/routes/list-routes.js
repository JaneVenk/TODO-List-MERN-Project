const express = require("express");
const router = express.Router();

const User = require("../collectionsMongoDB/user");
const List = require("../collectionsMongoDB/list");
const Note = require("../collectionsMongoDB/note");
const { default: mongoose } = require("mongoose");

const UserHasAccess = require("../modules/access-check-module");

router.get("/:userid", async function (req, res, next) {
  const userId = req.params.userid;

  if (!UserHasAccess(userId, req.userData.userId)) {
    return next(
      new Error("User access error. Failed to show lists. Incorrect user id.")
    );
  }

  try {
    const userLists = await List.find({ user: userId });

    res.json({ lists: userLists });
  } catch (error) {
    return next(error);
  }
});

router.post("/addlist/:userid", async function (req, res, next) {
  const userId = req.params.userid;

  if (!UserHasAccess(userId, req.userData.userId)) {
    return next(
      new Error("User access error. Failed to add list. Incorrect user id.")
    );
  }

  const { title, description, color } = req.body;

  const newList = new List({
    title,
    description,
    color,
    user: userId,
    notes: [],
  });

  try {
    const user = await User.findById(userId);
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newList.save();
    await user.lists.push(newList);
    await user.save();
    await sess.commitTransaction();
    res.json({ list: newList });
  } catch (error) {
    return next(error);
  }
});

router.delete("/delete/:listid", async function (req, res, next) {
  const listId = req.params.listid;

  try {
    const list = await List.findById(listId).populate("user");

    if (!list) {
      return next(
        new Error(`Trying to request non-existent list with id ${listId}`)
      );
    }

    if (!UserHasAccess(list, req.userData.userId)) {
      return next(
        new Error("User access error. Failed to delete list.")
      );
    }

    const sess = await mongoose.startSession();
    sess.startTransaction();
    var note;
    list.notes.forEach(async function (element) {
      note = await Note.findById(element);
      await note.remove();
    });
    await list.remove();
    list.user.lists.pull(list);
    await list.user.save();
    await sess.commitTransaction();
    res.sendStatus(200);
  } catch (error) {
    return next(error);
  }
});

router.patch("/update/:listid", async function (req, res, next) {
  const listId = req.params.listid;

  const { title, description } = req.body;

  try {
    const list = await List.findById(listId).populate("user");

    if (!list) {
      return next(
        new Error(`Trying to request non-existent list with id ${listId}`)
      );
    }

    if (!UserHasAccess(list, req.userData.userId)) {
      return next(
        new Error("User access error. Failed to update list.")
      );
    }

    await List.updateOne(
      { _id: listId },
      { $set: { title: title, description: description } }
    );

    // const updatedList = await List.findById(listId);

    list.title = title;
    list.description = description;

    res.json({ list: list });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
