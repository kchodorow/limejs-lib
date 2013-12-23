goog.provide('lib.collision.GeoHash');

// A single GeoHash per map should be created.
// @param box goog.math.Coordinate the coordinates of the map, which the geohash
//     points will be mapped to.
// @param opt_bits number The precision to use. Defaults to 6 (64 splits).
lib.collision.GeoHash = function(box, opt_bits) {
    this.box_ = box;
    this.bits_ = opt_bits || 6;
    this.px_per_bit_ = new goog.math.Coordinate(
	this.box_.right - this.box_.left, this.box_.bottom-this.box_.top);
    var count = this.bits_;
    for (var c = 0; c < count; c++) {
	this.px_per_bit_.x /= 2;
	this.px_per_bit_.y /= 2;
    }

    this.map_ = {};
};

// Attach geohashing utilities to an object.  Adds a geohash_ property on the
// object.
// @returns number The UID of the object.
lib.collision.GeoHash.prototype.setup_ = function(thing, tags) {
    if ('geohash_' in thing) {
	return;
    }
    thing.geohash_ = {
	hash_: this.geohash_(thing.getPosition()),
	tags_: tags};
    return goog.getUid(thing);
};

// Convert a position to a geohash.
// @param pos goog.math.Coordinate
lib.collision.GeoHash.prototype.geohash_ = function(pos) {
    var result = 0;
    if (!this.box_.contains(pos)) {
	return result;
    }

    var box = this.box_.clone();
    // Modify box to be smaller and smaller as bits are resolved.
    for (var i = 0; i < this.bits_; i++) {
	var midline_x = (box.right - box.left)/2;
	if (pos.x <= midline_x) {
	    box.right = midline_x;
	} else {
	    box.left = midline_x;
	    result |= 1;
	}
	result <<= 1;

	var midline_y = (box.bottom - box.top)/2;
	if (pos.y <= midline_y) {
	    box.bottom = midline_y;
	} else {
	    box.top = midline_y;
	    result |= 1;
	}
	result <<= 1;
    }
    return result;
};

// Convert a box in position coordinates to one in geohash coordinates.
lib.collision.GeoHash.prototype.geobox_ = function(box) {
    return new goog.math.Box(
	this.geohash_(box.top), this.geohash_(box.right), 
	this.geohash_(box.bottom), this.geohash_(box.left));
};

// Write operations.
// Insert.
lib.collision.GeoHash.prototype.add = function(thing, tags) {
    var uid = this.setup_(thing, tags);

    if (!(thing.geohash_.hash_ in this.map_)) {
	this.map_[thing.geohash_.hash_] = {};
    }
    this.map_[thing.geohash_.hash_][uid] = thing;
};

// Update.
lib.collision.GeoHash.prototype.updatePosition = function(thing) {
    var hash = this.map_[thing.geohash_.hash_];
    var uid = goog.getUid(thing);
    if (!hash || !(uid in hash)) {
	return false;
    }

    hash[uid] = thing;
    return true;
};

// Remove.
lib.collision.GeoHash.prototype.remove = function(thing) {
    var hash = this.map_[thing.geohash_.hash_];
    delete hash[goog.getUid(thing)];
};

// Read operations.
// Find nearest within a box optionally filtered by tag.
lib.collision.GeoHash.prototype.findInBox = function(box) {
    var results = [];
    var geo_box = this.geobox_(box);
    for (var x = geo_box.left; x < geo_box.right; ++x) {
	for (var y = geo_box.top; y < geo_box.bottom; y++) {
	    var stuff = 
		this.map_[this.geohash_(new goog.math.Coordinate(x, y))];
	    for (var uid in stuff) {
		if (box.contains(stuff[uid].getPosition())) {
		    results.push(stuff[uid]);
		}
	    }
	}
    }
    return results;
};

// At a given point.
lib.collision.GeoHash.prototype.findAtPoint = function(point) {
    var stuff = this.map_[this.geohash_(point)];
    for (var uid in stuff) {
	results.push(stuff[uid]);
    }
    return results;
};
