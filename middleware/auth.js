const jwt = require("jsonwebtoken");

const verify = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ msg: "unathourized" });
    }

    const verified = jwt.verify(token, process.env.JWT_PASSWORD);
    if (!verified) {
      return res.status(401).json({ msg: "unathourized" });
    }
    req.id = verified.id;
    next();
  } catch (err) {
    res.status(404).json(err);
  }
};

module.exports = { verify };
