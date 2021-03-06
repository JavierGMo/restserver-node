/**
 * *****
 * Puerto
 * *****
 */
process.env.PORT = process.env.PORT || 3000;


/**
 * Entorno
 * 
 * 
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


/**
 * Vencimiento del token
 * 
 * 60 seg
 * 60 min
 * 24 hrss
 * 30 dias
 * 
 */


process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


/**
 * 
 * Seed de autenticacion
 * 
 */

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


/**
 * base de datos
 */


let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


/**
 * 
 * 
 * 
 * google client ID
 * 
 * 
 * 
 */

process.env.CLIENT_ID = process.env.CLIENT_ID || "316065372174-nvho1nqicdcd61pqba9s3u6bvvmak9sl.apps.googleusercontent.com";