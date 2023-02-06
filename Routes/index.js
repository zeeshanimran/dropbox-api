module.exports = (app) => {
  app.use("/api/users", require("../App/Users/routes"));
  app.use("/api/files", require("../App/Files/routes"));
};
