module.exports.form_add_noticia = function(app,req,res){
    if(req.session.autorizado){
        res.render("admin/form_add_noticia",{validacao:{},noticia:{},flagAdmin : req.session.autorizado});
    }else{
        var erro = [];
        erro.push({ msg: 'Usuário precisa fazer login!' });
        res.render("admin/form_login",{validacao: erro, flagAdmin : req.session.autorizado});
    }    
}
module.exports.noticias_salvar = function(app,req,res){
    var noticia = req.body;
    if(req.file != undefined){
        noticia.img = req.file.filename;
    }
    req.assert('titulo','Título é obrigatório').notEmpty();
    req.assert('resumo','Resumo é obrigatório').notEmpty();
    req.assert('resumo','Resumo deve conter entre 10 e 100 caracteres').len(10,100);
    req.assert('autor','Autor é obrigatório').notEmpty();
    req.assert('data_noticia','Data é obrigatório').notEmpty().isDate({format: 'YYYY-MM-DD'});
    req.assert('texto','A notícia é obrigatória').notEmpty();
    var erros = req.validationErrors();
    if(erros){
        res.render("admin/form_add_noticia",{validacao : erros, noticia: noticia, flagAdmin : req.session.autorizado});
        return;
    }
    var connection = app.config.dbConnection();
    var salvarNoticiaModel = new app.app.models.manchetesDAO(connection);
    salvarNoticiaModel.salvarNoticia(noticia, function(error,result){
        res.redirect('/principaisnoticias');
    });
}
module.exports.form_login = function(app,req,res){
    res.render("admin/form_login",{validacao:{}, flagAdmin : req.session.autorizado});
}
module.exports.login_autenticar = function(app,req,res){
    var camposDeUsuario = req.body;
    req.assert('usuario','Usuário é obrigatório').notEmpty();
    req.assert('senha','Senha é obrigatória').notEmpty();
    var erros = req.validationErrors();
    if(erros){
        res.render("admin/form_login",{validacao : erros, flagAdmin : req.session.autorizado});
        return;
    }
    var connection = app.config.dbConnection();  
    var autenticacao = new app.app.models.manchetesDAO(connection);
    autenticacao.getLogin(camposDeUsuario, function(error,result){
       if (result.length == 0){     
            var erro = [];
            erro.push({ msg: 'Usuário ou senha incorretos!' });
            res.render("admin/form_login",{validacao: erro, flagAdmin : req.session.autorizado});
            return;
       }
       req.session.autorizado = true;
       res.redirect('/');
    });
}
module.exports.sair = function(app,req,res){
    req.session.destroy(function(error){
        res.redirect('/');
    });
}

module.exports.delete_noticia = function(app,req,res){
    var connection = app.config.dbConnection();    
    var noticiaModel = new app.app.models.manchetesDAO(connection);
    var id_noticia = req.query;
    noticiaModel.apagaNoticia(id_noticia,function(error,result){
      res.redirect("/principaisnoticias");
    });
}

module.exports.atualize_noticia = function(app,req,res){
    var connection = app.config.dbConnection();    
    var noticiaModel = new app.app.models.manchetesDAO(connection);
    
    var id_noticia = req.query;

    noticiaModel.getNoticia(id_noticia, function(error,result){
      res.render("admin/form_add_noticia",{validacao:{}, noticia:result[0], flagAdmin : req.session.autorizado});
    });
}

module.exports.atualize_noticia_salvar = function(app,req,res){
    var noticia = req.body;

    if(req.file != undefined){
        noticia.img = req.file.filename;
    }

    req.assert('titulo','Título é obrigatório').notEmpty();
    req.assert('resumo','Resumo é obrigatório').notEmpty();
    req.assert('resumo','Resumo deve conter entre 10 e 100 caracteres').len(10,100);
    req.assert('autor','Autor é obrigatório').notEmpty();
    req.assert('data_noticia','Data é obrigatório').notEmpty().isDate({format: 'YYYY-MM-DD'});
    req.assert('texto','A notícia é obrigatória').notEmpty();
    var erros = req.validationErrors();

    if(erros){
        res.render("admin/form_add_noticia",{validacao : erros, noticia: noticia, flagAdmin : req.session.autorizado});
        return;
    }

    var connection = app.config.dbConnection();
    var noticiaModel = new app.app.models.manchetesDAO(connection);

    noticiaModel.atualizaNoticia(noticia, function(error,result){
        res.redirect('/principaisnoticias');
    });
}