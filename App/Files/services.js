const Files = require("./model");

const fs = require("fs");

const uploadBasePath = "./public";

exports.uploadFile = async (uploadFile, userId) => {
  const { name, mimetype, size } = uploadFile;
  let file = {};
  file = await Files.create({
    name: name,
    extension: mimetype,
    size: size,
    user: userId,
  });
  const filePath = "/uploads/" + file.id + "." + name.split(".")[1];
  await Files.updateOne(
    { _id: file.id },
    {
      $set: {
        path: filePath,
      },
    }
  );
  uploadFile.mv(uploadBasePath + filePath);
  return await this.findAFile(file.id);
};

exports.listFiles = async (userId) => {
  console.log(userId);
  return await Files.find({
    user: userId,
  }).sort({ createdAt: -1 });
};

exports.findAFile = async (id) => {
  return await Files.findOne({ _id: id });
};

exports.updateFile = async (id, body) => {
  await Files.updateOne(
    { _id: id },
    {
      $set: body,
    }
  );
  return this.findAFile(id);
};

exports.deleteFile = async (id) => {
  const file = await this.findAFile(id);
  await Files.deleteOne({ _id: id });
  fs.unlinkSync(uploadBasePath + file.path);
  return;
};
