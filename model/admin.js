const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const ItemSchema = mongoose.Schema({
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

const ordersSchema = mongoose.Schema({
  color: String,
  item: ItemSchema,
  quantity: Number,
});

const detailsSchema = mongoose.Schema({
  option: {
    type: String,
  },
  cardNumber: {
    type: String,
  },
  ExpDate: {
    type: String,
  },
  SecurityCode: {
    type: String,
  },
  username: {
    type: String,
  },
});

const modeOfpaymentSchema = mongoose.Schema({
  selected: {
    type: String,
    required: true,
  },
  details: detailsSchema,
});

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
    required: true,
  },
});

const MoreInfoSchema = mongoose.Schema({
  fullName: fullNameSchema,
  address: addressSchema,
  contact: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const orderSummarySchema = mongoose.Schema({
  itemQuantity: Number,
  TotalPrice: Number,
  ItemPrice: Number,
  ShippingFee: Number,
});

const CustomerSchema = mongoose.Schema({
  orders: [ordersSchema],
  moreInfo: MoreInfoSchema,
  modeOfpayment: modeOfpaymentSchema,
  orderSummary: orderSummarySchema,
  orderState: {
    type: String,
    default: "pending",
  },
  email: String,
});

const AdminSchema = mongoose.Schema({
  email: String,
  password: String,
  customer: {
    type: [CustomerSchema],
    default: [],
  },
});

module.exports = mongoose.model("admin", AdminSchema);
