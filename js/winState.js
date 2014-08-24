function WinState(game)
{
    this.game = game;
    this.music = undefined;
    this.msgString = "The broodmother has been defeated, humanity may yet survive...\n\n\n<Click to continue>";
    this.titleString = "You Win";
}

WinState.prototype.thispreload = function() 
{
    //this.game.load.audio('title', ['assets/music/titleTheme.mp3', 'assets/music/titleTheme.ogg']);
};

WinState.prototype.create = function() 
{
    //this.music = this.game.add.audio('title');
    //this.music.play('',0,1,true);
    this.titleText = this.game.add.text(425, 275, this.titleString, { font: 'bold 50px Arial', fill: '#f4fff5' });
    this.titleText.anchor.setTo(0.5, 0.5);
    this.msgText = this.game.add.text(425, 375, this.msgString, { font: '16px Arial', fill: '#f4fff5' });
    this.msgText.anchor.setTo(0.5, 0.5);
};

WinState.prototype.update = function() 
{
    if (this.game.input.activePointer.isDown)
    {
        this.game.state.start('mainMenu', true);
    }
};

WinState.prototype.render = function() 
{

};