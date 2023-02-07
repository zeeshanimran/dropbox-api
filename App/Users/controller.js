const {
  updateUser,
  deleteUser,
  userLogin,
  createAUser,
} = require("./services");

module.exports = {
  Create: async (req, res) => {
    try {
      await createAUser(req.body);
      return res.status(200).json({
        status: "Successful!",
        message: "Successfully Registered user",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },
  Login: async (req, res) => {
    try {
      const { err, user } = await userLogin(req.body);
      if (err) {
        return res.status(409).json({
          status: false,
          message: err,
        });
      }
      return res.status(200).json({
        status: true,
        message: "Successfully Logged In",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },
  Delete: async (req, res) => {
    try {
      const { id } = req.params;
      await deleteUser(id);
      return res.status(200).json({
        status: true,
        message: "Successfully Deleted User",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },
  Update: async (req, res) => {
    try {
      let user = {};
      const { id } = req.params;
      user = await updateUser(id, req.body);
      return res.status(200).json({
        status: true,
        message: "Successfully Updated",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },
};
