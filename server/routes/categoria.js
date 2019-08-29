const express = require('express');
const _ = require('underscore');

const Categoria = require('../models/cateogira');

const { verificaToken, verificaAdmin } = require('../middlewares/autenticacion');


const app = express();


const bodyParser = require('body-parser');

app.use(bodyParser.json());

//devuelve todas las categorias
app.get('/categoria', verificaToken, (req, res) => {
    //Traer todas las categoria
    Categoria.find()
    .sort('descripcion')
    .populate('usuario'/*nombre de la tabla*/, 'nombre email')
    .exec((err, categoriadb) => {
        //si salta un error
        if(err){
            return res.json({
                ok: false,
                err
            });
        }
        //caso contrario
        return res.json({
            ok: true,
            categoria: categoriadb
        });

    });
});

//devuelve una categoria por id
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriadb) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriadb){
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El Id no es correcto'
                }
            });
        }

        //caso contrario
        return res.json({
            ok: true,
            categoria: categoriadb
        });
    });
});


//Crea una categoria
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;


    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriadb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoria){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriadb
        })


    });
});

//actualiza una categoria
app.put('/categoria/:id', verificaToken, (req, res) => {
    
    let id = req.params.id;
    
    let body = req.body;

    let descCategoria= {
        descripcion: body.descripcion
    }

    Usuario.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriadb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!categoriadb){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriadb
        });
    });

});

//borra una categoria
app.delete('/categoria/:id', [verificaToken, verificaAdmin],(req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriadb) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!categoriadb){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        });
    });

});

module.exports = app;