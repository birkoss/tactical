var GAME = GAME || {};

GAME.Preload = function() {};

GAME.Preload.prototype = {
    preload: function() {
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'gui:preloader');
        this.preloadBar.anchor.set(0.5);
        this.load.setPreloadSprite(this.preloadBar);

        this.load.image('tile:grass', 'images/tiles/grass.png');

        this.load.image('unit:knight', 'images/tiles/units/knight.png');

        this.load.spritesheet('effect:attack', 'images/tiles/effects/attack.png', 24, 24);

        this.load.spritesheet('tile:dungeon', 'images/tiles/dungeon.png', 32, 32);
        this.load.image('tile:arrow', 'images/tiles/arrow.png');
        this.load.image('tile:blank', 'images/tiles/blank.png');
        this.load.image('tile:border2', 'images/tiles/border2.png');
        this.load.image('tile:border', 'images/tiles/border.png');
        this.load.spritesheet('tile:selector', 'images/tiles/selector.png', 40, 40);

        this.load.bitmapFont('font:guiOutline', 'fonts/guiOutline.png', 'fonts/guiOutline.xml');
        this.load.bitmapFont('font:gui', 'fonts/gui.png', 'fonts/gui.xml');

    },
    create: function() {
        this.state.start("Main");
    }
};
