require('./config/config');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));


app.use(require('./routes/usuario.js'));

// parse application/json



//conexion a la base de datos
mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;

    console.log('Base de datos concetada');

});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);



app.listen(process.env.PORT, () => {
    console.log("Escucahndo en el puerto: ", process.env.PORT);
});