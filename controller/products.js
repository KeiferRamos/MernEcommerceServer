const Product = require("../model/products");

const getAllProducts = async (req, res) => {
  try {
    let query = req.query;
    const { brand, category, sortByPrice } = req.query;
    if (brand == "all") {
      delete query.brand;
    }
    if (category == "all") {
      delete query.category;
    }

    const products = await Product.find(query).sort(
      sortByPrice == "false" ? "price" : "-price"
    );
    res.status(200).json(products);
  } catch (err) {
    res.status(404).json(err);
  }
};

const updateLikesAndDislikes = async (req, res) => {
  try {
    const { name, selected, opposite } = req.params;
    const product = await Product.findOne({ name });
    if (product[selected].includes(req.id)) {
      await Product.findOneAndUpdate(
        { name },
        { $pull: { [selected]: req.id } }
      );
    } else if (product[opposite].includes(req.id)) {
      await Product.findOneAndUpdate(
        { name },
        { $pull: { [opposite]: req.id } }
      );
      await Product.findOneAndUpdate(
        { name },
        { $addToSet: { [selected]: req.id } }
      );
    } else {
      await Product.findOneAndUpdate(
        { name },
        { $addToSet: { [selected]: req.id } }
      );
    }
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(404).json(err);
  }
};

const getUserComment = async (req, res) => {
  try {
    const { name } = req.params;
    const { username, comment } = req.body;
    if (!comment) {
      return res.status(404).json({ msg: "please enter your comment!" });
    }
    await Product.findOneAndUpdate(
      { name },
      {
        $addToSet: { comments: { username, comment } },
      }
    );
    res.status(200).json();
  } catch (err) {
    res.status(404).json(err);
  }
};

const deleteUsercomment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const product = await Product.findOne({ name });
    const productComment = product.comments.find((item) => item._id == id);
    await Product.findOneAndUpdate(
      { name },
      { $pull: { comments: productComment } }
    );
    res.status(200).json();
  } catch (err) {
    res.status(404).json(err);
  }
};

const getAllProductComments = async (req, res) => {
  try {
    const { name } = req.params;
    const product = await Product.findOne({ name });
    const productComment = product.comments.sort(
      (a, b) => b.updatedAt - a.updatedAt
    );
    res.status(200).json(productComment);
  } catch (err) {
    res.status(404).json(err);
  }
};

const editUsercomment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const product = await Product.findOne({ name });
    const usercomment = product.comments.find((item) => item._id == id);
    res.status(200).json({ comment: usercomment.comment });
  } catch (err) {
    res.status(404).json(err);
  }
};

const submitEditedComment = async (req, res) => {
  try {
    const { comment, id } = req.body;
    await Product.findOneAndUpdate(
      { "comments._id": id },
      { $set: { "comments.$.comment": comment } }
    );
    res.status(200).json();
  } catch (err) {
    res.status(404).json(err);
  }
};

module.exports = {
  getAllProducts,
  updateLikesAndDislikes,
  getUserComment,
  deleteUsercomment,
  editUsercomment,
  submitEditedComment,
  getAllProductComments,
};
