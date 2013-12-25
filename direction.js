goog.provide('lib.Direction');

// For attaching directionality to a sprite.
lib.Direction = function(sprite) {
    // This assumes sprite start facing right, since I tend to draw them that 
    // way.
    this.faceRight.call(sprite);
};

lib.Direction.prototype.setRandom = function() {
    sprite.facing_ = lib.random(2);
    sprite.changeDirection();
};

lib.Direction.LEFT = 0;
lib.Direction.RIGHT = 1;

// Switches the direction the sprite "this" is facing.
// @return this
lib.Direction.prototype.changeDirection = function() {
    return (this.facing_ == lib.Direction.LEFT) ? 
	this.faceRight() : this.faceLeft();
};

lib.Direction.prototype.faceLeft = function() {
    this.setScale(-1, 1);
    this.facing_ = lib.Direction.LEFT;
    return this;
};

lib.Direction.prototype.faceRight = function() {
    this.setScale(1, 1);
    this.facing_ = lib.Direction.RIGHT;
    return this;
};
