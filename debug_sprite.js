goog.provide('lib.Debug');

goog.require('lime.Sprite');

lib.Debug = {};

// Provides position, unique id, and dragability for a sprite.
lib.Debug.attach = function(sprite) {
    if (!goog.DEBUG) {
	return;
    }

    var info = new lime.Node();
    info.appendChild(
	lib.label(goog.getUid(sprite)).setSize(100, 50).setPosition(0, 50));
    sprite.pos_label_ = lib.label(sprite.getPosition().toString())
	.setSize(100, 50).setPosition(0, 100);
    info.appendChild(sprite.pos_label_);
    info.setHidden(true);
    sprite.appendChild(info);

    goog.events.listen(sprite, ['mouseover'], goog.bind(info.setHidden, info, false));
    goog.events.listen(sprite, ['mouseout'], goog.bind(info.setHidden, info, true));
    goog.events.listen(
	sprite, ['mousedown', 'touchstart'], lib.Debug.changePos);
};

lib.Debug.changePos = function(e) {
    goog.events.listen(e.target, ['mousemove'], function(e) {
	e.target.pos_label_.setText(e.target.getPosition().toString());
    });
    e.startDrag();
};
