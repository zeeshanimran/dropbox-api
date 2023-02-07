const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morganLogger = require("morgan");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const environment = require("dotenv");
const cors = require("cors");
var path = require("path");

environment.config();

const app = express();

app.use(express.static(path.resolve("./public")));

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.options("*", cors());
app.use(cors());

const run = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
run();

app.use(morganLogger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 3600000 },
  })
);

app.use(function (err, req, res, next) {
  if (err.message)
    res.status(404).json({ status: false, message: err.message });
  else if (err.status === 404) res.status(404).json({ message: "Not found" });
  else res.status(500).json({ message: "Something looks wrong :( !!!" });
});
require("./Routes/index.js")(app);

app.listen(process.env.PORT || 4200, function () {
  console.log("Node server listening on port 4200");
});
