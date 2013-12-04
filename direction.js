goog.provide('lib.AddFacing');

goog.require('lib');

var LEFT = 0;
var RIGHT = 1;

lib.AddFacing = function(sprite) {
    sprite.facing_ = shepherd.lib.random(2);
    sprite.changeDirection = shepherd.lib.AddFacing.change;
    sprite.changeDirection();
};

lib.AddFacing.change = function() {
    if (this.facing_ == LEFT) {
        this.setScale(1, 1);
        this.facing_ = RIGHT;
    } else {
        this.setScale(-1, 1);
        this.facing_ = LEFT;
    }
};
