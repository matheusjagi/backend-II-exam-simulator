module.exports = function(app){
    app.get('/add_noticia',function(req,res){
        app.app.controllers.admin.form_add_noticia(app,req,res);
    });
    app.post('/salvar',app.upload.single("file"),function(req,res){
        app.app.controllers.admin.noticias_salvar(app,req,res);
    });
    app.post('/autenticar',function(req,res){
        app.app.controllers.admin.login_autenticar(app,req,res);
    });
    app.get('/login',function(req,res){
        app.app.controllers.admin.form_login(app,req,res);
    });
    app.get('/sair',function(req,res){
        app.app.controllers.admin.sair(app,req,res);
    });
    app.get('/apagar_noticia',function(req,res){
        app.app.controllers.admin.delete_noticia(app,req,res);
    });
    app.get('/atualizar_noticia',function(req,res){
        app.app.controllers.admin.atualize_noticia(app,req,res);
    });
    app.post('/atualizar_noticia',app.upload.single("file"),function(req,res){
        app.app.controllers.admin.atualize_noticia_salvar(app,req,res);
    });
}

