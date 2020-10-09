const express = require("express");
const {
  createUser,
  signIn,
  verifyCode,
  recover,
  reset,
  resetPassword,
  sendOTP,
  googlelogin,
  facebooklogin,
} = require("../controller/auth");

const router = express.Router();

router.post("/signup/:userType", createUser);
router.post("/login/:userType", signIn);
router.post("/googlelogin", googlelogin);
router.post("/facebooklogin", facebooklogin);
router.post("/send_otp/:userType", sendOTP);
router.put("/verify_otp/:userType", verifyCode);
router.put("/recover/:userType", recover);
router.get("/reset/:token/:userType", reset);
router.put("/reset_password/:userType", resetPassword);

module.exports = router;