const express = require("express");
const Organisation = require("../models/Organisation");
const router = express.Router();

// Get all organisations
router.get("/", async (req, res) => {
  try {
    const organisations = await Organisation.find();
    res.json(organisations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new organisation
router.post("/", async (req, res) => {
  try {
    const newOrg = new Organisation(req.body);
    await newOrg.save();
    res.json(newOrg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
