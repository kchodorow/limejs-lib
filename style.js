goog.provide('lib.style');

lib.style = {};

// Add a background image to a sprite.
// @param sprite lime.Sprite
// @param frame lime.fill.Frame
lib.style.setBackgroundFrame = function(sprite, frame) {
    var classname = lib.style.getNextCssClass_();
    sprite.domClassName = classname;
    goog.style.installStyles(
	'.'+classname+'{background:-webkit-canvas('+frame.data_.classname+')}');
};

// Sets the cursor style.  
// @param sprite lime.Sprite
// @param type string "pointer" or "default".
lib.style.setCursorStyle = function(sprite, type) {
    if (type != 'pointer' && type != 'default') {
	return;
    }
    lib.style.setStyle(sprite, '{cursor:'+type+';}');
};

lib.style.setStyle = function(sprite, style) {
    var classname = lib.style.getNextCssClass_();
    sprite.domClassName = classname;
    goog.style.installStyles('.'+classname+style);
};

lib.style.style_counter_ = 0;

// @private
lib.style.getNextCssClass_ = function() {
    return 'lib-style-css-'+lib.style.style_counter_++;
};
