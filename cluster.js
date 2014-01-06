goog.provide('lib.Cluster');

// Creates a cluster of things using a hub-and-spoke model.
// @param ctor contructor This should be a constructor for a subclass of
//     lime.Sprite.
lib.Cluster = function() {
    this.max_ = 10;
    this.MIN_SPOKES = 2;
    this.MAX_SPOKES = 7;
    this.min_distance_ = LEN;
    this.MAX_DIST = LEN*2;
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

lib.Cluster.prototype.setTags = function(tags) {
    this.tags_ = tags;
    return this;
};

lib.Cluster.prototype.setNumber = function(number) {
    this.max_ = number;
    return this;
};

// Sets the minimum distance for objects.  Always greater than 0.
lib.Cluster.prototype.setMinDistance = function(dist) {
    this.min_distance_ = dist <= 0 ? 1 : dist;
    return this;
};

lib.Cluster.prototype.generate = function() {
    this.num_ = 0;

    var tries = 0;
    while (this.num_ < this.max_) {
        var hub = new goog.math.Coordinate(
            lib.random(this.box_.left, this.box_.right),
            lib.random(this.box_.top, this.box_.bottom));

        if (this.createSpoke_(hub, 0) != null) {
            this.addSpokes_(hub);
        }
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

    for (var i = 0; this.num_ < this.max_ && i < num_spokes;
         i++, offset += angle) {
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
    var dist = lib.random(this.min_distance_, this.MAX_DIST);
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
    var box = new goog.math.Box(
        pos.y-this.min_distance_, pos.x+this.min_distance_,
        pos.y+this.min_distance_, pos.x-this.min_distance_);
    return this.map_.hasInBox(box, this.tags_);
};
