// ==[ Game ]========================================================================
var Game = function() {
    this.GameInfo = {
        gameOver: false
        ,lives: 3
        ,gameState: 0 // running, 1=paused.
    };

    this.playerDied = function () {
        this.GameInfo.lives -= 1;
        player.die();
    }
};


// ==[ Enemies ]========================================================================
// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.speed =  50;
    this.yTilePosition = 0;
};

Enemy.prototype.restart = function () {
    this.speed =  50;
    this.x = (Math.floor((Math.random() * 600)));
    this.yTilePosition =  (Math.floor(Math.random() * 3) + 1);
    this.y = (this.yTilePosition * tileSize[1])-25;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers
    this.x += (this.speed*dt);

    if (this.x>550) {
        this.x = -20;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// ==[ Player ]========================================================================
// Player Class
// This class requires an update(), render() and a handleInput() method.
var Player = function() {
    this.sprites = ['images/char-boy.png','images/char-boy_dead.png'];
    this.sprite = this.sprites[0];
    this.x = 200;
    this.y = 370;
    this.tilePosition = {x: 2, y:5};
    this.state = 0;

    Resources.load(this.sprites);
};

Player.prototype.update = function(dt) {
    // check collisions.
    var thisPlayer = this;
    allEnemies.forEach(function(enemy) {

        if ((enemy.yTilePosition==thisPlayer.tilePosition.y) &&
            ((enemy.x > (thisPlayer.tilePosition.y+20)) && (enemy.x < thisPlayer.tilePosition.y+50))) {
            // collision!!
            thisPlayer.sprite = thisPlayer.sprites[1];

            game.playerDied();
        }
    });
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.tilePosition.x * (tileSize[0]), this.tilePosition.y * (tileSize[1])-20);
};

Player.prototype.handleInput = function(direction) {
    /*     var allowedKeys = {
     37: 'left',
     38: 'up',
     39: 'right',
     40: 'down'
     }; */

    var newPosition = {x:this.tilePosition.x, y:this.tilePosition.y};
    switch (direction) {
        case 37: // left
            newPosition.x += -1;
            break;
        case 38: // up
            newPosition.y += -1;
            break;

        case 39: // right
            newPosition.x += 1;
            break;

        case 40: // down
            newPosition.y += 1;
            break;

        default:
            // no movement.
    }
    if (this.state === 0) { // 0 = player alive.
        if (newPosition.x>=0 && newPosition.x<5) {
            this.tilePosition.x = newPosition.x;
        }
        if (newPosition.y>=0 && newPosition.y<6) {
            this.tilePosition.y = newPosition.y;
        }
    }


    // check win?

};

Player.prototype.die = function () {
    this.state = 1;
};

// ==[ Main ]========================================================================
// Now instantiate  objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
allEnemies = [];
for (var x=0; x<4; x++) {
    var e = new Enemy();
    e.restart();
    allEnemies.push(e);
}
player = new Player();
game = new Game();


// ==[ Events ]========================================================================
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {

    player.handleInput(e.keyCode);
});
