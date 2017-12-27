var app = require('express')(); 

var http = require('http').Server(app); 

var io = require('socket.io')(http); 


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/css/styles.css', function(req, res) {
    res.sendFile(__dirname + '/css/styles.css');
});

app.get('/js/app.js', function(req, res) {
    res.sendFile(__dirname + '/js/app.js')
});

app.get('/js/data.js', function(req, res) {
    res.sendFile(__dirname + '/js/data.js')
});

var USERS = [];

var allClients = [];

var ALL_MESSAGES = [];

io.on('connection', function(socket) {
    console.log('A user is connected');

    socket.on('chat message', function(msg) {
        ALL_MESSAGES.push({"name": msg[0], "message": msg[1]});
        io.emit('chat message', msg); // emit the event from the server to the rest of the users
    });


    socket.on('new', function(user) {
        console.log("Added another user : " + user.name);
        USERS.push(user);
        allClients.push({"client_id": user.idNum, "sock_id": socket.id});
        socket.emit('archived', ALL_MESSAGES);
    })

    socket.on('user info', function(user) {
        
        for(i = 0; i < USERS.length; i++){
            if (USERS[i].name == user.name){
                USERS[i] = user;
            }
        }

        // All connected users' information is sent to client side
        io.emit('all users', USERS);
    });


    // Update other users' canvas when user disconnects
    socket.on('disconnect', function(){
        console.log('A user disconnected');
        var deleteUserID;
        for(i = 0; i < allClients.length; i++){
            if (allClients[i].sock_id === socket.id){
                deleteUserID = allClients[i].client_id;
            }
        }

        for(i = 0; i < USERS.length; i++){
            if (USERS[i].idNum === deleteUserID){
                USERS.splice(i, 1);
                io.emit('all users', USERS);
            }
        }        
    });

});

// Make http server listen on port 3000.
var port = process.env.PORT || 3000;
http.listen(port, function() {
    console.log("listening on *:3000");
});


