const express = require("express");
const {
  createUser,
  signIn,
  verifyCode,
  recover,
  reset,
  resetPassword,
} = require("../controller/auth");

const router = express.Router();

router.post("/auth/signup", createUser);
router.post("/auth/login", signIn);

router.put("/auth/recover", recover);
router.get("/auth/reset/:token", reset);
router.put("/auth/reset_password", resetPassword);

module.exports = router;