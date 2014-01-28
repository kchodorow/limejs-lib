goog.provide('lib.maze.Tree');

goog.require('lib');
goog.require('goog.structs.Map');
goog.require('goog.structs.QuadTree');
goog.require('lime.Sprite');

lib.maze.UNKNOWN = 0;
lib.maze.CORRIDOR = 1;
lib.maze.WALL = 2;

// @param size goog.math.Size
lib.maze.Tree = function(size) {
    this.size_ = size;
    this.dir_ = new lib.maze.Tree.Dir();
    this.board_ = new goog.structs.QuadTree(0, 0, size.width, size.height);
    this.active_set_ = [];
};

// Default node picker, should be overridden by subclasses.
lib.maze.Tree.prototype.pickNode = function() {
    return this.active_set_[lib.random(this.active_set_.length)];
};

lib.maze.Tree.prototype.generate = function() {
    this.active_set_.push(this.pickRandomNode_());
    while (this.active_set_.length > 0) {
        this.run_();
    }
};

lib.maze.Tree.prototype.getSize = function() {
    return this.size_;
};

lib.maze.Tree.prototype.getSquare = function(pos) {
    return this.board_.get(pos.x, pos.y);
};

lib.maze.Tree.prototype.pickRandomNode_ = function() {
    var pos = new goog.math.Coordinate(
        lib.random(this.size_.width), lib.random(this.size_.height));
    var node = new lib.maze.Tree.Node(pos);
    this.board_.set(pos.x, pos.y, node);
    return node;
};

lib.maze.Tree.prototype.run_ = function() {
    var node = this.pickNode();
    var new_node = this.getNeighbor_(node);
    if (new_node) {
        this.active_set_.push(new_node);
    } else {
        goog.array.remove(this.active_set_, node);
    }
};

lib.maze.Tree.prototype.getNeighbor_ = function(node) {
    var origin = node.getPos();
    var dir = this.dir_.getRandom();
    for (var i = 0; i < 4; ++i) {
        var pos = origin.clone().translate(dir.x, dir.y);
        if (this.isOnBoard_(pos) && !this.board_.contains(pos.x, pos.y)) {
            var new_node = this.createNode_(pos);
            node.connectTo(dir, new_node);
            return new_node;
        }
        dir = this.dir_.getNext(dir);
    }
    // No neighbors found.
    return null;
};

lib.maze.Tree.prototype.isOnBoard_ = function(pos) {
    if (pos.x >= 0 && pos.y >= 0 &&
        pos.x < this.size_.width && pos.y < this.size_.height) {
        return true;
    }
    return false;
};

lib.maze.Tree.prototype.createNode_ = function(pos) {
    var node = new lib.maze.Tree.Node(pos);
    this.board_.set(pos.x, pos.y, node);
    this.active_set_.push(node);
    return node;
};

var count_ = 0;

// @param goog.math.Coodinate
lib.maze.Tree.Node = function(pos) {
    this.pos_ = pos;
    this.left_ = this.right_ = this.top_ = this.bottom_ = lib.maze.WALL;
    this.count_ = ++count_;
};

lib.maze.Tree.Node.prototype.getPos = function() {
    return this.pos_;
};

lib.maze.Tree.Node.prototype.connectTo = function(dir, node) {
    if (dir.x == -1) {
        this.left_ = lib.maze.CORRIDOR;
        node.right_ = lib.maze.CORRIDOR;
    } else if (dir.x == 1) {
        this.right_ = lib.maze.CORRIDOR;
        node.left_ = lib.maze.CORRIDOR;
    } else if (dir.y == -1) {
        this.top_ = lib.maze.CORRIDOR;
        node.bottom_ = lib.maze.CORRIDOR;
    } else { // (dir.y == 1)
        this.bottom_ = lib.maze.CORRIDOR;
        node.top_ = lib.maze.CORRIDOR;
    }
};

lib.maze.Tree.Node.prototype.getLeft = function() {
    return this.left_;
};

lib.maze.Tree.Node.prototype.getRight = function() {
    return this.right_;
};

lib.maze.Tree.Node.prototype.getBottom = function() {
    return this.bottom_;
};

lib.maze.Tree.Node.prototype.getTop = function() {
    return this.top_;
};

lib.maze.Tree.Dir = function() {
    this.dir_map_ = new goog.structs.Map();
    var north = new goog.math.Vec2(0, -1);
    var east = new goog.math.Vec2(1, 0);
    var south = new goog.math.Vec2(0, 1);
    var west = new goog.math.Vec2(-1, 0);
    this.dir_map_.set(north, east);
    this.dir_map_.set(east, south);
    this.dir_map_.set(south, west);
    this.dir_map_.set(west, north);
    this.list_ = [north, east, south, west];
};

lib.maze.Tree.Dir.prototype.getRandom = function() {
    return this.list_[lib.random(4)];
};

lib.maze.Tree.Dir.prototype.getNext = function(dir) {
    return this.dir_map_.get(dir);
};
