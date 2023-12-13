const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LinkSchema = new Schema({
  link: {
    type: String,
  },
});

module.exports = mongoose.model("Link", LinkSchema);
