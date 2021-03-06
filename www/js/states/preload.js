var GAME = GAME || {};

GAME.Preload = function() {};

GAME.Preload.prototype = {
    preload: function() {
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'gui:preloader');
        this.preloadBar.anchor.set(0.5);
        this.load.setPreloadSprite(this.preloadBar);

        this.load.image('tile:grass', 'images/tiles/grass.png');

        this.load.spritesheet('unit:knight', 'images/tiles/units/knight.png', 24, 24);
        this.load.spritesheet('unit:skeleton', 'images/tiles/units/skeleton.png', 24, 24);
        this.load.spritesheet('unit:archer', 'images/tiles/units/archer.png', 24, 24);
        this.load.spritesheet('unit:thief', 'images/tiles/units/thief.png', 24, 24);

        this.load.image('item:tree', 'images/tiles/items/tree.png');

        this.load.spritesheet('effect:attack', 'images/tiles/effects/attack.png', 24, 24);
        this.load.image('effect:blood', 'images/tiles/effects/blood.png');

        this.load.spritesheet('gui:panel', 'images/gui/panel.png', 24, 24);
        this.load.image('gui:stats', 'images/gui/stats.png');
        this.load.spritesheet('gui:information', 'images/gui/information.png', 24, 24);
        this.load.spritesheet('gui:btnNormal', 'images/gui/buttons/btnNormal.png', 12, 12);
        this.load.spritesheet('gui:btnOver', 'images/gui/buttons/btnOver.png', 12, 12);

        this.load.image('tile:arrow', 'images/tiles/arrow.png');
        this.load.image('tile:blank', 'images/tiles/blank.png');
        this.load.image('tile:border', 'images/tiles/border.png');

        this.load.bitmapFont('font:guiOutline', 'fonts/guiOutline.png', 'fonts/guiOutline.xml');
        this.load.bitmapFont('font:gui', 'fonts/gui.png', 'fonts/gui.xml');

        this.load.json("data:items", "data/items.json");
        this.load.json("data:units", "data/units.json");
        this.load.json("data:levels", "data/levels.json");
    },
    create: function() {
        GAME.json = {};
        GAME.json['items'] = this.cache.getJSON("data:items");
        GAME.json['units'] = this.cache.getJSON("data:units");
        GAME.json['levels'] = this.cache.getJSON("data:levels");

        this.state.start("Main");
    }
};
