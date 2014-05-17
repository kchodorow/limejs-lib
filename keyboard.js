goog.provide('lib.Keyboard');

goog.require('goog.events.KeyCodes');
goog.require('lime.userAgent');

// This binds key events. On mobile, using the keyboard sucks, so it optionally
// creates an on-screen controller.
// @param{lime.Sprite} thing Sprite to listen on.
lib.Keyboard = function(thing) {
    this.keydown_ = {};
    this.keyup_ = {};
    this.use_keyboard_ = !(lime.userAgent.ANDROID || lime.userAgent.IOS);

    goog.events.listen(
        thing, ['keydown'], goog.bind(this.runKeydowns_, this));
    goog.events.listen(
        thing, ['keyup'], goog.bind(this.runKeyups_, this));
};

lib.Keyboard.prototype.createControlPad = function(arrow) {
    var controller = new lime.Node();
    // TODO
};

lib.Keyboard.prototype.runKeydowns_ = function(e) {
    if (e.event.keyCode in this.keydown_) {
        this.keydown_[e.event.keyCode].call(this, e);
    }
};

lib.Keyboard.prototype.runKeyups_ = function(e) {
    if (e.event.keyCode in this.keyup_) {
        this.keyup_[e.event.keyCode].call(e);
    }
};

lib.Keyboard.prototype.bindKeyDown = function(key, callback) {
    this.bind('keydown_', key, callback);
};

lib.Keyboard.prototype.bindKeyUp = function(key, callback) {
    this.bind('keyup_', key, callback);
};

lib.Keyboard.prototype.bind = function(event, key, callback) {
    // Take care of upper/lower case variations.
    if (key >= 65 && key <= 90) {
        this[event][key+32] = callback;
    } else if (key >= 97 && key <= 122) {
        this[event][key-32] = callback;
    }
    this[event][key] = callback;
};

// Call as bindWasd(goog.bind(cb, obj)) to correctly bind obj to 'this' in the
// callback.
// @param cb function Callback has signature: cb([x,y], e).
lib.Keyboard.prototype.bindWasd = function(cb, opt_keyup_cb) {
    this.bindWasd_('keydown_', cb);
    if (goog.isDef(opt_keyup_cb)) {
        this.bindWasd_('keyup_', opt_keyup_cb);
    }
};

lib.Keyboard.prototype.bindWasd_ = function(event, cb) {
    this.bind(
        event, goog.events.KeyCodes.W,
        goog.partial(cb, new goog.math.Vec2(0, -1)));
    this.bind(
        event, goog.events.KeyCodes.A,
        goog.partial(cb, new goog.math.Vec2(-1, 0)));
    this.bind(
        event, goog.events.KeyCodes.S,
        goog.partial(cb, new goog.math.Vec2(0, 1)));
    this.bind(
        event, goog.events.KeyCodes.D,
        goog.partial(cb, new goog.math.Vec2(1, 0)));
    this.bind(
        event, goog.events.KeyCodes.UP,
        goog.partial(cb, new goog.math.Vec2(0, -1)));
    this.bind(
        event, goog.events.KeyCodes.LEFT,
        goog.partial(cb, new goog.math.Vec2(-1, 0)));
    this.bind(
        event, goog.events.KeyCodes.DOWN,
        goog.partial(cb, new goog.math.Vec2(0, 1)));
    this.bind(
        event, goog.events.KeyCodes.RIGHT,
        goog.partial(cb, new goog.math.Vec2(1, 0)));
};
