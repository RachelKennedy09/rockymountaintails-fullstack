import Note from "../models/Note.js";

//Save a new dog walking note
export async function createNote(req, res) {
  try {
    // Convert checkbox values to Boolean manually
    req.body.poop = req.body.poop === "on";
    req.body.pee = req.body.pee === "on"; // if you have a 'pee' field too

    const note = new Note(req.body);
    note.user = req.session.userId;
    await note.save();

    req.flash("success", "Note saved successfully!");
    res.redirect("/notes");
  } catch (err) {
    console.log("Error saving note:", err.message);
    if (err.name === "ValidationError") {
      let messages = Object.values(err.errors).map((e) => e.message);
      req.flash("error", messages.join(" "));
    } else {
      req.flash("error", "Something went wrong.");
    }
    res.redirect("/notes/new");
  }
}

//Rendering new note form
export function showNewForm(req, res) {
  res.render("notes/new", { message: null });
}

//Fetch notes
export async function listNotes(req, res) {
  try {
    const notes = await Note.find({ user: req.session.userId }).sort({
      date: -1,
    }); //most recent first
    const message = req.query.message || null; //capture message
    res.render("notes/index", { notes, message });
  } catch (err) {
    console.error(" Error fetching notes:", err);
    res.status(500).send("Error loading notes");
  }
}

//Edit Form
export async function showEditForm(req, res) {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.session.userId,
    });

    if (!note) {
      req.flash("error", "Note not found (or you don't have permission).");
      return res.redirect("/notes");
    }

    res.render("notes/edit", { note });
  } catch (err) {
    res.status(404).send("Note not found");
  }
}

//update note
export async function updateNote(req, res) {
  try {
    const { weather, incidents, other, walker } = req.body;

    const poop = req.body.poop === "on";

    const updated = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.session.userId },
      {
        weather,
        incidents,
        poop,
        other,
        walker,
      },
      { new: true }
    );

    if (!updated) {
      req.flash("error", "Note not found (or you don't have permission).");
      return res.redirect("/notes");
    }
    res.redirect("/notes?message=Note+updated+successfully!");
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).send("Error updating note");
  }
}

//delete note

export async function deleteNote(req, res) {
  try {
    const deleted = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.session.userId,
    });

    if (!deleted) {
      req.flash("error", "Note not found (or you don't have permission).");
      return res.redirect("/notes");
    }
    res.redirect("/notes?message=Note+deleted+successfully!");
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).send("Error deleting note");
  }
}
