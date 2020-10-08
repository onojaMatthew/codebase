const error = require("../config/error");
const authRoutes = require("../apis/auth");

module.exports = (app) => {
  app.use("/api", authRoutes);
  app.use(error);
}