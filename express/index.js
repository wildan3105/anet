var express		= require('express'),
	request 	= require('request'),
	mysql 		= require('mysql'),
	jade 		= require('jade'),
	url 		= require('url'),
	http		= require('http'),
	path		= require('path'),
	apps 		= require('./apps'),
	app			= express()

// body parser
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// mysql configuration
var sql	= mysql.createConnection({
	host 		: 'localhost',
	user 		: 'root',
	password	: 'wildansnahar',
	database	: 'arduino'
})

// connect to mysql
sql.connect(function(err){
	if(err) throw err;
	console.log('connect to mysql')
})

// view directory
app.use('/static', express.static('public'));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade')

app.get('/', function(req, res){
	res.send("<h1> express! </h1> <br> <a href='apps'> results </a>")
})

// test to insert query
app.post('/results', function(req, res){
	var post = {}
	post.date 		= new Date(),
	post.potentio 	= req.body.potentio

	sql.query('INSERT INTO analog_read SET ?', post, function(err, results, fields){
		if(err) throw err;
		console.log('sent success with value : ', post.potentio)
		res.json({'status':'success!'})
	})
})


app.get('/results', function(req, res){
	// fetch data from sql
	sql.query('SELECT * FROM analog_read', function(err, results, fields){
		if(err) throw err;
		res.send(results)
	})
})

app.use('/apps', apps)

app.listen(3500, function listening() {
  console.log('Listening on 3500');
});
