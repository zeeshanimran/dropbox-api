const Files = require("./model");
const fs = require("fs");

const uploadBasePath = "./public/uploads/";

module.exports = {
  Upload: async (req, res) => {
    try {
      let file = {};
      if (!req.files) {
        res.status(401).json({
          status: false,
          message: "No file uploaded",
        });
      } else {
        let upload = req.files.file;

        //Use the mv() method to place the file in the upload directory (i.e. "uploads")

        const { name, mimetype, size } = upload;
        file = await Files.create({
          name: name,
          extension: mimetype,
          size: size,
          user: req.decoded._id,
        });
        const filePath = file.id + "." + name.split(".")[1];
        await Files.updateOne(
          { _id: file.id },
          {
            $set: {
              path: "/uploads/" + filePath,
            },
          }
        );
        upload.mv(uploadBasePath + filePath);
        file = await Files.findOne({ _id: file.id });
        return res.status(200).json({
          status: true,
          message: "File is uploaded",
          data: file,
        });
      }
    } catch (error) {
      return res.status(200).json({
        status: true,
        message: "File uploaded successfully",
      });
    }
  },
  List: async (req, res) => {
    try {
      let files = [];
      files = await Files.find({
        user: req.decoded._id,
      }).sort({ createdAt: -1 });
      return res.status(200).json({
        status: true,
        data: files,
      });
    } catch (error) {
      return res.status(200).json({
        status: true,
        message: "File uploaded successfully",
      });
    }
  },
  Read: async (req, res) => {
    try {
      let file = {};
      file = await Files.findOne({ _id: req.params.id });
      if (!file) {
        return res.status(404).json({
          status: false,
          message: "No such file",
        });
      }
      return res.status(200).json({
        status: true,
        data: file,
      });
    } catch (error) {
      return res.status(200).json({
        status: true,
        message: "File uploaded successfully",
      });
    }
  },
  Update: async (req, res) => {
    try {
      let file = {};
      const id = req.params.id;
      await Files.updateOne(
        { _id: id },
        {
          $set: req.body,
        }
      );
      file = await Files.findOne({ _id: id });
      return res.status(200).json({
        status: true,
        data: file,
        message: "File updated successfully",
      });
    } catch (error) {
      return res.status(200).json({
        status: true,
        message: "File uploaded successfully",
      });
    }
  },
  Delete: async (req, res) => {
    try {
      const id = req.params.id;
      const file = await Files.findOne({ _id: id });
      await Files.deleteOne({ _id: id });
      fs.unlinkSync(uploadBasePath + file.name);
      return res.status(200).json({
        status: true,
        message: "File deleted successfully",
      });
    } catch (error) {
      return res.status(200).json({
        status: true,
        message: "File uploaded successfully",
      });
    }
  },
};
