goog.provide('lib.Direction');

lib.Direction = {};

// This assumes sprite start facing right, since I tend to draw them that way.
lib.Direction.attach = function(sprite, opt_random) {
    sprite.changeDirection = lib.Direction.change;
    sprite.faceLeft = lib.Direction.faceLeft;
    sprite.faceRight = lib.Direction.faceRight;
    if (opt_random) {
	sprite.facing_ = shepherd.lib.random(2);
	sprite.changeDirection();
    } else {
	sprite.faceRight();
    }
};

lib.Direction.LEFT = 0;
lib.Direction.RIGHT = 1;

// Switches the direction the sprite "this" is facing.
// @return this
lib.Direction.change = function() {
    return (this.facing_ == lib.Direction.LEFT) ? 
	this.faceRight() : this.faceLeft();
};

lib.Direction.faceLeft = function() {
    this.setScale(-1, 1);
    this.facing_ = lib.Direction.LEFT;
    return this;
};

lib.Direction.faceRight = function() {
    this.setScale(1, 1);
    this.facing_ = lib.Direction.RIGHT;
    return this;
};
