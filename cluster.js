goog.provide('lib.Cluster');

// Creates a cluster of things using a hub-and-spoke model.
// @param ctor contructor This should be a constructor for a subclass of 
//     lime.Sprite.
lib.Cluster = function() {
    this.MIN = 7;
    this.MAX = 20;
    this.MIN_SPOKES = 2;
    this.MAX_SPOKES = 7;
    this.MIN_DIST = 2*LEN;
    this.MAX_DIST = 3*LEN;
    this.MAX_TRIES = 3;
    this.JITTER = LEN/2;
};

// Sets the creator function, which should take a goog.math.Coordinate and
// return a sprite.
// @param creator function
// @return this
lib.Cluster.prototype.setCreator = function(creator) {
    this.creator_ = creator;
    return this;
};

lib.Cluster.prototype.setBoundingBox = function(box) {
    this.box_ = box;
    return this;
};

lib.Cluster.prototype.setMap = function(map) {
    this.map_ = map;
    return this;
};

lib.Cluster.prototype.generate = function() {
    this.max_ = lib.random(this.MIN, this.MAX);
    this.num_ = 1;

    var tries = 0;
    while (tries++ < this.MAX_TRIES && this.num_ < this.max_) {
	var hub = new goog.math.Coordinate(
	    lib.random(this.box_.left, this.box_.right),
	    lib.random(this.box_.top, this.box_.bottom));

	var hub_inst = this.creator_(hub);

	this.addSpokes_(hub);
    }
};

// Given a "hub" at pos, create spoke huts.
// @param hub goog.math.Coordinate The position of the hub.
lib.Cluster.prototype.addSpokes_ = function(hub) {
    if (this.num_ >= this.max_) {
	return;
    }

    // Create huts as "spokes" around a hub hut.
    var num_spokes = lib.random(this.MIN_SPOKES, this.MAX_SPOKES);
    var angle = 360/num_spokes;
    // Start at a random offset.
    var offset = lib.random(360);

    for (var i = 0; this.num_ < this.max_ && i < num_spokes; i++, offset += angle) {
	var spoke = this.createSpoke_(hub, offset);
	if (spoke == null) {
	    continue;
	}

	// Fork off a new hub?
	if (lib.random(this.max_-this.num_) != 0) {
	    this.addSpokes_(spoke.getPosition());
	}
    }
};

lib.Cluster.prototype.createSpoke_ = function(hub, offset) {
    var dist = lib.random(this.MIN_DIST, this.MAX_DIST);
    var pos = new goog.math.Coordinate(
	hub.x+Math.cos(goog.math.toRadians(offset))*dist+this.jitter_(),
	hub.y+Math.sin(goog.math.toRadians(offset))*dist+this.jitter_());

    // Outside of range or too close to another.
    if (!this.box_.contains(pos) || this.hasNearby_(pos)) {
	return null;
    }

    var thing = this.creator_(pos);
    this.map_.add(thing);
    this.num_++;
    return thing;
};

lib.Cluster.prototype.jitter_ = function() {
    return lib.random(this.JITTER);
};

lib.Cluster.prototype.hasNearby_ = function(pos) {
    var box = new goog.math.Box(pos.y, pos.x, pos.y, pos.x).expand(this.MIN_DIST);
    var results = this.map_.findInBox(box);
    return results.length != 0;
};
