goog.provide('lib.Tag');

lib.Tag = function(opt_tags) {
    opt_tags = opt_tags || [];
    this.tags_ = opt_tags;
};

lib.Tag.prototype.isA = function(str) {
    for (var i = 0; i < this.tags_.length; i++) {
	if (this.tags_[i] == str) {
	    return true;
	}
    }
    return false;
};
