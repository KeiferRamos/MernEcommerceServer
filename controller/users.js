const User = require("../model/users.js");
const Admin = require("../model/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json(err);
  }
};

const register = async (req, res) => {
  try {
    const { email, password, verify, username } = req.body;

    if (!email || !password || !verify || !username) {
      return res.status(400).json({ msg: "All fields are required!" });
    }
    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json({ msg: "invalid email!" });
    }

    const invalidEmail = await User.findOne({ email });

    if (invalidEmail) {
      return res.status(400).json({ msg: "email already taken" });
    }
    if (password.length < 8) {
      return res.status(400).json({ msg: "password must be 8 character long" });
    }
    if (password !== verify) {
      return res.status(400).json({ msg: "password does not match!" });
    }

    const salt = await bcrypt.genSalt();
    const encypted = await bcrypt.hash(password, salt);

    await User.create({ email, password: encypted, username });

    res.status(200).json({ msg: "registration successful!" });
  } catch (err) {
    res.status(404).json(err);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required!" });
    }

    const validEmail = await User.findOne({ email });
    if (!validEmail) {
      return res.status(401).json({ msg: "email not recognized" });
    }

    const verified = await bcrypt.compare(password, validEmail.password);
    if (!verified) {
      return res.status(401).json({ msg: "incorrect password!" });
    }

    const token = jwt.sign({ id: validEmail._id }, process.env.JWT_PASSWORD);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json("/");
  } catch (err) {
    res.status(404).json(err);
  }
};

const update = async (req, res) => {
  try {
    const { email, password, verify } = req.body;
    const updated = {};
    const { id } = req.params;

    if (email) {
      const invalidUpdate = await User.findOne({ email });
      if (invalidUpdate && invalidUpdate.id !== id) {
        return res.status(400).json({ msg: "email already taken" });
      }
      if (!email.endsWith("@gmail.com")) {
        return res.status(400).json({ msg: "invalid email" });
      }
      updated.email = email;
    }

    if (password) {
      if (password.length < 8) {
        return res
          .status(400)
          .json({ msg: "password must at least 8 character long" });
      }
      if (!verify) {
        return res.status(400).json({ msg: "confirm your password" });
      }
      if (password !== verify) {
        return res.status(400).json({ msg: "password don't matched" });
      }

      const salt = await bcrypt.genSalt();
      const encrypted = await bcrypt.hash(password, salt);
      updated.password = encrypted;
    }

    const user = await User.findByIdAndUpdate(id, updated, {
      runValidators: true,
      new: true,
    });

    res.status(200).json(user);
  } catch (err) {
    res.status(404).json(err);
  }
};

const orderRecieved = async (req, res) => {
  try {
    const { id, customerID } = req.body;
    const user = await User.findById(req.id);
    await User.findOneAndUpdate(
      { _id: req.id },
      { $pull: { Notif: { _id: id } } }
    );
    await Admin.findOneAndUpdate(
      { "customer._id": customerID },
      { "customer.$.orderState": "recieved" }
    );
    res.status(200).json();
  } catch (err) {
    res.status(404).json(err);
  }
};

const addToCart = async (req, res) => {
  try {
    const { color, item } = req.body;
    const user = await User.findById(req.id);
    console.log(color, item);
    const alreadyInCart = user.cart.find((car) => {
      return car.item.name == item.name && car.color == color;
    });
    if (alreadyInCart) {
      return res.status(400).json({ msg: "already in cart" });
    }

    if (!color) {
      return res.status(400).json({ msg: "Please pick a color!" });
    }

    await User.findOneAndUpdate(
      { _id: req.id },
      { $addToSet: { cart: { item, color } } }
    );
    res.status(200).json({ msg: "added to cart" });
  } catch (err) {
    res.status(404).json(err);
  }
};

const addInfo = async (req, res) => {
  try {
    const moreInfo = req.body;
    await User.findOneAndUpdate({ _id: req.id }, { $set: { info: moreInfo } });
    res.status(200).json();
  } catch (err) {
    res.status(404).json(err);
  }
};

const getTotal = async (req, res) => {
  try {
    const { products } = req.body;
    const totalPrice = products.reduce((total, product) => {
      return total + product.item.price * product.quantity;
    }, 0);
    res.status(200).json(totalPrice.toFixed(2));
  } catch (err) {
    res.status(404).json(err);
  }
};

const clearCart = async (req, res) => {
  try {
    await User.findOneAndUpdate({ _id: req.id }, { $set: { cart: [] } });
    res.status(200).json();
  } catch (err) {
    res.status(404).json(err);
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { selected, count, id } = req.body;
    const user = await User.findById(req.id);

    if (count == 1 && selected == "dec") {
      await User.findOneAndUpdate(
        { _id: req.id },
        { $pull: { cart: { _id: id } } }
      );
    } else if (selected == "dec") {
      await User.findOneAndUpdate(
        { "cart._id": id },
        { $inc: { "cart.$.quantity": -1 } }
      );
    } else {
      await User.findOneAndUpdate(
        { "cart._id": id },
        { $inc: { "cart.$.quantity": 1 } },
        { new: true, runValidators: true }
      );
    }
    console.log(user);
    res.status(200).json();
  } catch (err) {
    res.status(404).json(err);
  }
};

const hasLoggedIn = async (req, res) => {
  try {
    const cookie = req.cookies.token;
    if (!cookie) {
      return res.json(false);
    }

    jwt.verify(cookie, process.env.JWT_PASSWORD);
    res.json(true);
  } catch (err) {
    res.json(false);
  }
};

const logout = (req, res) => {
  res
    .cookie("token", "", { httpOnly: true, secure: true, someSite: "none" })
    .status(200)
    .json(false);
};

module.exports = {
  register,
  login,
  logout,
  update,
  hasLoggedIn,
  getUser,
  addToCart,
  updateQuantity,
  getTotal,
  addInfo,
  clearCart,
  orderRecieved,
};
