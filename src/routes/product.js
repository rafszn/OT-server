const express = require("express");
const upload = require("../middlewares/multerUpload");
const verifyAuthToken = require("../middlewares/verifyAuthToken");
const {
  createProduct,
  getProducts,
  getProductById,
} = require("../controllers/product");
const router = express.Router();

router.post(
  "/",
  verifyAuthToken,
  upload.fields([
    { name: "productImages", maxCount: 6 },
    { name: "productVideo", maxCount: 1 },
  ]),
  createProduct
);
router.get("/", getProducts);

router.get("/:id", getProductById);

module.exports = router;
