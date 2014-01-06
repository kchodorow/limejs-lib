goog.provide('lib.widget.Selectable');

goog.require('lime.Sprite');

// Makes something selectable. Use set*Callback to modify default behavior
// (stroke on highlight(), flicker on select(), nothing on deselect()).
//
// Example:
//
//    goog.object.extend(this, new lib.widget.Selectable());
//    this.select();
//    this.confirm();
//
lib.widget.Selectable = function() {
    this.selectable_ = {
	selectCallback: this.defaultSelectCallback_,
	confirmCallback: this.defaultConfirmCallback_,
	deselectCallback: this.defaultDeselectCallback_,
    };

    this.selectable_.selectCallback.color = '#000';
};

// Public API.
// @param opt_duration number Duration of effect in milliseconds.
lib.widget.Selectable.prototype.select = function() {
    this.selectable_.selectCallback.call(this);
};

lib.widget.Selectable.prototype.deselect = function() {
    this.selectable_.deselectCallback.call(this);
};

lib.widget.Selectable.prototype.confirm = function(ms) {
    this.selectable_.confirmCallback.call(this);
};

// Setters.

lib.widget.Selectable.prototype.setSelect = function(selectCb) {
    this.selectable_.selectCallback = selectCb;
};

lib.widget.Selectable.prototype.setDeselect = function(deselectCb) {
    this.selectable_.deselectCallback = deselectCb;
};

lib.widget.Selectable.prototype.setConfirm = function(confirmCb) {
    this.selectable_.confirmCallback = confirmCb;
};

lib.widget.Selectable.prototype.selected = function() {
    return this.selectable_.selected != null;
};

// Default callbacks.


// @private
lib.widget.Selectable.prototype.defaultSelectCallback_ = function() {
    var size = this.getSize().clone();
    size.width += 10;
    size.height += 10;
    this.selectable_.selected = new lime.Sprite()
        .setSize(size)
        .setStroke(3, this.selectable_.selectCallback.color);
    this.appendChild(this.selectable_.selected);
};

// @private
lib.widget.Selectable.prototype.defaultDeselectCallback_ = function() {
    this.removeChild(this.selectable_.selected);
    this.selectable_.selected = null;
};

// @private
lib.widget.Selectable.prototype.defaultConfirmCallback_ = function(ms) {
    if (this.selectable_.selected == null) {
	return;
    }

    this.selectable_.selected.runAction(
	new lime.animation.Loop(new lime.animation.Sequence(
	    new lime.animation.FadeTo(0).setDuration(0),
	    new lime.animation.Delay(0).setDuration(.2),
	    new lime.animation.FadeTo(1).setDuration(0)))
	    .setLimit(Math.floor(ms/200)));
};
