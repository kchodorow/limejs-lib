goog.provide('lib.ProgressBar');

goog.require('lime.RoundedRect');

lib.ProgressBar = function() {
    lime.RoundedRect.call(this);

    this.max_ = 100;
    this.current_ = 100;

    this.setRadius(lib.ProgressBar.DEFAULT_RADIUS)
        .setSize(lib.ProgressBar.DEFAULT_WIDTH, lib.ProgressBar.DEFAULT_HEIGHT)
	.setFill(lib.ProgressBar.DEFAULT_BG);

    this.inner_ = new lime.RoundedRect().setRadius(lib.ProgressBar.DEFAULT_RADIUS)
        .setSize(lib.ProgressBar.DEFAULT_WIDTH, lib.ProgressBar.DEFAULT_HEIGHT)
        .setFill(lib.ProgressBar.DEFAULT_FG)
	.setAnchorPoint(0, .5).setPosition(-lib.ProgressBar.DEFAULT_WIDTH/2, 0);
    this.appendChild(this.inner_);
};

goog.inherits(lib.ProgressBar, lime.RoundedRect);

lib.ProgressBar.DEFAULT_WIDTH = 200;
lib.ProgressBar.DEFAULT_HEIGHT = 20;
lib.ProgressBar.DEFAULT_RADIUS = 10;

lib.ProgressBar.DEFAULT_FG = 'rgb(255,0,0)';
lib.ProgressBar.DEFAULT_BG = 'rgb(0,0,0)';

lib.ProgressBar.prototype.setBackgroundColor = function(rgb) {
    this.setFill(rgb);
};

lib.ProgressBar.prototype.setForegroundColor = function(rgb) {
    this.inner_.setFill(rgb);
};

lib.ProgressBar.prototype.setDimensions = function(size, opt_radius) {
    opt_radius = opt_radius || size.height/2;
    this.setSize(size);
    this.inner_.setSize(size).setPosition(-size.width/2, 0);
};

lib.ProgressBar.prototype.updateProgress = function(amount) {
    this.current_ += amount;
    if (this.current_ > this.max_) {
	this.current_ = this.max_;
    }

    var size = this.getSize();
    this.inner_.setSize(size.width*(this.current_/this.max_), size.height);
};

lib.ProgressBar.prototype.getProgress = function() {
    return 100*(this.current_/this.max_);
};
