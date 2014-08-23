function Preloader(game)
{
    this.game = game;
}

Preloader.prototype.preload = function() {
    var mainMenuState = new MainMenuState(game);
    var mainGameState = new MainGameState(game);
    var gameOverState = new GameOverState(game);
    mainMenuState.thispreload();
    mainGameState.thispreload();
    gameOverState.thispreload();
    this.game.state.add('mainMenu', mainMenuState);
    this.game.state.add('mainGame', mainGameState);
    this.game.state.add('gameOver', gameOverState);
};

Preloader.prototype.create = function() {
    this.game.state.start('mainMenu');
};