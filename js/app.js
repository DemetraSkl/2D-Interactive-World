$(function() {
    var canvas = document.querySelector("#c");
    // Canvas dimensions
    var HEIGHT = canvas.height;
    var WIDTH = canvas.width;

    // Avatar speed (step size)
    var dx = 5;
    var dy = 5;

    var allUsers;

    var socket = io();

    var userName = prompt("What is your name?");

    // Assign user color displayed to other users
    var color = getRandomColor();

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        console.log("Getting color");
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Assign user client id to associate with socket id
    var userID = getRandomString();

    function getRandomString() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-@#&";
        for (var i = 0; i < 20; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    // Instantiate User
    var user = new User(userName, userID, 10, 10, color);

    // Send back to server new user's full 'profile' i.e. name etc.
    socket.emit('new', user);


    // All User objects
    socket.on('all users', function(all) {
        console.log("users' info received on front end");
        var tmp_list = [];
        for (i = 0; i < all.length; i++) {
            var tmp_usr = new User(all[i].name, all[i].idNum, all[i].x, all[i].y, all[i].color);
            console.log("users' info received on front endettaaaad  " + all[i].idNum);
            tmp_list.push(tmp_usr);
        }

        // Clear other users' movement trail
        if (allUsers) {
            for (i = 0; i < allUsers.length; i++) {
                if (allUsers[i].name != user.name) {
                    allUsers[i].clear();
                }
            }
        }
        // Update allUsers
        allUsers = tmp_list;
    });

    // Chat Board
    // When user types messsage, the server gets it as a chat message event
    $('form').submit(function() {
        socket.emit('chat message', [user.name, $('#m').val()]);
        $('#m').val(''); // Reset message element
        return false;
    });

    // On client side when we capture chat message event, we'll include it in the page
    socket.on('chat message', function(msg) {
        $('#messages').append($('<li>').text(msg[0] + " : " + msg[1]));
    });


    // The octopus functions as the controller 
    var octopus = {
        init: function() {
            view.render();
        },

        keyDown: function(event) {
            user.clear(); // Need to clear previous value
            switch (event.keyCode) {
                case 38:
                    /* up arrow  */
                    if (user.y - dy > 0) {
                        user.setY(user.y - dy);
                    }
                    // Update user info, namely location
                    socket.emit('user info', user);
                    break;
                case 40:
                    /* down arrow */
                    if (user.y + dy < HEIGHT) {
                        user.setY(user.y + dy);
                    }
                    socket.emit('user info', user);
                    break;
                case 37:
                    /* left arrow */
                    if (user.x - dx > 0) {
                        user.setX(user.x - dx);
                    }
                    socket.emit('user info', user);
                    break;
                case 39:
                    /* right arrow */
                    if (user.x + dx < WIDTH) {
                        user.setX(user.x + dx);
                    }
                    socket.emit('user info', user);
                    break;
            }
        },

        animate: function() {
            requestAnimationFrame(octopus.animate);

            user.draw();
            if (allUsers) {
                for (i = 0; i < allUsers.length; i++) {
                    if (allUsers[i].name != user.name) {
                        allUsers[i].drawAvatar();
                    }
                }
            }
        }
    };


    var view = {

        render: function() {
            window.addEventListener('keydown', octopus.keyDown, true);
            octopus.animate();
        }
    };


    octopus.init();

});