function MainGameState(game)
{
    this.game = game;
    this.sfx = undefined;
    this.jumpEnd = 0;
    this.LASER_POOL_SIZE = 30;
    this.FIRE_DELAY = 100;
    this.SMALL_LASER_SPEED = 800;
}

MainGameState.prototype.preload = function() {
    this.game.load.tilemap('lvl1', 'assets/maps/lvl1.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('lvl1tiles', 'assets/maps/lvl1tiles.png');
    this.game.load.game.load.spritesheet ('player', 'assets/graphics/player.png', 60, 100);
    this.game.load.audio('overworld', ['assets/music/overworld.mp3', 'assets/music/overworld.ogg']);
    this.game.load.audio('jumpjet', ['assets/sounds/jet.wav']);
    this.game.load.image('smallLaserBeam', 'assets/graphics/small_laser.png');
    this.game.load.audio('smallLaserBeamSfx', 'assets/sounds/smallLaser.wav');
};

MainGameState.prototype.create = function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.stage.backgroundColor = '#000000';
    this.map = this.game.add.tilemap('lvl1');
    this.map.addTilesetImage('lvl1tiles');
    this.map.setCollision([1, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], true);
    this.map.setCollision([2, 4], false);
    this.layer = this.map.createLayer('layer1');
    // layer.debug = true;
    this.layer.resizeWorld();
    this.game.physics.arcade.gravity.y = 250;
    this.player = this.game.add.sprite(120, 100, 'player');
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.body.bounce.y = 0.0;
    this.player.body.collideWorldBounds = true;
    this.player.body.setSize(50, 90, 0, 5);
    this.player.anchor.setTo(0.5,0.5);
    this.player.animations.add('run', [0, 1, 2, 3], 10, true);
    this.player.animations.add('stop', [0], 10, true);
    this.player.animations.add('jet', [4, 5], 10, true);
    this.game.camera.follow(this.player);
    this.game.camera.deadzone = new Phaser.Rectangle(300, 250, 250, 50);
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.music = this.game.add.audio('overworld');
    this.music.play('',0,1,true);
    this.jumpsfx = this.game.add.audio('jumpjet');
    this.smallLasersfx = this.game.add.audio('smallLaserBeamSfx');

    this.smallLaserPool = this.game.add.group();
    for(var i = 0; i < this.LASER_POOL_SIZE; i++) {
        var smallLaserBeam = this.game.add.sprite(0, 0, 'smallLaserBeam');
        this.smallLaserPool.add(smallLaserBeam);
        smallLaserBeam.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(smallLaserBeam, Phaser.Physics.ARCADE);
        smallLaserBeam.body.allowGravity = false;
        smallLaserBeam.kill();
    }
    
    this.clipText = this.game.add.text(16, 16, '', { fontSize: '32px', fill: '#ffffff' });
    this.clipText.fixedToCamera = true;
};

MainGameState.prototype.update = function() {
    this.game.physics.arcade.collide(this.player, this.layer);
    this.player.body.velocity.x = 0;
    
    // TOOD Handle laser beams colliding with things
    
    if (!this.jumping && this.cursors.up.isDown && this.game.time.now > this.jumpEnd)
    {
        this.player.body.velocity.y = -280;
        this.jumpEnd = this.game.time.now + 1000;
        this.jumping = true;
        this.player.animations.play('jet');
        this.jumpsfx.play('',0,1,false);
    }
    else if (!this.cursors.up.isDown && this.player.body.onFloor())
    {
        this.jumping = false;
    }
    
    if (this.cursors.left.isDown)
    {
        this.player.body.velocity.x = -150;
        if (!this.jumping)
        {
            if (this.player.body.onFloor())
            {
                this.player.animations.play('run');
            }
            else
            {
                this.player.animations.stop();
            }
        }
        if (this.running != 'left')
        {
            this.player.scale.x = Math.abs(this.player.scale.x);
            this.facing = 'left';
            this.running = 'left';
        }
    }
    else if (this.cursors.right.isDown)
    {
        this.player.body.velocity.x = 150;

        if (!this.jumping)
        {
            if (this.player.body.onFloor())
            {
                this.player.animations.play('run');
            }
            else
            {
                this.player.animations.stop();
            }
        }
        if (this.running != 'right')
        {
            this.player.scale.x = -Math.abs(this.player.scale.x);
            this.facing = 'right';
            this.running = 'right';
        }
    }
    else if (!this.jumping)
    {
        this.running = 'none';
        this.player.animations.stop();
        this.player.frame = 0;
    }
    
    if (this.fireButton.isDown)
    {
        this.fire();
    }
};

MainGameState.prototype.fire = function() 
{
    if (this.lastSmallLaserFiredAt === undefined) this.lastSmallLaserFiredAt = 0;
    if (this.game.time.now - this.lastSmallLaserFiredAt < this.FIRE_DELAY)
    {
        return;
    }
    this.lastSmallLaserFiredAt = this.game.time.now;
    var smallLaserBeam = this.smallLaserPool.getFirstDead();
    if (smallLaserBeam === null || smallLaserBeam === undefined) return;
    smallLaserBeam.revive();
    smallLaserBeam.checkWorldBounds = true;
    smallLaserBeam.outOfBoundsKill = true;
    if (this.facing === 'left')
    {
        smallLaserBeam.reset(this.player.x-this.player.body.halfWidth, this.player.y+7); 
        smallLaserBeam.body.velocity.x = -this.SMALL_LASER_SPEED;
    }
    else
    {
        smallLaserBeam.reset(this.player.x+this.player.body.halfWidth, this.player.y+7);
        smallLaserBeam.body.velocity.x = this.SMALL_LASER_SPEED;
    }
    smallLaserBeam.body.velocity.y = Math.floor(this.gaussian() * 80) + 1;
    this.smallLasersfx.play('',0,1,false);
};

MainGameState.prototype.gaussian = function()
{
    return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
}

MainGameState.prototype.render = function() {
    if (this.smallLaserPool.countDead() !== 0)
    {
        this.clipText.text = "Clip: ";
        for (var i = 0; i < this.smallLaserPool.countDead(); i++)
        {
            this.clipText.text += "|";
        }
    }
    else
    {
        this.clipText.text = "Clip: EMPTY";
    }
};