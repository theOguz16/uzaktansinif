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
  tytNet: [
    {
      week: Number, // Haftanın numarası gibi bir alan
      net: Number,
    },
  ],
  aytNet: [
    {
      week: Number, // Haftanın numarası gibi bir alan
      net: Number,
    },
  ],
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
  Sorular: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      autopopulate: { maxDepth: 1 },
    },
  ],
  Yorumlar: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      autopopulate: { maxDepth: 1 },
    },
  ],
  Odevler: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      autopopulate: { maxDepth: 1 },
    },
  ],
  role: {
    type: String,
    default: "Student",
  },
  time: {
    type: Number,
    default: 0,
  },
});

// User şemasında bir yöntem ekleyin
UserSchema.methods.addSoru = function (soruID) {
  if (!this.Sorular.includes(soruID)) {
    this.Sorular.push(soruID);
    return this.save();
  }
};

UserSchema.methods.addOdev = function (odevID) {
  if (!this.Odevler.includes(odevID)) {
    this.Odevler.push(odevID);
    return this.save();
  }
};

UserSchema.methods.addYorum = function (yorumID) {
  if (!this.Yorumlar.includes(yorumID)) {
    this.Yorumlar.push(yorumID);
    return this.save();
  }
};

module.exports = mongoose.model("User", UserSchema);
