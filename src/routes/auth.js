const express = require("express");
const router = express.Router();
const { userLogin, getUser } = require("../controllers/auth");
const verifyAuthToken = require("../middlewares/verifyAuthToken");

router.post("/sign-in", userLogin);
router.get("/me", verifyAuthToken, getUser);

module.exports = router;
