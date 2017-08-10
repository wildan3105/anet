var express		= require('express'),
	request 	= require('request'),
	mysql 		= require('mysql'),
	app			= express()

// body parser
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// mysql configuration
var connection	= mysql.createConnection({
	host 		: 'localhost',
	user 		: 'root',
	password	: 'wildansnahar',
	database	: 'arduino'
})

// connect to mysql
connection.connect(function(err){
	if(err) throw err;
	console.log('connect to mysql')
})

app.get('/', function(req, res){
	res.send("<h1> express! </h1> <br> <a href='results'> results </a>")
})

// test to insert query
app.post('/results', function(req, res){
	var post = {}
	post.date 		= new Date(),
	post.potentio 	= req.body.potentio

	connection.query('INSERT INTO analog_read SET ?', post, function(err, results, fields){
		if(err) throw err;
		console.log('sent success with value : ', post.potentio)
		res.json({'status':'success!'})
	})
})

app.get('/results', function(req, res){
	// fetch data from sql
	connection.query('SELECT * FROM analog_read', function(err, results, fields){
		if(err) throw err;
		res.send(results)
	})
})

app.post('/')

app.listen(3000, function(){
	console.log('listen on 3000 express')
})