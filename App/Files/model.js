const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Reference = Schema.Types.ObjectId;

const FileSchema = new Schema(
  {
    user: {
      type: Reference,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    extension: {
      type: String,
      trim: true,
    },
    size: {
      type: Number,
    },
    path: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const autoPopulate = function (next) {
  this.populate("user", "-password");
  next();
};

FileSchema.pre("find", autoPopulate).pre("findOne", autoPopulate);

module.exports = mongoose.model("File", FileSchema);
