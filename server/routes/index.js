const express = require('express');

const app = express();

//ruta para el ususario
app.use(require('./usuario'));
//login
app.use(require('./login'));
//ruta para categorias
app.use(require('./categoria'));
//ruta de producto
app.use(require('./producto'));
//ruta para subir imagenes
app.use(require('./upload'));
//ruta de imagenes
app.use(require('./imagenes'));





module.exports = app;