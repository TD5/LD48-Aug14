function GameOverState(game)
{
    this.game = game;
    this.music = undefined;
    this.msgString = "<Press any key to continue>";
    this.titleString = "Game Over";
}

GameOverState.prototype.thispreload = function() {
    //this.game.load.audio('title', ['assets/music/titleTheme.mp3', 'assets/music/titleTheme.ogg']);
};

GameOverState.prototype.create = function() {
    //this.music = this.game.add.audio('title');
    //this.music.play('',0,1,true);
    this.titleText = this.game.add.text(425, 275, this.titleString, { font: 'bold 50px Arial', fill: '#f4fff5' });
    this.titleText.anchor.setTo(0.5, 0.5);
    this.msgText = this.game.add.text(425, 375, this.msgString, { font: '16px Arial', fill: '#f4fff5' });
    this.msgText.anchor.setTo(0.5, 0.5);
    this.game.input.keyboard.onDownCallback = this.onPresslistener;
};

GameOverState.prototype.onPresslistener = function() {
    this.game.state.start('mainMenu');
}

GameOverState.prototype.update = function() {

};

GameOverState.prototype.render = function() {

};