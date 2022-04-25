const {
  getAllProducts,
  updateLikesAndDislikes,
  getUserComment,
  deleteUsercomment,
  editUsercomment,
  submitEditedComment,
  getAllProductComments,
} = require("../controller/products");
const router = require("express").Router();
const { verify } = require("../middleware/auth");

router.get("/", verify, getAllProducts);
router.patch("/:name/:selected/:opposite", verify, updateLikesAndDislikes);
router.patch("/comments/:name", getUserComment);
router.patch("/deletecomment/:id", deleteUsercomment);
router.patch("/usercomment/:id", editUsercomment);
router.patch("/editcomment", submitEditedComment);
router.get("/allcomments/:name", getAllProductComments);

module.exports = router;
