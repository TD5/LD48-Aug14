function MainMenuState(game)
{
    this.game = game;
    this.music = undefined;
    this.background = undefined;
    this.timeElapsed = undefined;
    this.titleText = undefined;
    this.titleString = "Adamantium\n   [ Cyborg ]";
    this.introString = "The Final War was a cataclysmic event that wiped out entire star systems.          \nThe weapons used to create such utter destruction took their toll on the fabric of spacetime.          \nA huge network of interconnected wormholes began to open up, linking distant places and times.          \nThe entities that dared design and use these weapons are still at large.          \nWe do not know what their next move will be, but we know our options are limited.          \n          \nYou are the only one left that can stop them.          \n          \nPlease help us.          \n          \n          \n<Click to begin>";
}

MainMenuState.prototype.preload = function() {
    this.game.load.image('mainMenuBackground', 'assets/graphics/mainMenuBackground.png');
    this.game.load.audio('title', ['assets/music/titleTheme.mp3', 'assets/music/titleTheme.ogg']);
};

MainMenuState.prototype.create = function() {
    this.background = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'mainMenuBackground');
    this.background.anchor.setTo(0.5, 0.5);
    this.background.inputEnabled = true;
    this.background.events.onInputDown.add(this.onClicklistener, this);
    this.music = this.game.add.audio('title');
    this.music.play('',0,1,true);
    this.titleText = this.game.add.text(50, 50, '', { font: 'bold 50px Arial', fill: '#f4fff5' });
    this.introText = this.game.add.text(50, 250, '', { font: '16px Arial', fill: '#cccccc' });
    this.timeElapsed = 0;
};

MainMenuState.prototype.onClicklistener = function() {
    this.music.destroy();
    this.game.state.start('mainGame');
}

MainMenuState.prototype.update = function() {

};

MainMenuState.prototype.render = function() {
    this.timeElapsed += this.game.time.elapsed;
    var numTitleCharsToShow = Math.max(Math.min(this.titleString.length, -50 + (this.timeElapsed / 100)), 0);
    this.titleText.text = this.titleString.substring(0, numTitleCharsToShow);
    var numIntroCharsToShow = Math.max(Math.min(this.introString.length, -180 + (this.timeElapsed / 50)), 0);
    this.introText.text = this.introString.substring(0, numIntroCharsToShow);
};