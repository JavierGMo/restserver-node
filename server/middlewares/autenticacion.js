const jwt = require('jsonwebtoken');


/**
 * 
 * 
 *  Verificar token 
 * 
 *
 */

let verificaToken = (req, res, next) => {

    let token = req.get('token'); //nombre de los headers

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //console.log(token);

        req.usuario = decoded.usuario;

        next();


    });


}

let verificaAdmin = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'No tienes permisos'
            }
        });
    }




}

//verifica token para imagen

let verificaTokenImg = (req, res, next)=>{
    let token = req.query.token;


    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        //console.log(token);

        req.usuario = decoded.usuario;

        next();


    });


}


module.exports = {
    verificaToken,
    verificaAdmin,
    verificaTokenImg
}