module.exports = function(app){
    app.get('/principaisnoticias',function(req,res){       
      app.app.controllers.principais_noticias.principais_noticias(app,req,res);
    });
    app.get('/noticia',function(req,res){       
      app.app.controllers.principais_noticias.noticia(app,req,res);
  });
}

