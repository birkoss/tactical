function Panel(game, spriteSheet, height) {
    this.spriteSheet = (spriteSheet != null ? spriteSheet : "gui:panel");

    Phaser.Group.call(this, game);

    this.createBackground(height);
};

Panel.prototype = Object.create(Phaser.Group.prototype);
Panel.prototype.constructor = Panel;

Panel.prototype.createBackground = function(height) {
    height = (height == null ? 72 : height);
    this.backgroundContainer = this.game.add.group();
    this.addChild(this.backgroundContainer);

    this.background = new Ninepatch(this.game, this.spriteSheet);
    this.background.resize(this.game.width, height);
    this.backgroundContainer.addChild(this.background);
};

Panel.prototype.createTitle = function(label, size) {
    size = (size == null ? 20 : size);

    this.titleContainer = this.game.add.group();
    this.addChild(this.titleContainer);

    this.title = this.game.add.bitmapText(0, 0, "font:gui", label, size);
    this.title.x = (this.game.width - this.title.width) / 2;
    this.title.y = (this.background.height - size) / 2;
    this.titleContainer.addChild(this.title);
};

Panel.prototype.createDescription = function(label, size) {
    size = (size == null ? 10 : size);

    this.description = this.game.add.bitmapText(0, 0, "font:gui", label, size);
    this.description.maxWidth = this.backgroundContainer.width - 48;
    this.description.x = (this.game.width - this.description.width) / 2;
    this.titleContainer.addChild(this.description);

    let totalHeight = this.title.height + 12 + this.description.height;

    this.title.y = (this.backgroundContainer.height - totalHeight) / 2;
    this.description.y = this.title.y + this.title.height + 12;
};

Panel.prototype.addButton = function(button) {
    if (this.buttonsContainer == null) {
        this.buttonsContainer = this.game.add.group();
        this.addChild(this.buttonsContainer);
    }

    button.x = (this.backgroundContainer.width - button.width) / 2;
    button.y = (this.backgroundContainer.height - button.height) /2;
    button.y -= 2;

    this.buttonsContainer.addChild(button);
};

Panel.prototype.setTitle = function(label) {
    this.title.text = label;
    this.title.x = (this.game.width - this.title.width) / 2;
};

Panel.prototype.addStat = function(label, value, max, showProgress) {
    if (this.statsContainer == null) {
        this.statsContainer = this.game.add.group();
        this.addChild(this.statsContainer);

        let background = this.statsContainer.create(0, 0, "gui:stats");
        this.statsContainer.x = (this.backgroundContainer.width - this.statsContainer.width) / 2;
    }

    let maxWidth = this.background.width - 48;

    let text = this.game.add.bitmapText(0, 0, "font:gui", label, 10);
    let subtitle = "";

    switch (label) {
        case "HP":
            text.x = 5;
            text.y = 4;
            break;
        case "ATB":
            text.x = 5;
            text.y = 15;
            break;
        case "ATK":
            text.x = 8;
            text.y = 33;
            subtitle = value;
            if (max > value) {
                substitle += " (+" + max + ")";
            }
            break;
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

};
