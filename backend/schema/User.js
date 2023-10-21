const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
  },
  surname: {
    type: String,
  },
  city: {
    type: String,
  },
  gender: {
    type: String,
  },
  password: {
    type: String,
  },
  emailAddres: {
    type: String,
  },
  tytNet: {
    type: Number,
    default: 0,
  },
  aytNet: {
    type: Number,
    default: 0,
  },
  sorulanSoru: {
    type: Number,
    default: 0,
  },
  yapilanYorum: {
    type: Number,
    default: 0,
  },
  dateOfBirth: {
    type: Date,
  },
  Sorular: {
    type: Array,
  },
  Odevler: {
    type: Array,
  },
});

module.exports = mongoose.model("User", UserSchema);
