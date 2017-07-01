function PopupEntity(game, maxWidth, maxHeight) {
    Popup.call(this, game, maxWidth, maxHeight);
}

PopupEntity.prototype = Object.create(Popup.prototype);
PopupEntity.prototype.constructor = PopupEntity;

PopupEntity.prototype.addText = function(x, y, label) {
    let text = this.game.add.bitmapText(x, y, "font:gui", label, 10);
    this.getContainer("stats").group.addChild(text);
    return text;
};

PopupEntity.prototype.addProgressBar = function(x, y, maxWidth, value, max, color) {
    let group = this.getContainer("stats").group;

    let bg = group.create(x, y + 1, "tile:blank");
    bg.tint = 0x525252;
    bg.x = 36;
    bg.width = maxWidth - x - 37;
    bg.height = 8;

    let filling = group.create(bg.x, bg.y, "tile:blank");
    filling.height = bg.height;
    filling.width = (bg.width * value / max);
    filling.tint = color;

    text = this.game.add.bitmapText(0, bg.y - 2, "font:gui", value + "/" + max, 10);
    text.x = (bg.width/2);
    group.addChild(text);
};

PopupEntity.prototype.addEntity = function(entity) {
    this.entity = entity;

    let title = this.getContainer("title").group;

    let text;
    switch (entity.type) {
        case "unit":
            text = this.addText(0, 0, entity.data.name + " (LV " + entity.level + ")");
            title.addChild(text);
            
            let group = this.getContainer("stats").group;
            let background = group.create(0, 0, "gui:stats");

            text = this.addText(5, 4, "HP");
            this.addProgressBar(text.x, text.y, background.width, entity.stats.attack, entity.getAttack(), 0xff322f);

            text = this.addText(5, 13, "ATB");
            this.addProgressBar(text.x, text.y, background.width, entity.ATB, entity.getMaxATB(), 0x70a426);

            text = this.addText(8, 33, "ATK");
            let subtitle = entity.stats.attack;
            if (entity.getAttack() > entity.stats.attack) {
                substitle += " (+" + entity.getAttack() + ")";
            }

            text = this.addText(text.x, text.y, subtitle);
            text.x += (119 - text.width);

            text = this.addText(144, 33, "DEF");
            subtitle = entity.stats.defense;
            if (entity.getDefense() > entity.stats.defense) {
                substitle += " (+" + entity.getDefense() + ")";
            }

            text = this.addText(text.x, text.y, subtitle);
            text.x += (119 - text.width);
            break;
        case "item":
            text = this.addText(0, 0, entity.data.name);
            title.addChild(text);
            
            let description = this.getContainer("description").group;

            text = this.addText(0, 0, entity.data.description);
            text.maxWidth = this.maxWidth - 48;
            description.addChild(text);
            break;
    }
};

PopupEntity.prototype.show = function() {
    this.entity.parent.parent.highlightTile(this.entity.gridX, this.entity.gridY);

    Popup.prototype.show.call(this)
};

PopupEntity.prototype.hide = function() {
    this.entity.parent.parent.resetTiles();

    Popup.prototype.hide.call(this)
};
