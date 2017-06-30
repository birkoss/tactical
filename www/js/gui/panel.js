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
