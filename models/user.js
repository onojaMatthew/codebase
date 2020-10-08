const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  firstName: { type: String, minlength: 5, maxlength: 50, required: true },
  lastName: { type: String, minlength: 3, maxlength: 40, required: true },
  password: { type: String, required: true, minlength: 5 },
  phone: { type: String, minlength: 11, maxlength: 11},
  code: { type: Number, expires: "5m" },
  resetPasswordToken: { type: String, required: false },
  resetPasswordExpires: { type: Date, required: false },
  verificationCode: { type: Number, },
  role: { type: String, enum: [ "user" ], default: "user" }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

exports.User = User;

