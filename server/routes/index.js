const express = require('express');

const app = express();

app.use(require('./usuario'));
//login
app.use(require('./login'));

app.use(require('./categoria'));



module.exports = app;