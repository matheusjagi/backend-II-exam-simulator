module.exports.index = function(app,req,res){
    var connection = app.config.dbConnection();
    var noticiasModel = new app.app.models.manchetesDAO(connection);
    noticiasModel.getUltimasNoticias(function(error,result){
        res.render("home/index", {noticias : result, flagAdmin : req.session.autorizado});
    });   
}



