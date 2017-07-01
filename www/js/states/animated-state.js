function AnimatedState() {
    this.containers = [];
    this.changeSpeed(500);
};

AnimatedState.Animation = {
    SlideUp: "slide_up",
    SlideDown: "slide_down",
    SlideRight: "slide_right"
};

AnimatedState.Dimension = {
    Panel:{width:60, height:60},
    Navigator:{width:40, height:40}
};

AnimatedState.prototype = {
    changeSpeed: function(newSpeed) {
        this.speed = newSpeed;
    },
    show: function() {
        /* Initialise positions and hide the containers */
        this.containers.forEach(function(container) {
            switch (container.animation) {
                case AnimatedState.Animation.SlideDown:
                    if (container.originalY == null) {
                        container.originalY = container.y;
                        container.destinationY = container.y - this.game.height;
                    }

                    container.y = container.destinationY;
                    break;
                case AnimatedState.Animation.SlideRight:
                    if (container.originalX == null) {
                        container.originalX = container.x;
                        container.destinationX = container.x + this.game.width;
                    }

                    container.x = container.destinationX;
                    break;
                case AnimatedState.Animation.SlideUp:
                    if (container.originalY == null) {
                        container.originalY = container.y;
                        container.destinationY = container.y + container.height;
                    }

                    container.y = container.destinationY;
                    break;
            }
        }, this);

        /* Show the containers */
        this.containers.forEach(function(container) {
            switch (container.animation) {
                case AnimatedState.Animation.SlideDown:
                case AnimatedState.Animation.SlideUp:
                    this.game.add.tween(container).to({y:container.originalY}, this.speed, Phaser.Easing.Exponential.Out).start();
                    break;
                case AnimatedState.Animation.SlideRight:
                    this.game.add.tween(container).to({x:container.originalX}, this.speed, Phaser.Easing.Exponential.Out).start();
                    break;
            }
        }, this);
    },
    hide: function(callback, context) {
        this.callback = callback;
        if (context == null) {
            context = this;
        }

        this.containers.forEach(function(container) {
            let tween = null;
            switch (container.animation) {
                case AnimatedState.Animation.SlideDown:
                case AnimatedState.Animation.SlideUp:
                    tween = this.game.add.tween(container).to({y:container.destinationY}, this.speed, Phaser.Easing.Exponential.In);
                    break;
                case AnimatedState.Animation.SlideRight:
                    tween = this.game.add.tween(container).to({x:container.destinationX}, this.speed, Phaser.Easing.Exponential.In);
                    break;
            }

            if (tween != null) {
                tween.onComplete.add(this.onTweenCompleted, context);
                tween.start();
            }

        }, this);
    },
    onTweenCompleted: function() {
        if (this.game.tweens.getAll().length == 1) {
            if (this.callback != null) {
                this.callback();
                this.callback = null;
            }
        }
    }
};


