const mongoose = require("mongoose");

const fullNameSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});

const addressSchema = mongoose.Schema({
  streetAddress: {
    type: String,
    required: true,
  },
  Barangay: {
    type: String,
    required: true,
  },
  City: {
    type: String,
    required: true,
  },
  Region: {
    type: String,
    required: true,
  },
  ZipCode: {
    type: String,
  },
});

const infoSchema = mongoose.Schema({
  fullName: fullNameSchema,
  address: addressSchema,
  contact: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
});

const itemSchema = mongoose.Schema({
  brand: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const cartSchema = mongoose.Schema({
  color: {
    type: String,
    required: true,
  },
  item: itemSchema,
  quantity: {
    type: Number,
    default: 1,
  },
});
const orderDetailsSchema = mongoose.Schema({
  itemQuantity: Number,
  TotalPrice: Number,
  ItemPrice: Number,
  ShippingFee: Number,
});

const notifSchema = mongoose.Schema(
  {
    text: String,
    orderDetails: orderDetailsSchema,
    customerID: String,
  },
  { timestamps: true }
);

const UserSchema = mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: [true, " please enter your email"],
  },
  password: {
    type: String,
    required: [true, " please enter your password"],
  },
  cart: {
    type: [cartSchema],
    default: [],
  },
  Notif: {
    type: [notifSchema],
    default: [],
  },
  info: infoSchema,
});

module.exports = mongoose.model("User", UserSchema);
