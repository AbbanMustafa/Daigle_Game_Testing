var Bagels = Bagels || {};

Bagels.Pendulum = function(game,x,y,w,h,tweenData){
  Phaser.Group.call(this,game);
  
  this.game = game;
  
  this.string = this.game.make.tileSprite(x,y,w,h,'pendulum_string');
  this.string.anchor.setTo(0.5,0);
  this.mass = this.game.make.sprite(x,y,'pendulum_mass');
  this.masss.anchor.setTo(0.5,0);
  this.game.physics.arcade.enable(this.mass);
  this.mass.body.allowGravity = false;
  this.mass.body.immovable = true;
  this.string.addChild(this.mass);
}

Bagels.Pendulum.prototype = Object.create(Phaser.Group.prototype);
Bagels.Pendulum.prototype.constructor = Bagels.Pendulum;