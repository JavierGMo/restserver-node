const express = require('express');

const app = express();

app.use(require('./usuario'));
//login
app.use(require('./login'));


module.exports = app;