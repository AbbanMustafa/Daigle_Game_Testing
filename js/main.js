var Bagels = Bagels || {};

Bagels.dim = Bagels.getGameLandscapeDimensions(26*35,12*35);

//Bagels.game = new Phaser.Game(Bagels.dim.w,Bagels.dim.h, Phaser.AUTO);
Bagels.game = new Phaser.Game(480,320, Phaser.CANVAS);

Bagels.game.state.add('Boot',Bagels.BootState);
Bagels.game.state.add('Preload',Bagels.PreloadState);
Bagels.game.state.add('Game',Bagels.GameState);

Bagels.game.state.start('Boot');