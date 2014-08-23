var game = new Phaser.Game(850, 550, Phaser.AUTO, 'game', null, false, false);
var mainMenuState = new MainMenuState(game);
var mainGameState = new MainGameState(game);
game.state.add('mainMenu', mainMenuState);
game.state.add('mainGame', mainGameState);
game.state.start('mainMenu');