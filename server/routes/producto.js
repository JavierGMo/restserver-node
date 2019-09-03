const express = require('express');

const {verificaToken} = require('../middlewares/autenticacion');

let app = express();
let Producto =  require('../models/producto');


/**
 * obtnet el producto
 */

 app.get('/productos', verificaToken, (req, res) => {
    //trae todo los productos
    //populate: usuario categoria
    // paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);
    Producto.find({disponible: true})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productoDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            productos: productoDB
        });

    });
 });

 app.get('/productos/:id', verificaToken, (req, res) => {
    //populate: usuario categoria
    //paginado

    let id = req.params.id;

    Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productoDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no es correcto'
                }
            });
        }

        //caso contrario
        return res.json({
            ok: true,
            producto: productoDB
        });
    });


 });

//buscar productos

app.get('/productos/buscar/:termino', verificaToken, (req, res)=>{

    let termino = req.params.termino;
    let regex =  new RegExp(termino, 'i');

    Producto.find({nombre: regex})
    .populate('categoria', 'nombre')
    .exec((err, productos)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productos
        });



    });
});


//Agregar producto
 app.post('/productos', verificaToken, (req, res) => {
    //grabar el usuario
    // grabar una categoria del listado

    let body = req.body;


    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id 
    });


    
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            productos: productoDB
        });


    });


 });
//Actualizar un nuevo producto
 app.put('/productos/:id', verificaToken,(req, res) => {


    let id = req.params.id;
    
    let body = req.body;

    let descProducto = {
        descripcion: body.descripcion
    }

    Producto.findByIdAndUpdate(id, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }else{/**quitarlo por si no funciona xd */

            productoDB.nombre = body.nombre;
            productoDB.precioUni = body.precioUni;
            productoDB.categoria = body.categoria;
            productoDB.disponible = body.disponible;
            productoDB.descripcion = body.descripcion;
        }

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos: productoGuardado
            });

        });

        
    });




 });
 //borrar un producto
 app.delete('/productos/:id', (req, res) => {
    //borrar un producto

    let id = req.params.id;

    Producto.findById(id, (err, productoDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id no existe'
                }
            });
        }

        productoDB.disponible = false;
        productoDB.save((err, productoBorrado)=>{

            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });

            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto borrado'
            });
        });



    });

    
 });


 module.exports = app;