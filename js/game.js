"use strict";

var game = new Phaser.Game(850, 550, Phaser.AUTO, 'game', null, false, false);
var preloaderState = new Preloader(game);
var boot = {
  preload: function () {
      this.load.image('loadingBar', 'assets/graphics/loadingBar.png');
  },
  create: function () {
      game.state.add('preloader', preloaderState);
      game.state.start('preloader');
  }
};
game.state.add('boot', boot);
game.state.start('boot');