var Bagels = Bagels || {};

Bagels.PreloadState = {
  init: function(){
    this.preloadBar = this.add.sprite(this.game.world.centerX,this.game.world.centerY,'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(5);
    
    this.load.setPreloadSprite(this.preloadBar);
  },
  preload: function(){
    console.log('loading....');
    this.load.image('actionButton','assets/images/actionButton.png');
    this.load.image('arrowButton','assets/images/arrowButton.png');
    this.load.image('endOfLevel','assets/images/endOfLevel.png');
    this.load.spritesheet('fly','assets/images/fly_spritesheet.png');
    this.load.image('goal','assets/images/goal.png');
    this.load.image('marker','assets/images/marker.png');
    this.load.image('pendulum_mass','assets/images/pendulum_mass.png');
    this.load.image('pendulum_string','assets/images/pendulum_string.png');
    this.load.image('preloader-bar','assets/images/preloader-bar.png');
    this.load.image('purple_center','assets/images/purple_center.png');
    this.load.image('purple_left','assets/images/purple_left.png');
    this.load.image('purple_right','assets/images/purple_right.png');
    this.load.spritesheet('runner','assets/images/runner_spritesheet.png',28,32,5,1,1);
    this.load.image('shelf_double','assets/images/shelf_double.png');
    this.load.image('shelf_long','assets/images/shelf_long.png');
    this.load.image('shelf_small','assets/images/shelf_small.png');
    this.load.image('slime','assets/images/slime.png');
    this.load.image('string','assets/images/string.png');
    this.load.image('table_large','assets/images/platform_large.png');
    this.load.image('table_medium','assets/images/platform_medium.png');
    this.load.image('table_small','assets/images/platform_small.png');
    
    this.load.image('coin','assets/images/coin.png');
    this.load.image('pendulum_ass','assets/images/pendulum_mass.png');
    this.load.image('pendulum_string','assets/images/pendulum_string.png');
    this.load.image('pendulum_shadow','assets/images/pendulum_shadow.png');

    this.load.atlasJSONHash('daigle','assets/images/daigle.png','assets/images/daigle.json');
    
    this.load.image('gameTiles','assets/images/tiles_spritesheet.png');
    this.load.tilemap('bagelMap','assets/levels/bagelMap.json',null,Phaser.Tilemap.TILED_JSON);
    
    this.load.image('daigles_tiles','assets/levels/daiglestiles.png');
    this.load.tilemap('daigles_room','assets/levels/background.json',null,Phaser.Tilemap.TILED_JSON);
    
  },
  update: function(){
    if(!this.load.isLoading){
        this.state.start('Game');
    }
  }
}