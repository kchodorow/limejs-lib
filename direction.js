goog.provide('lib.Direction');

// For attaching directionality to a sprite.
//
// Example:
//
//     goog.object.extend(this, new lib.Direction(this));
//
lib.Direction = function(sprite) {
    // This assumes sprite start facing right, since I tend to draw them that
    // way.
    this.faceRight.call(sprite);
};

lib.Direction.LEFT = 0;
lib.Direction.RIGHT = 1;

lib.Direction.prototype.faceRandom = function() {
    this.facing_ = lib.random(2);
    this.changeDirection();
};

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
