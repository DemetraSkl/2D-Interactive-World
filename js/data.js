function User(name, idNum, x, y, color) {
    this.name = name;
    this.idNum = idNum;
    this.x = x;
    this.y = y;
    this.conn = true;
    this.color = color;
    this.radius = 5;

    this.getUserID = function() {
        return this.idNum;
    };

    this.draw = function() {
        canvas = document.querySelector("#c");
        context = canvas.getContext('2d');
        context.fillStyle = "#379683";
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fill();
        context.beginPath();
        context.font = '10px Courier New';
        context.fillStyle = "#05386B";
        context.fillText(this.name.slice(0, 1), this.x - this.radius / 2, this.y + this.radius / 2);
        context.fill();
    };

    this.drawAvatar = function() {
        canvas = document.querySelector("#c");
        context = canvas.getContext('2d');
        context.fillStyle = this.color;
        if (this.conn) {
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            context.fill();
            context.beginPath();
            context.font = '10px Courier New';
            context.fillStyle = "#05386B";
            context.fillText(this.name.slice(0, 1), this.x - this.radius / 2, this.y + this.radius / 2);
            context.fill();
        }
    };

    this.getCoords = function() {
        return [x, y];
    };

    // Set new coords
    this.setCoords = function(x_new, y_new) {
        this.x = x_new;
        this.y = y_new;
    };

    this.setX = function(x_new) {
        this.x = x_new;
    };

    this.setY = function(y_new) {
        this.y = y_new;
    };

    this.clear = function() {
        canvas = document.querySelector("#c");
        context = canvas.getContext('2d');

        var x_corner = this.x - this.radius;
        var y_corner = this.y - this.radius;

        context.clearRect(x_corner, y_corner, this.radius * 2, this.radius * 2);
        console.log("Canvas cleared!!!");
    };

    this.connected = function() {
        if (this.conn) {
            return true;
        } else {
            return false;
        }
    };

    this.disconnect = function() {
        this.conn = false;
        this.clear();
    };

}