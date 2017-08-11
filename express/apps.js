var express		= require('express'),
	mysql		= require('mysql'),
	url 		= require('url'),
	moment		= require('moment'),
	router 		= express.Router()

// mysql configuration
var connection	= mysql.createConnection({
	host 		: 'localhost',
	user 		: 'root',
	password	: 'wildansnahar',
	database	: 'arduino'
})

router.get('/', function(req, res){
	var sorter = 'date';
	var sql    = 'SELECT * FROM analog_read ORDER BY ' + connection.escapeId(sorter) + 'DESC';
	connection.query(sql, function(err, results, fields){
		if(err) throw err;
		let obj = JSON.stringify(results)
		obj 	= JSON.parse(obj)
		
		let p = [], d = []
		for(var i in obj){
		  p.push(obj[i].potentio)
		}
		p.reverse()
		
		for(var i in obj){
		  d.push(i)
		}

		obj.unshift({potentio:'Resistance', 'date':'Timestamp'})
		
		let arr =[]
		for(var i in obj){
		  arr.push([obj[i].potentio, obj[i].date])
		}
		
		res.render('home', {title:"Homepage", results, arr, p ,d})
	})
})

router.get('/post', function(req, res){
	res.render('post', {title:"Generate random data"})
})

router.post('/generate', function(req, res){
	// generate random
	function generate(start, end){
	  return Math.floor(Math.random() * end) + start
	}
	var numb = generate(50,100)
	var post = {
		date: new Date(),
		potentio: numb
	}
	connection.query('INSERT INTO analog_read SET ?', post, function(err, results, fields){
		if(err) throw err;
		console.log('sent success with value : ', post.potentio)
		res.redirect('http://localhost:3500/apps')
	})
})

router.post('/clear', function(req, res){
	connection.query('TRUNCATE analog_read', function(err, results, fields){
		if(err) throw err;
		res.redirect('http://localhost:3500/apps')
	})
})

router.get('/export', function(req, res){
	var sorter = 'date';
	var sql    = 'SELECT * FROM analog_read ORDER BY ' + connection.escapeId(sorter) + 'DESC';
	connection.query(sql, function(err, results, fields){
		if(err) throw err;
		res.json(results)
	})
})

module.exports = router;