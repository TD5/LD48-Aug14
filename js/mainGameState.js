function MainGameState(game)
{
    this.game = game;
    this.music = undefined;
}

MainGameState.prototype.preload = function() {
    this.game.load.tilemap('lvl1', 'assets/maps/lvl1.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('lvl1tiles', 'assets/maps/lvl1tiles.png');
    
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
    this.game.physics.arcade.gravity.y = 300;
};

MainGameState.prototype.update = function() {

};

MainGameState.prototype.render = function() {

};