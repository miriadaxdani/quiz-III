var path = require('path');

//Se preparan las variables, segun ejecutemos sqlite en local 
//o postgress en heroku

//esto es para poder ejecutar en local con npm start
//ya que si ejecutamos npm start, no cogemos las variables de entorno .ent, y DATABASE_URL es undefined y da error en el match
var getEnv = process.env.DATABASE_URL;
var getStorage = process.env.DATABASE_STORAGE;
if(!getEnv) getEnv="sqlite://:@:/";
if(!getStorage) getStorage="quiz.sqlite";

var url = getEnv.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name		= (url[6] || null);
var user		= (url[2] || null);
var pwd			= (url[3] || null);
var protocol	= (url[1] || null);
var dialect		= (url[1] || null);
var port		= (url[5] || null);
var host		= (url[4] || null);
var storage		= getStorage;

//cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite o postgress
var sequelize = new Sequelize(DB_name, user, pwd,
						{dialect: protocol, 
						protocol: protocol,
						port:	  port,
						host:	  host,
						storage:  storage,
						omitNull: true
						}
					);
					
//Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));
exports.Quiz = Quiz; // exportar definicion de tabla Quiz

// sequelize.sync() Crea e inicializa la tabla de preguntas en BD
sequelize.sync().then(function() {
	// then(..) Ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count){
		if(count === 0) { //la tabla se inicializa solo si esta vacia
			Quiz.create({
				pregunta: 'Capital de Italia',
				respuesta: 'Roma'
			});
			Quiz.create({
				pregunta: 'Capital de Portugal',
				respuesta: 'Lisboa'
			});
			Quiz.create({
				pregunta: 'Capital de Japón',
				respuesta: 'Tokio'
			});
			Quiz.create({
				pregunta: 'Capital de Argentina',
				respuesta: 'Buenos Aires'
			});			
			Quiz.create({
				pregunta: 'Capital de Grecia',
				respuesta: 'Atenas'
			})			
			.then(function(){console.log('Base de datos inicializada');});
		}
	});
});