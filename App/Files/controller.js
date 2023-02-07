const {
  uploadFile,
  listFiles,
  findAFile,
  updateFile,
  deleteFile,
} = require("./services");

module.exports = {
  Upload: async (req, res) => {
    try {
      let file = {};
      file = await uploadFile(req.files.file, req.decoded._id);
      console.log("file in controller", file);
      if (file) {
        return res.status(200).json({
          status: true,
          message: "File is uploaded",
          data: file,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },
  List: async (req, res) => {
    try {
      let files = [];
      files = await listFiles(req.decoded._id);
      return res.status(200).json({
        status: true,
        data: files,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },
  Read: async (req, res) => {
    try {
      let file = {};
      const { id } = req.params;
      file = await findAFile(id);
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
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },
  Update: async (req, res) => {
    try {
      let file = {};
      const { id } = req.params;
      file = await updateFile(id, req.body);
      return res.status(200).json({
        status: true,
        data: file,
        message: "File updated successfully",
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
      await deleteFile(id);
      return res.status(200).json({
        status: true,
        message: "File deleted successfully",
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },
};
