const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ProductSchema = mongoose.Schema({
  img: { type: String },
  name: { type: String },
  price: { type: Number },
  category: { type: String },
  brand: { type: String },
  topSelling: { type: Boolean },
  specs: { type: Array },
  sold: { type: Number, default: 0 },
  about: { type: String },
  stacks: { type: Number },
  likes: {
    type: Array,
    default: [String],
  },
  dislikes: {
    type: Array,
    default: [String],
  },
  comments: [CommentSchema],
  flashSale: {
    type: Boolean,
    default: false,
  },
  color: {
    type: Array,
    default: [String],
  },
});

module.exports = mongoose.model("Product", ProductSchema);
