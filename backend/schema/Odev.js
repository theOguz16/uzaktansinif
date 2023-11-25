const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OdevSchema = new Schema({
  odevAciklamasi: {
    type: String,
    unique: true,
    required: true,
  },
  kitapAdi: {
    type: String,
  },
  konu: {
    type: String,
  },
  odevTarihi: {
    type: Date,
  },
  complated: {
    type: Boolean,
  },
  token: {
    type: String,
  },
  username: {
    type: String,
  },

  userId: {
    type: String, // veya ObjectId olarak ayarlayabilirsiniz
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

OdevSchema.statics.findByUsername = function (username) {
  return this.find({ username });
};

module.exports = mongoose.model("Odev", OdevSchema);
