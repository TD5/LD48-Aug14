"use strict";

var game = new Phaser.Game(850, 550, Phaser.AUTO, 'game', null, false, false);
var preloaderState = new Preloader(game);
game.state.add('preloader', preloaderState);
game.state.start('preloader');