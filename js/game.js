var game = new Phaser.Game(850, 550, Phaser.AUTO, 'game', null, false, false);
var mainMenuState = new MainMenuState(game);
game.state.add('mainMenu', mainMenuState);
game.state.start('mainMenu');