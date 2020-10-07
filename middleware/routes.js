const error = require("../config/error");

module.exports = (app) => {
  app.use(error);
}