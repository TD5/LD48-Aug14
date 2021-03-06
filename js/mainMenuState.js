function MainMenuState(game)
{
    this.WAIT_PERIOD = 6000;
    this.game = game;
    this.titleString = "Adamantium\n   [ Cyborg ]";
    this.introString = "The Final War was a cataclysmic event that wiped out entire star systems.          \nThe weapons used to create such utter destruction took their toll on the fabric of spacetime.          \nA huge network of interconnected wormholes began to open up, linking us to distant places and times.          \nEntities even more deadly than our Final War foes stepped through the nascent wormholes and took root\nin our homeworld.          \nThe newly arrived alien broodmothers reproduce at an alarming rate, creating yet more vile infestations.          \nThese primordial flesh sacks are nigh on invincible: nothing in our arsenal can match them.          \n          \nYou are the only one left that has a chance to end this and bring hope to humanity.          \n          \nPlease help us.          \n          \n          \n<Click to begin>";
    
}

MainMenuState.prototype.thispreload = function() 
{
    this.game.load.image('mainMenuBackground', 'assets/graphics/mainMenuBackground.png');
    this.game.load.audio('title', ['assets/music/titleTheme.mp3', 'assets/music/titleTheme.ogg']);
};

MainMenuState.prototype.create = function() {
    this.background = this.game.add.sprite(0, 0, 'mainMenuBackground');
    this.background.anchor.setTo(0, 0);
    this.game.camera.follow(this.background);
    this.music = this.game.add.audio('title');
    this.music.play('',0,1,true);
    this.titleText = this.game.add.text(50, 50, '', { font: 'bold 50px Arial', fill: '#f4fff5' });
    this.titleText.fixedToCamera = true;
    this.introText = this.game.add.text(50, 200, '', { font: '16px Arial', fill: '#cccccc' });
    this.introText.fixedToCamera = true;
    this.timeElapsed = 0;
};

MainMenuState.prototype.update = function() 
{

};

MainMenuState.prototype.render = function() 
{
    this.timeElapsed += this.game.time.elapsed;
    var numTitleCharsToShow = Math.max(Math.min(this.titleString.length, -50 + (this.timeElapsed / 100)), 0);
    this.titleText.text = this.titleString.substring(0, numTitleCharsToShow);
    var numIntroCharsToShow = Math.max(Math.min(this.introString.length, -160 + (this.timeElapsed / 50)), 0);
    this.introText.text = this.introString.substring(0, numIntroCharsToShow);
    if (this.timeElapsed > this.WAIT_PERIOD && this.game.input.activePointer.isDown)
    {
        this.game.state.start('mainGame');
    }
};

MainMenuState.prototype.shutdown = function() 
{
    this.music.destroy();
    this.titleText.destroy();
    this.introText.destroy();
    this.background.destroy();
};