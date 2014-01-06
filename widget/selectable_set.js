goog.provide('lib.widget.SelectableSet');

// A list of selectable sprites.  Only one can be selected at a time. This is
// for things like menus, where you want to be able to easily cycle through
// options.

// Creates an empty selectable set.
// @param opt_wrap boolean Whether selectNext/Prev should wrap around. Defaults
//     to false.
lib.widget.SelectableSet = function(opt_wrap) {
    this.selectables_ = [];
    this.selected_index_ = -1;
    this.wrap_ = opt_wrap || false;
};

// Add a sprite to the list.  The first sprite added is selected, by default.
// @param sprite lime.Sprite The sprite to add.
// @param opt_select boolean If this sprite should be the selected one.
lib.widget.SelectableSet.prototype.add = function(sprite, opt_select) {
    if (goog.DEBUG && !('select' in sprite && 'deselect' in sprite)) {
        throw "sprite does not extend selectable";
    }

    var len = this.selectables_.push(sprite);
    // If nothing is selected yet and opt_select is not set OR opt_select is
    // true.
    if ((this.selected_index_ == -1 && arguments.length == 1) || opt_select) {
        if (this.selected_index_ != -1) {
            this.selectables_[this.selected_index_].deselect();
        }
        this.selected_index_ = len-1;
        this.selectables_[this.selected_index_].select();
    }
};

lib.widget.SelectableSet.prototype.getSelected = function() {
    if (this.selected_index_ == -1) {
        return null;
    }
    return this.selectables_[this.selected_index_];
};

lib.widget.SelectableSet.prototype.getSelectedIndex = function() {
    return this.selected_index_;
};

lib.widget.SelectableSet.prototype.selectPrev = function() {
    if (this.selected_index_ <= 0) {
        if (this.wrap_) {
            this.selectables_[0].deselect();
            this.selected_index_ = this.selectables_.length-1;
            this.selectables_[this.selected_index_].select();
        }
        return;
    }

    this.selectables_[this.selected_index_].deselect();
    this.selected_index_--;
    this.selectables_[this.selected_index_].select();
};

lib.widget.SelectableSet.prototype.selectNext = function() {
    if (this.selected_index_ >= this.selectables_.length-1) {
        if (this.wrap_) {
            this.selectables_[this.selectables_.length-1].deselect();
            this.selected_index_ = 0;
            this.selectables_[this.selected_index_].select();
        }
        return;
    }

    this.selectables_[this.selected_index_].deselect();
    this.selected_index_++;
    this.selectables_[this.selected_index_].select();
};
