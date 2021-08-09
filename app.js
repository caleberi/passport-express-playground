require("dotenv").config();
const express = require("express");
const authRoute = require("./routes/auth");
const app = express();
const passport = require("./config/passport");
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

mongoose.Promise = global.Promise;
mongoose
  .connect(
    process.env.MONGODB_URI,
    Object.assign(
      {},
      { useUnifiedTopology: true, useCreateIndex: true, useNewUrlParser: true }
    )
  )
  .then(() => {
    console.log("Connected to MongoDB.");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: ", err);
  });

app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 24 },
    resave: false,
  })
);

app.use(passport.session());
app.get("/", (req, res) => {
  res.render("home");
});

app.use("/auth", authRoute());

app.listen(process.env.PORT, () => {
  console.log("Listening on port " + process.env.PORT);
});
