import express from "express";
import {
  showNewForm,
  listNotes,
  createNote,
  showEditForm,
  updateNote,
  deleteNote,
} from "../controllers/notesController.js";

import * as notesController from "../controllers/notesController.js";

import { requireLogin } from "../middleware/auth.js";

const router = express.Router();

router.get("/new", requireLogin, showNewForm);
router.get("/", requireLogin, listNotes);
router.post("/", requireLogin, createNote);
router.get("/:id/edit", requireLogin, showEditForm);
router.put("/:id", requireLogin, updateNote);
router.delete("/:id", requireLogin, deleteNote);

export default router;
