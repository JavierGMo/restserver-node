const express = require('express');

const fileUpload = require('express-fileupload');

const app = express();

const Usuario = require('../models/usuario');
const Produto = require('../models/producto');


const fs = require('fs');
const path = require('path');


//opciones por defecto
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res)=>{

    let tipo = req.params.tipo;
    let id = req.params.id;

    if(!req.files){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }


    //validar tipo

    let tiposValidos = ['productos', 'usuarios'];

    if(tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No es un tipo permitido'
            }
        });
    }





    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    console.log(nombreCortado[0]);
    console.log(nombreCortado[1]);
    let extension = nombreCortado[nombreCortado.length-1];
    console.log(extension);



    //extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpg'];


    if(extensionesValidas.indexOf(extension)<0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'no es una extension valida para una imagen',
                ext: extension
            }
        });

    }

    //cambiar nombre al archivo

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    console.log(nombreArchivo);
    console.log(nombreArchivo.name);

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //aqui se carga la imagen



            if(tipo == 'usuarios'){
                imagenUsuario(id, res, nombreArchivo);
            }else{
                iamgenProducto(id, res, nombreArchivo);
            }
            

    
    });

});

function imagenUsuario(id, res, nombreArchivo){
    Usuario.findById(id, (err, usuarioDB)=>{
        if(err){
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!usuarioDB){
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }


        
        

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado)=>{


            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            //aqui, la imagen se cargo
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });

    });

}

function iamgenProducto(id, res, nombreArchivo){
        Producto.findById(id, (err, productoDB)=>{
            if(err){
                borraArchivo(nombreArchivo, 'productos');
    
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
    
            if(!productoDB){
                borraArchivo(nombreArchivo, 'productos');
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }
    
    
            
            
    
            borraArchivo(productoDB.img, 'productos');
    
            productoDB.img = nombreArchivo;
    
            productoDB.save((err, productoGuardado)=>{
    
    
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                //aqui, la imagen se cargo
                res.json({
                    ok: true,
                    producto: productoGuardado,
                    img: nombreArchivo
                });
            });
        });

}

function borraArchivo(nombreImagen, tipo){
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
}

module.exports = app;