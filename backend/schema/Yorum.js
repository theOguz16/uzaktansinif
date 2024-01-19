const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const YorumSchema = new Schema({
  commentExplain: {
    type: String,
    required: true,
    unique: true,
  },
  greenBg: {
    type: Boolean,
    default: false,
  },
  blueBg: {
    type: Boolean,
    default: false,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  isLiked: {
    type: Boolean,
    default: false,
  },
  isLikedUsers: [],
  isQuestionUsers: [],

  questionCount: {
    type: Number,
    default: 0,
  },
  isQuestion: {
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
  username: {
    type: String,
  },
  token: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  yorumlar: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      autopopulate: { maxDepth: 1 },
    },
  ],
});

YorumSchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("Yorum", YorumSchema);
