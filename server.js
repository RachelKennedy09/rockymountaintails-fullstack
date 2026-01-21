// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";

import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";

import User from "./models/User.js";
import notesRoutes from "./routes/notesRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// View engine
app.set("view engine", "ejs");

// Core middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static("public"));

// Mount routes AFTER session is set up
function mountRoutes() {
    app.get("/", (req, res) => {
  return res.render("home");
})
  app.use("/notes", notesRoutes);
  app.use("/", authRoutes);

  // Landing route: if logged in -> notes, else -> home




}

async function start() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing. Add it to your .env file.");
    }

    // Connect to MongoDB first
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log("✅ Connected to MongoDB:", mongoose.connection.name);

    // Sessions (use same client for reliability)
    app.use(
      session({
        secret: process.env.SESSION_SECRET || "superdogsecret",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
          client: mongoose.connection.getClient(),
          collectionName: "sessions",
        }),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24, // 1 day
          // secure: true, // enable in production with HTTPS
        },
      })
    );

    // Flash AFTER session
    app.use(flash());

    // Make flash messages available in all views
    app.use((req, res, next) => {
      res.locals.messages = {
        success: req.flash("success"),
        error: req.flash("error"),
      };
      next();
    });

    // Make current user available to all views
    app.use(async (req, res, next) => {
      res.locals.currentUser = null;

      if (!req.session.userId) return next();

      try {
        const user = await User.findById(req.session.userId).select("username");
        res.locals.currentUser = user?.username || null;
      } catch {
        res.locals.currentUser = null;
      }

      next();
    });

    // Routes
    mountRoutes();

    // Start server last
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup error:", err?.message || err);
    process.exit(1);
  }
}

start();
