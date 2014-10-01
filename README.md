ChatApp
=======

ChatApp made in Node.js, socket.io and mongodb



SetUp:

Mongodb
=======
1. run mongodb as daemon: sudo service mongod start
2. run mongodb: mongo
3. switch to chat: use chat
=======
to check chat data in mongodb: db.messages.find()
to remote chat data: db.messages.remove({})


How to test in Chrome developer console
==========
1. listen to port:  var socket = io.connect('http://127.0.0.1:8080');
2. insert data: socket.emit('input',{name:"Alex","message":"hello"});




