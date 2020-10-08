const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminSchema = new Schema({
  email: { type: String, unique: true, required: true },
  fullName: { type: String, minlength: 5, maxlength: 50 },
  password: { type: String, required: true, minlength: 5 },
  phone: { type: String, minlength: 11, maxlength: 11},
  code: { type: Number, expires: "5m" },
  resetPasswordToken: { type: String, required: false },
  resetPasswordExpires: { type: Date, required: false },
  role: { type: String, enum: [ "user" ], default: "user" }
});

const Admin = mongoose.model("Admin", adminSchema);

exports.Admin = Admin;

