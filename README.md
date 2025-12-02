# 📘 Tutorial do Simulado — Funcionalidade de Atualização de Notícias  
**Disciplina:** Desenvolvimento Backend II  
**Instituição:** IFES — Campus Santa Teresa  
**Professor:** Matheus Jagi

---

## 📰 Objetivo do Tutorial

Neste tutorial, vamos implementar a funcionalidade de **alterar notícias** em uma aplicação Node.js utilizando **Express + EJS + MySQL**.  
A ideia é permitir que o usuário autenticado abra uma notícia cadastrada, edite as informações e atualize no banco de dados.

---

## 📝 1️⃣ Alterações na View (<span style="background-color: #EEEEEE; color: #000000; padding: 2px 4px; border-radius: 3px; font-family: monospace;">views/admin/form_add_noticia.ejs</span>)

Para diferenciar entre **cadastro** e **alteração**, verificamos se existe uma propriedade `id` dentro do objeto `noticia`.  
Se existir → estamos editando.  
Se não → estamos criando uma nova notícia.

---

### 🔹 Botão e campo oculto da notícia

```js
<% if (noticia && noticia.id) { %>
	<button type="submit" class="btn btn-default">Atualizar</button>
	<input type="hidden" name="id_noticia" value="<%= noticia.id %>" />
<% } else { %>
	<button type="submit" class="btn btn-default">Cadastrar</button>
<% } %>
```

---

### 🔹 Definindo rotas do formulário (POST)

```js
<% if (noticia && noticia.id) { %>
	<form action="/atualizar_noticia" method="post" enctype="multipart/form-data">
<% } else { %>
	<form action="/salvar" method="post" enctype="multipart/form-data">
<% } %>
```

---

### 🔹 Formatando o campo de data corretamente durante edição

Quando uma data vem do MySQL como `DATETIME`, usamos `toISOString().substring(0,10)` para preencher o `<input type="date">`.

```js
<% if (noticia && noticia.id) { %>
	<input type="date" class="form-control" id="data_noticia" 
	value="<%= noticia.data_noticia.toISOString().substring(0,10) %>"
	name="data_noticia">
<% } else { %>
	<input type="date" class="form-control" id="data_noticia" value="<%= noticia.data_noticia %>" name="data_noticia">
<% } %>
```

---

## 🌐 2️⃣ Rotas (`routes/admin.js`)

Criamos duas rotas específicas para alteração:

📌 **GET** — Carrega os dados da notícia para edição  
📌 **POST** — Salva as alterações no banco

```js
app.get('/atualizar_noticia', function(req, res){
	app.app.controllers.admin.atualize_noticia(app, req, res);
});

app.post('/atualizar_noticia', app.upload.single("file"), function(req, res){
	app.app.controllers.admin.atualize_noticia_salvar(app, req, res);
});
```

---

## 🎮 3️⃣ Controladora (`controllers/admin.js`)

### 🔹 Método que carrega a notícia selecionada:
O primeiro método é o atualize_noticia, que recebe como parâmetro o id da noticia através do input que colocamos no formulário para trazer suas informações e carregar na tela de atualização. Esse carregamento será feito pelo método **getNoticia**, já criado em nosso DAO.

```js
module.exports.atualize_noticia = function(app, req, res){
	var connection = app.config.dbConnection();    
	var noticiaModel = new app.app.models.manchetesDAO(connection);

	var id_noticia = req.query;

	noticiaModel.getNoticia(id_noticia, function(error, result){
		res.render("admin/form_add_noticia", {
			validacao: {}, 
			noticia: result[0],
			flagAdmin: req.session.autorizado
		});
	});
}
```

---

### 🔹 Método que valida e salva a atualização:
O próximo método criado é o **atualize_noticia_salvar** que realiza a operação de atualização das informações Percebam que a primeira parte é igual ao do método **noticias_salvar**, que realiza a validação de campos vazios. Logo após chamamos o método **atualizaNoticia** que iremos criar posteriormente em nosso DAO. Para finalizar, redirecionamos novamente para tela de listagem com as informações atualizadas.

```js
module.exports.atualize_noticia_salvar = function(app, req, res){
	var noticia = req.body;

	if(req.file != undefined){
		nomeArquivo = req.file.filename;
		noticia.img = nomeArquivo;
	}

	req.assert('titulo','Título é obrigatório').notEmpty();
	req.assert('resumo','Resumo é obrigatório').notEmpty();
	req.assert('resumo','Resumo deve conter entre 10 e 100 caracteres').len(10,100);
	req.assert('autor','Autor é obrigatório').notEmpty();
	req.assert('data_noticia','Data é obrigatório').notEmpty().isDate({format: 'YYYY-MM-DD'});
	req.assert('texto','A notícia é obrigatória').notEmpty();

	var erros = req.validationErrors();

	if(erros){
		res.render("admin/form_add_noticia", {
			validacao : erros, 
			noticia: noticia,
			flagAdmin : req.session.autorizado
		});
		return;
	}

	var connection = app.config.dbConnection();
	var noticiaModel = new app.app.models.manchetesDAO(connection);

	noticiaModel.atualizaNoticia(noticia, function(error, result){
		res.redirect('/principaisnoticias');
	});
}
```

---

## 🗃 4️⃣ DAO — Acesso ao Banco (`models/manchetesDAO.js`)

### 🔹 Atualizando o método de consulta `getNoticia()` para trazer todos os campos

```js
NoticiasDAO.prototype.getNoticia = function(id_noticia, callback){
	this._connection.query(
		'SELECT * FROM MANCHETES WHERE id = '+ id_noticia.id_noticia,
		callback
	);
};
```

---

### 🔹 Criando o método de atualização no banco

```js
NoticiasDAO.prototype.atualizaNoticia = function (noticia, callback) {
	const id = noticia.id_noticia;
	delete noticia.id_noticia;
	this._connection.query(
		'UPDATE MANCHETES SET ? WHERE id = ?',
		[noticia, id],
		callback
	);
}
```

🧠 Aqui removemos o `id` do objeto para simplificar o SQL, evitando ter que setar campo por campo.

---

## ✔ Conclusão

Após essas alterações, sua aplicação agora consegue:

✅ Carregar uma notícia para edição na área de listagem autenticada <br>
✅ Validar os campos atualizados  
✅ Atualizar corretamente no banco de dados  
✅ Retornar para a listagem com os dados alterados

---

## 📎 Estudem para uma boa prova!  
