var Bagels = Bagels || {};

Bagels.BootState = {
  init: function(){
    this.game.backgroundColor = '#fff';
    
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    this.scale.pageAlignVertically = true;
    this.scale.pageAlignHorizontally = true;
    
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  },
  preload: function(){
    this.load.image('preloadbar','assets/images/preloader-bar.png');
  },
  create: function(){
    this.state.start('Preload');
  }
}