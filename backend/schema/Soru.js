const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  soruBasligi: {
    type: String,
    required: true,
    unique: true,
  },
  soruAciklamasi: {
    type: String,
    required: true,
  },
  konu: {
    type: String,
    required: true,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  isLiked: {
    type: Boolean,
    default: false,
  },
  yorumCount: {
    type: Number,
    default: 0,
  },
  isCommanted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  imageUrl: {
    type: String,
  },

  yorumlar: [
    {
      type: Schema.Types.ObjectId,
      ref: "Yorum",
      autopopulate: { maxDepth: 1 },
    },
  ],
});

PostSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Post", PostSchema);
