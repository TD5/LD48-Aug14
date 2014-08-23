function MainGameState(game)
{
    this.game = game;
    this.music = undefined;
    this.jumpEnd = 0;
}

MainGameState.prototype.preload = function() {
    this.game.load.tilemap('lvl1', 'assets/maps/lvl1.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('lvl1tiles', 'assets/maps/lvl1tiles.png');
    this.game.load.image('player', 'assets/graphics/player.png');
    this.game.load.audio('overworld', ['assets/music/overworld.mp3', 'assets/music/overworld.ogg']);
};

MainGameState.prototype.create = function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.stage.backgroundColor = '#000000';
    this.map = this.game.add.tilemap('lvl1');
    this.map.addTilesetImage('lvl1tiles');
    this.map.setCollisionByExclusion([ 2, 4, 6, 8, 10]);
    this.layer = this.map.createLayer('layer1');
    // layer.debug = true;
    this.layer.resizeWorld();
    this.game.physics.arcade.gravity.y = 250;
    this.player = this.game.add.sprite(120, 100, 'player');
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.body.bounce.y = 0.0;
    this.player.body.collideWorldBounds = true;
    this.player.body.setSize(50, 90, 5, 5);
    this.player.anchor.setTo(0.5,0.5);
    this.game.camera.follow(this.player);
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.music = this.game.add.audio('overworld');
    this.music.play('',0,1,true);
};

MainGameState.prototype.update = function() {
    this.game.physics.arcade.collide(this.player, this.layer);
    this.player.body.velocity.x = 0;
    if (this.cursors.left.isDown)
    {
        this.player.body.velocity.x = -150;
        if (this.facing != 'left')
        {
            this.player.scale.x = Math.abs(this.player.scale.x);
            this.facing = 'left';
        }
    }
    else if (this.cursors.right.isDown)
    {
        this.player.body.velocity.x = 150;

        if (this.facing != 'right')
        {
            this.player.scale.x = -Math.abs(this.player.scale.x);
            this.facing = 'right';
        }
    }

    if (this.cursors.up.isDown && this.player.body.onFloor() && this.game.time.now > this.jumpEnd)
    {
        this.player.body.velocity.y = -280;
        this.jumpEnd = this.game.time.now + 1000;
    }
};

MainGameState.prototype.render = function() {

};