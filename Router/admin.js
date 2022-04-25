const express = require("express");
const {
  hasLoggedIn,
  addcustomerOrder,
  renderView,
  deliverOrders,
} = require("../controller/admin");
const { verify } = require("../middleware/auth");
const router = express();

router.route("/login").post(hasLoggedIn);
router
  .route("/")
  .post(verify, addcustomerOrder)
  .get(renderView)
  .patch(deliverOrders);

module.exports = router;
