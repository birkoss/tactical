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
    console.log("add entity...");
    let title = this.getContainer("title").group;

    let group = this.getContainer("stats").group;

    switch (entity.type) {
        case "unit":
            let text = this.addText(0, 0, entity.data.name + " (LV " + entity.level + ")");
            title.addChild(text);
            
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
    }

    /*

    let maxWidth = this.background.width - 48;

    let text = this.game.add.bitmapText(0, 0, "font:gui", label, 10);
    let subtitle = "";

        case "DEF":
            text.x = 144;
            text.y = 33;
            subtitle = value;
            if (max > value) {
                substitle += " (+" + max + ")";
            }
            break;
        default:
            if (this.statsContainer.children.length > 0) {
                text.y = this.statsContainer.height;
            }
    }

    this.statsContainer.addChild(text);

    if (subtitle != "") {
        text = this.game.add.bitmapText(text.x, text.y, "font:gui", subtitle, 10);
        text.x += (119 - text.width);
        this.statsContainer.addChild(text);
    } else if (showProgress) {
        let bg = this.statsContainer.create(text.x, text.y + 1, "tile:blank");
        bg.tint = 0x525252;
        bg.x = 36;
        bg.width = maxWidth - text.x - 37;
        bg.height = 8;

        let filling = this.statsContainer.create(bg.x, bg.y, "tile:blank");
        filling.height = bg.height;
        filling.width = (bg.width * value / max);
        filling.tint = (label == "HP" ? 0xff322f : 0x70a426);

        text = this.game.add.bitmapText(0, bg.y - 2, "font:gui", value + "/" + max, 10);
        text.x = (bg.width/2);
        this.statsContainer.addChild(text);
    }
    */
};
