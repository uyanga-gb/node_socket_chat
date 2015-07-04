var express = require("express");
var path = require("path");
var app = express();

app.use(express.static(path.join(__dirname, "./static")));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
 console.log(res.body);
 res.render("index", {});
});
app.get('/index', function(req, res) {
 res.render("index", {});
});

var server = app.listen(8000);
var io = require('socket.io').listen(server);

var got_new_user;
var users = [];	
var messages = [];
var new_user_id = 0;

io.sockets.on('connection', function (socket) {
	socket.on('new_user', function (user) {
		new_user_id++;
		var user_info = {
			id: new_user_id,
			name: user.name,
			topic: user.topic,
			gender: user.gender
		};
		users.push(user_info);
		// socket.emit('got_new_user', user_info);
		// socket.broadcast.emit('existing_users', user_info);
		io.emit("got_new_user", user_info);
	});
	
	socket.on('new_message', function (data) {
		var got_new_user = data.name;
		var got_new_message = data.message;
		var got_new_gender = data.gender;
		users = {name: got_new_user, message: got_new_message, gender: got_new_gender};
		messages.push(users);
		io.emit('got_message', {name: got_new_user, message: got_new_message, gender: got_new_gender});
	});

 });
