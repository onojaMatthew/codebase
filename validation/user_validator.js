const {check, validationResult} = require('express-validator');
const { options } = require('../apis/auth');

exports.validateUser = [
  check('firstName')
    .isLength({ min: 3 }).withMessage("First name must be at least 3 characters long"),
  check("firstName")
    .isAlpha().withMessage("Invalid name. First name must be alphabets"),
  check("firstName")
    .exists().withMessage("First name is not provided"),
  check("firstName").isLength({ max: 20 }).withMessage("First name is too long. Use a maximum of 20 characters"),

  check('lastName')
    .isLength({ min: 3 }).withMessage("Last name must be at least 3 characters long"),
  check("lastName")
    .isAlpha().withMessage("Invalid name. Last name must be alphabets"),
  check("lastName")
    .exists().withMessage("Last name is not provided"),
  check("lastName").isLength({ max: 20 }).withMessage("Last name is too long. Use a maximum of 20 characters"),
  check("email").isEmail().withMessage("Invalid email"),
  check("phone").isMobilePhone(options, "en-NG").withMessage("Invalid phone number"),
  check('password')
    .isLength({ min:8 })
    .withMessage("Password must be at least 6 characters long"),
  check("password")
    .matches('[0-9]').withMessage("Password must contain a number"),
  check("password")
    .matches('[a-z]').withMessage("Password must contain lowercases"),
  check("password")
    .matches('[A-Z]').withMessage("Password must contain at least on uppercase letter"),
  function(req, res) {

    var errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json(errors.array());
    } else {
        res.sendStatus(200);
    }
  }
]

// exports.validateUser = [
//   check('firstName')
//     .trim()
//     .escape()
//     .not()
//     .isEmpty()
//     .withMessage('First name can not be empty!')
//     .bail()
//     .isLength({min: 3})
//     .withMessage('Minimum 3 characters required!')
//     .bail(),
//   check('email')
//     .trim()
//     .normalizeEmail()
//     .not()
//     .isEmpty()
//     .withMessage('Invalid email address!')
//     .bail(),
//   (req, res, next) => {
//     const errors = validationResult(req);
//     console.log(errors)
//     if (!errors.isEmpty())
//       return res.status(400).json({errors: errors.array()});
//     next();
//   },
// ];