var GAME = GAME || {};

GAME.Main = function() {
};

GAME.Main.prototype.create = function() {
    this.mapContainer = this.game.add.group();
    this.createMap();
};

GAME.Main.prototype.createMap = function() {
    this.map = new Map(this.game);

    this.map.createGrid(8, 8);
    this.map.setTheme("forest");

    this.map.generate();

    this.mapContainer.addChild(this.map);
}
