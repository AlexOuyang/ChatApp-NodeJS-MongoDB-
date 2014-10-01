var mongo = require('mongodb').MongoClient;
var client = require('socket.io').listen(8080).sockets;

mongo.connect('mongodb://127.0.0.1/chat', function(err,db){
	if (err) throw err;

	//socket.io listens for connection
	client.on('connection', function(socket){
		//create a database collecction
		var col = db.collection('messages');
		var sendStatus = function(s){
			//emit the status to the client
			socket.emit('status', s);
		};

		//emit all messages in textarea
		//limit the amount of messages we want to sow in textarea, 
		//sort({_id:1}) sorts the data in descending order by id
		col.find().limit(100).sort({_id: 1}).toArray(function(err, res){
			if(err) throw err;
			socket.emit('output', res);
		});

		//wait for incoming connection 'input'
		socket.on('input', function(data){
			//grab the "name" and "message" from data
			var name = data.name;
			var message = data.message;
			//whitespace regular expression
			var whitespacePattern = /^\s*$/;

			//if there is a match of whitespace in the 'name' or 'message' then its invalid
			if(whitespacePattern.test(name) || whitespacePattern.test(message)){
				//console.log('Invalid data, can't insert into the database);
				//validate the status on serverside so it can't be changed by the users
				sendStatus('Name and message is required.');
			} else {
				// if the name or message is valid, insert the data into the database collection
				col.insert({name:name, message:message}, function(){
					//console.log('Data inserted');

					//Emit the latest messsage to all clients
					client.emit('output', [data]);
					//notify the client to clear the input textarea
					sendStatus({message:"Message sent", clear:true});
				});
			}

		});
	});

});

