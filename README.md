# Libraries for LimeJs

This is a collection of useful libraries for making games with LimeJs.

## `lib.Debug`

Adds debugging info to sprites.

Example:

    var sprite = lime.Sprite();
    lib.Debug.attach(sprite);

## `lib.collision.GeoHash`

Provide fast location lookups for nearby sprites.

Example:

    var box = new goog.math.Box(0, 200, 200, 0);
    var map = new lib.collision.GeoHash(box);
    map.add(monster_sprite);

## `lib.Cluster`

Creates a cluster of... things.  For example, a platoon of soldiers, a stand of
trees, or a bunch of huts. Makes sure elements are placed near each other 
without looking too regular.

Example:

    var Tree = function() { /* make tree */ };
    var board = new goog.math.Box(0, 200, 200, 0);
    var map = new lib.collision.GeoHash(board);
    var forest = new lib.Cluster()
        .setCreator(Tree)
        .setBoundingBox(board)
        .setMap(map);

## `lib.style`

This sets CSS attributes for sprites.

Example:

    var swamp = new lime.Sprite().setSize(swamp_size);
    lib.style.setBackgroundFrame(swamp, spriteSheet.getFrame('swamp.png'));

## `lib.ProgressBar`

Creates a progress bar.

Example:

    var health = new lib.ProgressBar();
    health.updateProgress(-30); // Down to 70%
    health.updateProgress(40); // Up to 100%

## Random Functions

`lib.label`, `lib.pointLabel`, `lib.random`.
