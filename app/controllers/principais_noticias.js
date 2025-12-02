module.exports.principais_noticias = function(app,req,res){
    var connection = app.config.dbConnection();    
      var principaisNoticiasModel = new app.app.models.manchetesDAO(connection);
      principaisNoticiasModel.getPrincipaisNoticias(function(error,result){
       res.render("noticias/principais_noticias",{JNoticias : result, flagAdmin : req.session.autorizado});
      });
}
module.exports.noticia = function(app,req,res){
    var connection = app.config.dbConnection();    
    var noticiaModel = new app.app.models.manchetesDAO(connection);
    var id_noticia = req.query;
    noticiaModel.getNoticia(id_noticia,function(error,result){
      res.render("noticias/noticia",{JNoticias : result, flagAdmin : req.session.autorizado});
    });
}


