/**
 * * Created userSchema using mongoose and export userSchema model
 */

const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  firstname: {
    type: String,
    default: null,
  },
  lastname: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  token: {
    type: String,
  },
});

module.exports = model("user", userSchema);
