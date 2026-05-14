import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import userModel from "./models/userModel.js";
import eventModel from "./models/eventModel.js";
import { Enrollment } from "./models/EnrollmentModel.js";


dotenv.config();

// -------------------- PATH FIX --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- EXPRESS APP --------------------
const app = express();
app.use(express.json());
app.use(cors());

// Serve event uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------------------- MULTER UPLOAD --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

function resolveEventImageUrl(image) {
  if (!image) return null;
  return image.startsWith("http") ? image : `http://localhost:5000/uploads/${image}`;
}

function eventToClient(doc) {
  const d = doc._doc || doc;
  const o = typeof d.toObject === "function" ? d.toObject() : { ...d };
  return {
    ...o,
    image: resolveEventImageUrl(o.image),
    volunteerName: o.volunteerName,
    volunteerType: o.volunteerType,
  };
}

// -------------------- MONGODB CONNECTION --------------------
const connectionString = process.env.MONGODB_URI;
mongoose.connect(connectionString)
  .then(() => console.log("Database Connected Successfully!"))
  .catch(err => console.log("DB Connection Error:", err));


// ---------------- REGISTER ----------------

app.post("/register", async (req, res) => {
  const { userName, userEmail, userPassword, role, userPhone, userAddress } = req.body;

  try {
    const existingUser = await userModel.findOne({ userEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const newUser = new userModel({
      userName,
      userEmail,              
      userPassword: hashedPassword,
      role: role || "user",
      userPhone,
      userAddress,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// ---------------- LOGIN ----------------
app.post("/login", async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;

    const user = await userModel.findOne({ userEmail }); 
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(userPassword, user.userPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    res.json({
      success: true,
      message: "Login successful",
      userId: user._id,
      role: user.role,
      userName: user.userName
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


/* ============================================================
    ADD EVENT
============================================================ */
app.post("/addEvent", async (req, res) => {
  try {
    const { volunteerName, volunteerType, date, time, description, location, image } = req.body;
    const newEvent = new eventModel({
      volunteerName,
      date,
      time,
      volunteerType,
      description,
      location,
      image: image || null,
    });

    await newEvent.save();
    res.json({ msg: "Event added successfully", success: true });
  } catch (err) {
    console.error(err);
    res.json({ msg: "Error adding event", success: false });
  }
});

/* ============================================================
    UPDATE EVENT
============================================================ */
app.put("/updateEvent/:id", async (req, res) => {
  try {
    const { volunteerName, volunteerType, date, time, description, location, image } = req.body;
    const fields = {};
    if (volunteerName) fields.volunteerName = volunteerName;
    if (date) fields.date = date;
    if (time) fields.time = time;
    if (volunteerType) fields.volunteerType = volunteerType;
    if (description !== undefined) fields.description = description;
    if (location !== undefined) fields.location = location;
    if (image) fields.image = image;

    const updated = await eventModel.findByIdAndUpdate(
      req.params.id,
      fields,
      { new: true }
    );

    if (!updated) return res.json({ msg: "Event not found", success: false });
    res.json({
      msg: "Event updated successfully",
      success: true,
      event: eventToClient(updated),
    });
  } catch (err) {
    console.error(err);
    res.json({ msg: "Error updating event", success: false });
  }
});

/* ============================================================
    DELETE EVENT
============================================================ */
app.delete("/deleteEvent/:id", async (req, res) => {
  try {
    await eventModel.findByIdAndDelete(req.params.id);
    res.json({ msg: "Event deleted", success: true });
  } catch (err) {
    res.json({ msg: "Error deleting", success: false });
  }
});

/* ============================================================
    GET ALL EVENTS
============================================================ */
app.get("/allEvents", async (req, res) => {
  try {
    const events = await eventModel.find().sort({ createdAt: -1 });
    res.json(events.map((e) => eventToClient(e)));
  } catch (err) {
    res.json({ msg: "Error fetching events" });
  }
});

//Bring one event by ID and add the image link
app.get("/events/:id", async (req, res) => {
  try {
    const event = await eventModel.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    res.json(eventToClient(event));
  } catch (err) {
    res.status(500).json({ msg: "Error fetching event" });
  }
});

//Get all the events that a specific user has enrolled for.
app.get("/api/enrollments/my-enrollments/:userId", async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.params.userId });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// POST new enrollment
app.post("/api/enrollments", async (req, res) => {
  console.log("Request body:", req.body); 
  try {
    const { userId, eventId, title, date } = req.body;
    
    // Get user name
    const user = await userModel.findById(userId).select("userName");
    const userName = user?.userName || "";

    const newEnrollment = new Enrollment({ userId, eventId: eventId || "", title, date, userName });
    await newEnrollment.save();
    res.json(newEnrollment);
  } catch (err) {
    console.error("Error saving enrollment:", err);
    res.status(500).json({ error: "Cannot enroll" });
  }
});

// GET enrollments by eventId (for participants list)
app.get("/api/enrollments/event/:eventId", async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ eventId: req.params.eventId });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT update attendance for an event
app.put("/api/enrollments/attendance/:eventId", async (req, res) => {
  try {
    const { attendance } = req.body; // { enrollmentId: bool, ... }
    const updates = Object.entries(attendance).map(([id, attended]) =>
      Enrollment.findByIdAndUpdate(id, { attended })
    );
    await Promise.all(updates);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select("-userPassword");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT update user profile
app.put("/users/:id", async (req, res) => {
  try {
    const { userName, userPhone, userAddress, profileImage } = req.body;
    const updated = await userModel.findByIdAndUpdate(
      req.params.id,
      { userName, userPhone, userAddress, profileImage },
      { new: true }
    ).select("-userPassword");
    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});



/* ============================================================
    START SERVER
============================================================ */
app.listen(5000, () => console.log(" Server running on port 5000"));
