var basis = require("node-basis");
var fs = require("fs");

/*
basis 是解决路由请求与处理，静态文件访问处理的组件。
通过basis.setRouter()可以设置访问路由
通过basis.contriller()可以设置某个路由的处理函数
通过basis.start(port)启动 basis,port是启动的端口号
*/

basis.setRouter({
	"search":"/search",
	"controllerName2":"/",
	"saveGraph":"/saveGraph",
	"getGraph" :"/getGraph"
});

/*映射文件处理接口*/
basis.setFilter({
	"nodeFile1":"./html/a.node"
});

/*
restfull 接口
url is /restful/info
参见html/index.html里的ajax请求
*/
basis.controller("saveGraph",function(req,res){
	var body='';
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function (chunk) {
		fs.writeFile('./json/graph.json', body,  function(err) {
		   if (err) {
		       return console.error(err);
		   }
		});
        res.end();
    });
});

basis.controller("getGraph",function(req,res){
	res.writeHead(200, {'Content-Type': 'application/json'});
	fs.readFile('./json/graph.json', 'utf-8', function (err, data) {
	    if (err) {
	        console.log(err);
	    } else {
	        res.end(data);
	    }
	});
});

basis.controller("search",function(req,res){
	var data = {
		"message":"ok",
		"status":200,
		"result":""
	};
	var mysql = require('mysql');
	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '123456',
	  port:3306,
	  database : 'world'
	});

	connection.connect();
	var  sql = 'SELECT * FROM city';
	//查
	connection.query(sql,function (err, result) {
		var i,v,rows;
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }
	 	res.writeHead(200, {'Content-Type': 'application/json'});
		//rows = JSON.stringify(result);
		data.result = result;
		res.end(JSON.stringify(data));
	});
	connection.end();
});

basis.controller("nodeFile1",function(req,res,file){
	var data = {
		"message":"ok",
		"status":200,
		"result":""
	};
	var mysql = require('mysql');
	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '123456',
	  port:3306,
	  database : 'world'
	});

	connection.connect();
	var  sql = 'SELECT * FROM city';
	//查
	connection.query(sql,function (err, result) {
		var i,v,rows;
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }
		data.result = result;

		var tpl = new basis.template();
		tpl.assign("items",result);
		tpl.render(file,res);
	});
	connection.end();

});

basis.start(800);