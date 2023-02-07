const Users = require("./model");
const jwt = require("jsonwebtoken");
const environment = require("dotenv");

environment.config();

exports.createAUser = async (payload) => {
  let { name, email, password } = payload;
  let token = "";
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
  return;
};

exports.userLogin = async (payload) => {
  let { email, password } = payload;
  let token = "";
  let user = {};
  user = await this.findByEmail(email);
  if (!user) {
    return {
      err: "Email/Password Incorrect",
    };
  } else {
    let isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return {
        err: "Email/Password Incorrect",
      };
    } else {
      token = jwt.sign({ _id: user.id.toString() }, process.env.TOKEN_SECRET);
      await Users.updateOne(
        { _id: user.id },
        {
          token: token,
        }
      );
      user = await this.findAUser(user.id);
      console.log(user);
      return {
        user,
      };
    }
  }
};

exports.findAUser = async (id) => {
  return Users.findOne({ _id: id }, { password: 0 });
};
exports.findByEmail = async (email) => {
  return Users.findOne({ email: email });
};
exports.listUsers = async () => {
  return Users.find({});
};

exports.updateUser = async (id, body) => {
  let { name, email } = body;
  await Users.updateOne(
    { _id: id },
    {
      name: name,
      email: email,
    }
  );
  return this.findAUser(id);
};

exports.deleteUser = async (id) => {
  return Users.deleteOne({ _id: id });
};
