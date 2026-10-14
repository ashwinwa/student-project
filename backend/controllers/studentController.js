const Student = require("../models/Student");

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

exports.getAll = async (req, res) => {
  try {
    const q = req.query.search;
    let filter = {};
    if (q) {
      const rx = new RegExp(escapeRegex(q), "i");
      filter = { $or: [{ name: rx }, { studentId: rx }, { department: rx }] };
    }
    const students = await Student.find(filter).sort({ studentId: 1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getOne = async (req, res) => {
  try {
    const s = await Student.findOne({ studentId: req.params.id });
    if (!s) return res.status(404).json({ success: false, message: "Student not found" });
    res.json(s);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.create = async (req, res) => {
  try {
    await Student.create(req.body);
    res.status(201).json({ success: true, message: "Student added successfully" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Student ID already exists" });
    }
    res.status(400).json({ success: false, message: "Invalid data. Please check all fields." });
  }
};

exports.update = async (req, res) => {
  try {
    const s = await Student.findOneAndUpdate(
      { studentId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!s) return res.status(404).json({ success: false, message: "Student not found" });
    res.json({ success: true, message: "Student updated successfully", data: s });
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid data. Please check all fields." });
  }
};

exports.remove = async (req, res) => {
  try {
    const s = await Student.findOneAndDelete({ studentId: req.params.id });
    if (!s) return res.status(404).json({ success: false, message: "Student not found" });
    res.json({ success: true, message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};