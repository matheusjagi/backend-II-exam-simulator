function NoticiasDAO(connection){
    this._connection = connection;
}
NoticiasDAO.prototype.getNoticia = function(id_noticia, callback){
    this._connection.query('SELECT * FROM MANCHETES WHERE id = '+ id_noticia.id_noticia,callback);
};
NoticiasDAO.prototype.getPrincipaisNoticias = function(callback){
    this._connection.query('SELECT id, autor, titulo, data_noticia, resumo FROM MANCHETES ORDER BY data_noticia DESC',callback);
};
NoticiasDAO.prototype.getUltimasNoticias = function(callback){
    this._connection.query('SELECT id, autor, titulo, data_noticia, resumo FROM MANCHETES ORDER BY data_noticia DESC LIMIT 5',callback);
}
NoticiasDAO.prototype.salvarNoticia = function(noticia,callback){
    this._connection.query('INSERT INTO MANCHETES SET ?',noticia,callback);
};
NoticiasDAO.prototype.getLogin = function(camposDeUsuario, callback){    
    this._connection.query('SELECT id FROM usuarios WHERE usuario = "'+ camposDeUsuario.usuario + '" AND senha = ' + camposDeUsuario.senha,callback);
};
NoticiasDAO.prototype.apagaNoticia = function(id_noticia, callback){
    this._connection.query('DELETE FROM MANCHETES WHERE id = '+ id_noticia.id_noticia, callback);
};
NoticiasDAO.prototype.atualizaNoticia = function (noticia, callback) {
    const id = noticia.id_noticia;
    delete noticia.id_noticia;
    this._connection.query('UPDATE MANCHETES SET ? WHERE id = ?', [noticia, id], callback);
}
module.exports = function(){
    return NoticiasDAO;
}

