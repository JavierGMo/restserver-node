const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');



let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es oblifatoria']
    },
    //no es obligatoria
    img: {
        type: String,
        required: false
    },
    //default: 'USER_ROLE'
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    //boolean
    estado: {
        type: Boolean,
        default: true
    },
    //boolean
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser unico'
});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;

}

module.exports = mongoose.model('Usuario', usuarioSchema);