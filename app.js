const express = require('express');
const passport = require('passport');
const cors = require('cors');

const app = express();

//init .env file read
//require('dotenv').config();
const PORT = process.env.PORT || 3000;

//set CORS
app.use(cors());

app.use(require('./routes'));

app.listen(PORT);


