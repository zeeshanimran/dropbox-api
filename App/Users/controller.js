const Users = require("./model");
const jwt = require("jsonwebtoken");
const environment = require("dotenv");

environment.config();

module.exports = {
  Create: async (req, res) => {
    try {
      let { name, email, password } = req.body;
      let token = "";
      const alreadyExist = await Users.findOne({ email: email }).count();
      if (alreadyExist) {
        return res.status(409).json({
          status: false,
          errEmail: "Email already Taken",
        });
      }
      const user = await Users.create({
        name: name,
        email: email,
        password: password,
      });
      token = jwt.sign({ _id: user.id.toString() }, process.env.TOKEN_SECRET);
      await Users.updateOne(
        { _id: user.id },
        {
          token: token,
        }
      );
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
      let { email, password } = req.body;
      let token = "";
      const user = await Users.findOne({ email: email });
      if (!user) {
        return res.status(409).json({
          status: false,
          errEmail: "Email does not exist",
        });
      } else {
        let isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return res.status(409).json({
            status: false,
            errPassword: "Incorrect Password",
          });
        } else {
          token = jwt.sign(
            { _id: user.id.toString() },
            process.env.TOKEN_SECRET,
            { expiresIn: "7 days" }
          );
          await Users.updateOne(
            { _id: user.id },
            {
              token: token,
            }
          );
          user.token = token;
          user.password = undefined;
          return res.status(200).json({
            status: true,
            message: "Successfully Logged In",
            data: user,
          });
        }
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },
  Delete: async (req, res) => {
    try {
      const id = req.params.id;
      const removeuser = await Users.deleteOne({ _id: id });
      if (removeuser.ok === 1) {
        return res.status(200).json({
          status: true,
          message: "Successfully Deleted User",
        });
      } else {
        throw new Error("Could not delete. Try Again");
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },
  Update: async (req, res) => {
    try {
      let { name, email } = req.body;
      let id = req.params.id;
      const alreadyExist = await Users.findOne({
        _id: id,
        email: { $ne: email },
      }).count();
      if (!alreadyExist) {
        return res.status(409).json({
          status: false,
          errEmail: "Email already Taken",
        });
      } else {
        const user = await Users.updateOne(
          { _id: id },
          {
            name: name,
            email: email,
          }
        );
        return res.status(200).json({
          status: true,
          message: "Successfully Updated",
          data: user,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },
};
