goog.provide('lib.Direction');

lib.Direction = {};

// This assumes sprite start facing right, since I tend to draw them that way.
lib.Direction.attach = function(sprite, opt_random) {
    sprite.changeDirection = lib.Direction.change;
    if (opt_random) {
	sprite.facing_ = shepherd.lib.random(2);
	sprite.changeDirection();
    } else {
	lib.Direction.faceRight(sprite);
    }
};

lib.Direction.LEFT = 0;
lib.Direction.RIGHT = 1;

// Switches the direction the sprite "this" is facing.
// @return this
lib.Direction.change = function() {
    if (this.facing_ == lib.Direction.LEFT) {
	lib.Direction.faceRight(this);
    } else {
	lib.Direction.faceLeft(this);
    }
    return this;
};

lib.Direction.faceLeft = function(sprite) {
    sprite.setScale(-1, 1);
    sprite.facing_ = lib.Direction.LEFT;
};

lib.Direction.faceRight = function(sprite) {
    sprite.setScale(1, 1);
    sprite.facing_ = lib.Direction.RIGHT;
};
