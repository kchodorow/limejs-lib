goog.provide('lib.Debug');

goog.require('lime.Sprite');
goog.require('goog.ui.Tooltip');

lib.Debug = {};

// Provides position, unique id, and dragability for a sprite.
lib.Debug.attach = function(sprite) {
    if (!goog.DEBUG) {
	return;
    }

    lib.Debug.addTooltip_(sprite);
    goog.events.listen(
	sprite, ['mousedown', 'touchstart'], lib.Debug.changePos);
};

lib.Debug.addTooltip_ = function(sprite) {
    if (!('domElement' in sprite)) {
	sprite.createDomElement();
    }

    sprite.debug_tooltip_ = new goog.ui.Tooltip();
    sprite.debug_tooltip_.attach(sprite.domElement);
    sprite.debug_tooltip_.setText(lib.Debug.getTooltipText_(sprite));
};

lib.Debug.getTooltipText_ = function(sprite) {
    return goog.getUid(sprite)+" "+sprite.getPosition().toString();
}

lib.Debug.changePos = function(e) {
    goog.events.listen(e.target, ['mousemove'], function(e) {
	e.target.debug_tooltip_.setText(lib.Debug.getTooltipText_(e.target));
    });
    e.startDrag();
};
