const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  fullName: { type: String, minlength: 5, maxlength: 50 },
  password: { type: String, required: true, minlength: 5 },
});

const User = mongoose.model("User", userSchema);

exports.User = User;