var mongo = require('mongodb').MongoClient;
var client = require('socket.io').listen(8080).sockets;

mongo.connect('mongodb://127.0.0.1/chat', function(err,db){
	if (err)
		throw err;

	//socket.io listens for connection
	client.on('connection', function(socket){
		//create a database collecction
		var col = db.collection('messages');
		//wait for incoming connection 'input'
		socket.on('input', function(data){
			//grab the "name" and "message" from data
			var name = data.name;
			var message = data.message;
			//whitespace regular expression
			var whitespacePattern = /^\s*$/;
			//if there is a match of whitespace in the 'name' or 'message' then its invalid
			if(whitespacePattern.test(name) || whitespacePattern.test(message)){
				console.log('Invalid');
			} else {
				// if the name or message is valid, insert the data into the database collection
				col.insert({name:name, message:message}, function(){
					console.log('inserted');
				});
			}

		});
	});

});

