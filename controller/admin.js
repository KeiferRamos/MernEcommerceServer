const Admin = require("../model/admin.js");
const bcrypt = require("bcrypt");
const User = require("../model/users.js");

const renderView = async (req, res) => {
  try {
    res.status(200).render("admin");
  } catch (err) {
    res.status(404).json(err);
  }
};

const hasLoggedIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "all fields are required" });
    }
    const isValid = await Admin.findOne({ email });
    if (!isValid) {
      return res.status(400).json({ msg: "incorrect email or password" });
    }

    const CorrectPass = await bcrypt.compare(password, isValid.password);
    if (!CorrectPass) {
      return res.status(400).json({ msg: "incorrect email or password" });
    }

    const data = await Admin.find();
    res.status(200).json(data[0]);
  } catch (err) {
    res.status(404).json(err);
  }
};

const addcustomerOrder = async (req, res) => {
  try {
    const { orders, moreInfo, modeOfpayment, orderSummary } = req.body;
    const user = await User.findById(req.id);
    if (modeOfpayment.selected == "cash on delivery") {
      modeOfpayment.details = {};
    }
    await Admin.findOneAndUpdate(
      { _id: "625f5d776210eb4e46b67f2d" },
      {
        $addToSet: {
          customer: {
            orders,
            moreInfo,
            modeOfpayment,
            email: user.email,
            orderSummary,
          },
        },
      }
    );
    res.status(200).json();
  } catch (err) {
    res.status(404).json(err);
  }
};

const deliverOrders = async (req, res) => {
  try {
    const { id, email } = req.body;
    const text = "your order has been delivered";
    const admin = await Admin.find();
    const customer = admin[0].customer.find((person) => person._id == id);
    const orderDetails = customer.orderSummary;
    console.log(id);

    await Admin.findOneAndUpdate(
      { "customer._id": id },
      { $set: { "customer.$.orderState": "delivered" } }
    );
    await User.findOneAndUpdate(
      { email: email },
      {
        $addToSet: { Notif: { text, orderDetails, customerID: id } },
      }
    );

    res.status(200).json();
  } catch (err) {
    res.status(404).json(err);
  }
};

module.exports = { hasLoggedIn, addcustomerOrder, renderView, deliverOrders };
