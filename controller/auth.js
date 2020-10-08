const { Admin } = require("../models/admin");
const { Customer } = require("../models/customer");
const { sendEmail } = require("../services/mailer");
const { codeGenerator } = require("../services/code_generator");
const bcrypt = require("bcrypt");

exports.createUser = (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  const { userType } = req.params;
  let User;
  if (!userType) return res.status(400).json({ error: "Invalid parameter value userType" });
  if (!firstName) return res.status(400).json({ error: "First name is required" });
  if (!lastName) return res.status(400).json({ error: "Your last name is required" });
  if (!email) return res.status(400).json({ error: "Email is required" });
  if (!password) return res.status(400).json({ error: "Password is required" });
  if (!phone) return res.status(400).json({ error: "Phone number is required" });

  switch(userType) {
    case "customer": 
      User = Customer;
      break;
    case "admin": 
      User = Admin;
      break;
    case "user": 
      User = Admin;
      break;
    default: return res.status(403).json({ error: "Unknown user type"  });
  }

  User.findOne({ email })
    .then(user => {
      if (user) return res.status(400).json({ error: "User already exists" });
      return bcrypt.hash(password, 12)
        .then(hashedPassword => {
          if (!hashedPassword) return res.status(400).json({ error: "Could not hash password" });
          let newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            phone: req.body.phone,
            role: req.params.userType
          });
          const code = newUser.verificationCode(codeGenerator());
          newUser.save()
            .then(async (resp) => {
              if (!resp) return res.status(400).json({ error: "Failed to save user" });
              const emailData = {
                subject: "Email verification code",
                sender: "Rusomo",
                receiver: req.body.email,
                message: `<p>To verify and login to your Rusumo application, copy and paste this 6 digits code: ${code} in your application`,
              }
            sendEmail(emailData);
            return res.json({ message: `A verification code was sent to your email`, resp, code });
            });
        });
    })
    .catch(err => {
      res.status(400).json({ error: err.message });
    });
}

exports.signIn = (req, res) => {
  const { email, password } = req.body;
  const { userType } = req.params;
  let User;
  if (!userType) return res.status(400).json({ error: "Invalid parameter value userType" });
  if (!email) return res.status(400).json({ error: "Email is required" });
  if (!password) return res.status(400).json({ error: "Your password is required" });

  switch(userType) {
    case "customer":
      User = Customer;
      break;
    case "user":
      User = Admin;
      break;
    case "admin":
      User = Admin;
      break;
    default: return res.status(403).json({ error: "Unknown user type" });
  }

  User.findOne({ email })
    .then(user => {
      if (!user) return res.status(400).json({ error: "User does not exist" });
      return bcrypt.compare(password, user.password)
        .then(async (matched) => {
          if (!matched) return res.status(400).json({ error: "Password do not match" });
          const token = user.generateToken();
          const isVerified = user.emailVerified
          const { email, firstName, lastName, phone, _id } = user;
          res.cookie("token", token, { expires: new Date(new Date() + 64800000)});
          res.header("x-auth-token", token).json({ token, user: { email, firstName, lastName, phone, _id, isVerified }});
        });
    })
    .catch(err => {
      res.status(400).json({ error: err.message });
    });
}

exports.verifyCode = (req, res) => {
  const { code, userType } = req.params;
  let User;
  if (!code) return res.status(400).json({error: "Invalid code sent. Check and try again" });
  if (!userType) return res.status(400).json({ error: "Unknown user type" });

  switch(userType) {
    case "customer":
      User = Customer;
      break;
    case "user":
      User = Admin;
      break;
    case "admin":
      User = Admin;
      break;
    default: return res.status(403).json({ error: "Unknown user type" });
  }

  const toNum = Number(code)
  User.findOne({ code: toNum })
    .then(user => {
      if (!user) return res.status(400).json({ error: "Invalid code or the code has expired" });
      user.code = null;
      user.verificationCodeExpires = null;
      user.emailVerified = true;
      user.save((err, doc) => {
        if (err || !doc) return res.status(400).json({ error: err.message });
        return res.json({ message: "Email verified" });
      });
    })
    .catch(err => {
      res.status(400).json({ error: err.message });
    });
}

// @desc Recover Password - Generates token and Sends password reset email
// @access Public
exports.recover = (req, res) => {
  const { email } = req.body;
  const { userType } = req.params;
  if (!userType) return res.status(400).json({ error: "User type is required" });
  if (!email) return res.status(400).json({ error: "Email is required" });
  
  switch(userType) {
    case "customer":
      User = Customer;
      break;
    case "admin":
      User = Admin;
      break;
    case "user":
      User = Admin;
      break;
    default: return res.status(403).json({ error: "Unknown user type" });
  }

  User.findOne({ email })
    .then(user => {
      if (!user) return res.status(401).json({ error: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});

      //Generate and set password reset token
      user.generatePasswordReset();

      // Save the updated user object
      user.save()
        .then(user => {
          // send email
          let link = "http://" + req.headers.host + "/api/v1/auth/reset/" + user.resetPasswordToken
          const receiver = user.email;
          const sender = "Rusumo";
          const subject = "Password change request"
          const message = `Hi ${user.fullName} \n 
          You sent a password reset request. Please click on the following link ${link} to reset your password. \n\n 
          If you did not request this, please ignore this email and your password will remain unchanged.\n`;

          const data = {
            receiver,
            sender,
            subject,
            message
          }
          sendEmail(data);
          return res.status(200).json({ message: 'A reset email has been sent to ' + user.email });
        })
        .catch(err => {
          res.status(500).json({ error: err.message});
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err.message })
    });
};



// @route POST api/auth/reset
// @desc Reset Password - Validate password reset token and shows the password reset view
// @access Public
exports.reset = (req, res) => {
  
  User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }})
    .then((user) => {
        if (!user) return res.status(401).json({ error: 'Password reset token is invalid or has expired.'});

        //Redirect user to form with the email address
        res.redirect("http://" + req.headers.host + "/change_password/" + user.resetPasswordToken);
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err.message});
    });
};

// @route POST api/auth/reset
// @desc Reset Password
// @access Public
exports.resetPassword = (req, res) => {
  const { userType } = req.params;
  let User;
  if (!userType) return res.status(400).json({ error: "Unknown user type" });
  switch(userType) {
    case "customer":
      User = Customer;
      break;
    case "admin":
      User = Admin;
      break;
    case "user":
      User = Admin;
      break;
    default: return res.status(403).json({ error: "Unknown user type" });
  }

  User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: {$gt: Date.now()} })
    .then((user) => {
        if (!user) return res.status(401).json({ error: 'Password reset token is invalid or has expired.'});
      return bcrypt.hash(req.body.password, 12)
        .then(hashPassword => {
          //Set the new password
          user.password = hashPassword;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          // Save
          user.save((err, doc) => {
            if (err) return res.status(500).json({ error: err.message});

            // send email
            const receiver = user.email;
            const sender = "Rusumo";
            const subject = "Password change confirmation";
            const message = `Hi ${user.fullName} \n 
            This is a confirmation that the password for your account ${user.email} has just been changed.\n`;

            const data = {
              receiver,
              sender,
              subject,
              message
            }
            sendEmail(data);
            res.status(200).json({ message: 'Your password has been updated.'});
          });
        })
    })
    .catch(err => {
      return res.status(400).json({ error: err.message });
    });
};