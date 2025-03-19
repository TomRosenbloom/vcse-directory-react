const mongoose = require("mongoose");

const OrganisationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  contacts: [
    { name: String, role: String, email: String }
  ],
});

module.exports = mongoose.model("Organisation", OrganisationSchema);
