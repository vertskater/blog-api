const express = require("express");
const passport = require("passport");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
// Pass the global passport object into the configuration function
require("./config/passport")(passport);
// This will initialize the passport object on every request
app.use(passport.initialize());

//set CORS
app.use(cors());

app.use(require("./routes"));

app.listen(PORT);
