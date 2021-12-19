
const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  dateText: { type: String, unique: false, required: true },
  year: { type: Number, unique: false, required: true },
  typeName: { type: String, unique: false, required: true },
  text: { type: String, unique: true, required: true },
});

module.exports = mongoose.model("history", Schema);