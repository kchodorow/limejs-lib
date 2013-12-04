goog.provide('lib');
goog.provide('lib.color');

var FONT_SIZE = 24;
var FONT_COLOR = '#000';
var FONT_FAMILY = 'Arial';

// If one arg is given: generate a random number in [0, num1).
// If two args are given: generate a random number in [num1, num2).
lib.random = function(num1, num2) {
    if (num2 == undefined) {
        return Math.floor(Math.random()*num1);
    }
    // Make sure the smaller number is first
    if (num1 > num2) {
        var temp = num1;
        num1 = num2;
        num2 = temp;
    }
    return Math.floor(Math.random()*(num2-num1))+num1;
};

// Create a label.  Requires:
// *  FONT_SIZE
// *  FONT_COLOR
// *  FONT_FAMILY
lib.label = function(text) {
    var lbl = new lime.Label().setText(text).setFontSize(FONT_SIZE)
        .setFontColor(FONT_COLOR)
        .setFontFamily(FONT_FAMILY).setMultiline(true);
    lbl.createDomElement();
    goog.style.setStyle(lbl.domElement, {cursor: 'default'});
    return lbl;
};

// Takes two sprites, centers one in the other.
lib.center = function(inner, outer) {
    var min = inner.measureContents();
    var max = outer.measureContents();
    var max_width = max.right - max.left;
    var max_height = max.bottom - max.top;
    var min_width = min.right - min.left;
    var min_height = min.bottom - min.top;
    return new goog.math.Coordinate(
        (max_width - min_width)/2,
        (max_height - min_height)/2);
};

lib.color.toRgbString = function(rgb) {
    return 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';
};

