goog.provide('lib.collision.GeoHash');

// A single GeoHash per map should be created.
// @param box goog.math.Coordinate the coordinates of the map, which the geohash
//     points will be mapped to.
// @param opt_bits number The precision to use. Defaults to 6 (64 splits).
lib.collision.GeoHash = function(box, opt_bits) {
    this.box_ = box;
    this.bits_ = opt_bits || 6;

    // The box will be split into this many divisions.
    var divisions = Math.pow(2, this.bits_);
    // Every small box will contain this many pixels.
    this.px_per_bit_ = new goog.math.Coordinate(
	(this.box_.right - this.box_.left)/divisions, 
	(this.box_.bottom - this.box_.top)/divisions);

    this.map_ = {};
};

// Attach geohashing utilities to an object.  Adds a geohash_ property on the
// object.
// @returns number The UID of the object.
lib.collision.GeoHash.prototype.setup_ = function(thing) {
    if ('geohash_' in thing) {
	return;
    }
    thing.geohash_ = {hash: this.geohash_(thing.getPosition())};
    return goog.getUid(thing);
};

// Returns if the given point is on the mapped area.
lib.collision.GeoHash.prototype.contains = function(point) {
    return this.box_.contains(point);
};

// Convert a position to a geohash.
// @param pos goog.math.Coordinate
lib.collision.GeoHash.prototype.geohash_ = function(pos) {
    var result = 0;
    if (!this.contains(pos)) {
	return null;
    }

    var box = this.box_.clone();
    // Modify box to be smaller and smaller as bits are resolved.
    for (var i = 0; i < this.bits_; i++) {
	var midline_x = box.left + (box.right - box.left)/2;
	if (pos.x <= midline_x) {
	    box.right = midline_x;
	} else {
	    box.left = midline_x;
	    result |= 1;
	}
	result <<= 1;

	var midline_y = box.top + (box.bottom - box.top)/2;
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

// Write operations.
// Insert.
lib.collision.GeoHash.prototype.add = function(thing) {
    var uid = this.setup_(thing);

    if (!(thing.geohash_.hash in this.map_)) {
	this.map_[thing.geohash_.hash] = {};
    }
    this.map_[thing.geohash_.hash][uid] = thing;
};

// Update.
lib.collision.GeoHash.prototype.updatePosition = function(thing) {
    var hash = this.map_[thing.geohash_.hash];
    var uid = goog.getUid(thing);
    if (!hash || !(uid in hash)) {
	return false;
    }

    hash[uid] = thing;
    return true;
};

// Remove.
lib.collision.GeoHash.prototype.remove = function(thing) {
    var hash = this.map_[thing.geohash_.hash];
    delete hash[goog.getUid(thing)];
};

// Read operations.
// Find nearest within a box optionally filtered by tag.
// @return array A list of results or null if the box was invalid.
lib.collision.GeoHash.prototype.findInBox = function(box, tags) {
    var results = [];
    for (var x = box.left; x <= box.right; x += this.px_per_bit_.x) {
	for (var y = box.top; y <= box.bottom; y += this.px_per_bit_.y) {
	    results.concat(this.findAtPoint(new goog.math.Coordinate(x, y), tags));
	}
    }
    return results;
};

// At a given point.
lib.collision.GeoHash.prototype.findAtPoint = function(point, tags) {
    var results = [];
    var hash = this.geohash_(point);
    if (hash === null) {
	return null;
    }
    var stuff = this.map_[hash];
    for (var uid in stuff) {
	if (this.matchesTags(stuff[uid], tags)) {
	    results.push(stuff[uid]);
	}
    }
    return results;
};

lib.collision.GeoHash.prototype.matchesTags = function(thing, tags) {
    if (!tags || tags.length == 0) {
	// Not looking for a specific tag.
	return true;
    }

    if (!('tags_' in thing) || thing.tags_.length == 0) {
	// Looking for a specific tag, but the entry has none.
	return false;
    }

    for (tag in tags) {
	if (tag in thing.tags_) {
	    return true;
	}
    }
    return false;
};
