var mysql = require('mysql');
var connMySQL = function(){
    console.log("Conexão com DB criada!");
    return mysql.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'root',
        database : 'portalnews'
    }); 
}
module.exports = function(){
    console.log("Módulo de conexão com DB carregado!");
    return connMySQL;
}
        
