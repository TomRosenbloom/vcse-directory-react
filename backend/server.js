const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Debug logging
console.log("Current directory:", __dirname);
console.log("Looking for routes file at:", path.join(__dirname, "routes", "organisations.js"));

// Connect to MongoDB with more detailed error handling
mongoose.connect("mongodb://127.0.0.1:27017/mydatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ Connected to MongoDB");
  
  try {
    const organisationRoutes = require("./routes/organisations");
    console.log("✅ Routes file loaded successfully");
    app.use("/organisations", organisationRoutes);
    console.log("✅ Routes added to app");
  } catch (error) {
    console.error("❌ Error loading routes:", error);
  }
  
  // Define a simple route
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
  
  // Add a test route directly in server.js
  app.get("/test", (req, res) => {
    res.json({ message: "Server is working" });
  });
  
  // Start server after DB connection
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch(err => {
  console.error("❌ MongoDB Connection Error Details:", err);
  process.exit(1);  // Exit the process if MongoDB connection fails
});

