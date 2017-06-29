function Popup(game) {
    Phaser.Group.call(this, game);

    this.overlayContainer = this.game.add.group();
    this.popupContainer = this.game.add.group();

    this.containers = new Array();

    this.maxWidth = this.game.width - 40;
    this.maxHeight = 0;
    this.padding = 24;

    this.background = this.popupContainer.create(0, 0, "tile:blank");

    this.onPopupShown = new Phaser.Signal();
    this.onPopupHidden = new Phaser.Signal();

    this.listView = null;
    this.listViewItems = [];

    /* Create a click blocker */
    this.getContainer("listViewClickBlocker").outside = true;
}

Popup.prototype = Object.create(Phaser.Group.prototype);
Popup.prototype.constructor = Popup;

Popup.SPEED = 800;

Popup.prototype.getContainer = function(containerName) {
    let container = null;
    this.containers.forEach(function(singleContainer) {
        if (singleContainer.name == containerName) {
            container = singleContainer;
        }
    }, this);

    /* Create the new container */
    if (container == null) {
        let group = this.game.add.group();
        this.popupContainer.add(group);

        container = {group:group, name:containerName};
        this.containers.push(container);
    }

    return container;
};

Popup.prototype.addButton = function(label, callback, context, sprite) {
    let group = this.getContainer("buttons").group;

    if (sprite == undefined) {
        sprite = "";
    }
    let button = new PanelButton(this.game, label, sprite);
    if (callback != null) {
        button.onClicked.add(callback, context);
    }
    if (group.children.length > 0) {
        button.y += group.height + this.padding;
    }
    group.addChild(button);

	return button;
};

Popup.prototype.close = function() {
    this.hide();
};

Popup.prototype.createOverlay = function(opacity, color) {
    if (opacity == null) {
        opacity = 0.5;
    }
    if (color == null) {
        color = 0x000000;
    }
    let background = this.overlayContainer.create(0, 0, "tile:blank");
    background.tint = color;
    background.alpha = opacity;
    background.width = this.game.width;
    background.height = this.game.height;
    background.inputEnabled = true;
};

Popup.prototype.createTitle = function(label) {
    let group = this.getContainer("title").group;

    let text = this.game.add.bitmapText(0, 0, "font:gui", label, 20);
    text.align = "center";
    text.maxWidth = this.maxWidth - (this.padding*2);
    text.tint = 0x954578;
    text.anchor.set(0.5, 0.5);
    text.x += text.width/2;
    text.y += text.height/2;

    group.addChild(text);
};

Popup.prototype.createCloseButton = function() {
    let group = this.getContainer("closeButton").group;

    let btnClose = group.create(0, 0, "gui:btnClose");
    let iconClose = group.create(0, 0, "icon:close");
    iconClose.anchor.set(0.5, 0.5);
    iconClose.x = btnClose.width/2;
    iconClose.y = btnClose.height/2;
    btnClose.addChild(iconClose);

    btnClose.inputEnabled = true;
    btnClose.events.onInputUp.add(function() {
        this.close();
    }, this);

    this.getContainer("closeButton").outside = true;
};

Popup.prototype.generate = function() {
    let containerY = 0;
    this.containers.forEach(function(singleContainer) {
        if (singleContainer.outside == undefined) {
            let paddingBottom = this.padding;
            if (singleContainer.x != undefined) {
                singleContainer.group.x = singleContainer.x;
            } else {
                singleContainer.group.x = (this.maxWidth - singleContainer.group.width) / 2;
            }
            if (singleContainer.y != undefined) {
                singleContainer.group.y = singleContainer.y;
            } else {
                if (singleContainer.paddingTop == undefined) {
                    containerY += this.padding;
                } else if(singleContainer.paddingTop > 0) {
                    containerY += singleContainer.paddingTop;
                }
                singleContainer.group.y = containerY;
                if (singleContainer.paddingBottom != undefined) {
                    containerY += singleContainer.paddingBottom;
                }

                containerY += singleContainer.group.height;
            }
        }
    }, this);

    containerY += this.padding;

    //this.background.resize(this.maxWidth, containerY);
    this.background.width = this.maxWidth;
    this.background.height = (this.maxHeight == 0 ? containerY : this.maxHeight);

    this.popupContainer.x = (this.game.width - this.background.width) /2;
    this.popupContainer.y = (this.game.height - this.background.height) /2;

    this.popupContainer.destinationY = -this.popupContainer.height;
    this.popupContainer.originalY = this.popupContainer.y;

    this.popupContainer.y = this.popupContainer.destinationY;

    this.show();
};

Popup.prototype.hide = function(callback) {
    let tween = this.game.add.tween(this.popupContainer).to({y:this.popupContainer.destinationY}, Popup.SPEED, Phaser.Easing.Exponential.In);
    tween.onComplete.add(function() {
        this.onPopupHidden.dispatch(this, 0);
        this.overlayContainer.destroy();
        this.removeAll(true);
        this.destroy();
        if (callback != null) {
            callback();
        }
    }, this);
    tween.start();
};

Popup.prototype.show = function() {
    let tween = this.game.add.tween(this.popupContainer).to({y:this.popupContainer.originalY}, Popup.SPEED, Phaser.Easing.Exponential.Out);
    tween.onComplete.add(function() {
        this.onPopupShown.dispatch(this);
    }, this);
    tween.start();
};
