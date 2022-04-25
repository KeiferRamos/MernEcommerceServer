const {
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
} = require("../controller/users");
const router = require("express").Router();
const { verify } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/update", verify, update);
router.get("/hasLoggedIn", hasLoggedIn);
router.get("/", verify, getUser);
router.route("/cart").patch(verify, updateQuantity).post(verify, addToCart);
router.patch("/totalPrice", verify, getTotal);
router.post("/add-info", verify, addInfo);
router.patch("/clearcart", verify, clearCart);
router.patch("/order", verify, orderRecieved);

module.exports = router;
