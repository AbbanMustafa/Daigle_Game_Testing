var Bagels = Bagels || {};

Bagels.Table = function(game,tilePool,coinPool,numTiles, x, y,speed){
  Phaser.Group.call(this,game);
  
  this.tileSize = 35;
  this.game = game;
  this.enableBody = true;
  this.tilePool = tilePool;
  this.coinPool = coinPool;
  this.coinPool.enableBody = true;
  
  this.prepare(numTiles,x,y,speed);
};

Bagels.Table.prototype = Object.create(Phaser.Group.prototype);
Bagels.Table.prototype.constructor = Bagels.Table;

Bagels.Table.prototype.prepare = function(numTiles,x,y,speed){
  
  //make alive
  this.alive = true;
  
  var i = 0;
  while (i < numTiles){
    
    var floorTile = this.tilePool.getFirstExists(false);
    
    if(!floorTile){
      var floorTile = new Phaser.Sprite(this.game,x + i * this.tileSize, y, 'floor');
    } else{
      floorTile.reset(x + i * this.tileSize,y);
    }
    
    this.add(floorTile);
    
    i++;
  }
  
  //set physics properties
  
  this.setAll('body.immovable', true);
  this.setAll('body.allowGravity',false);
  this.setAll('body.velocity.x',speed);
  
  this.addCoins(speed);
  
}

Bagels.Table.prototype.kill = function(){
  this.alive = false;
  this.callAll('kill');
  
  var sprites = [];
  
  this.forEach(function(tile){
    sprites.push(tile)
  },this);
  
  sprites.forEach(function(tile){
    this.tilePool.add(tile);
  },this)
}

Bagels.Table.prototype.addCoins = function(speed){
  var coinsY = 90 + Math.random() * (110);
  
  var hasCoin;
  this.forEach(function(tile){
    hasCoin = Math.random() <= 0.4;
    
    var coin = this.coinPool.getFirstDead();
    if(hasCoin){
      if(!coin){
        coin = new Phaser.Sprite(this.game,tile.x,Math.max(tile.y - coinsY,30),'coin');
        this.coinPool.add(coin);
      }
      else {
        coin.reset(tile.x,Math.max(tile.y - coinsY,30);
      }
      coin.body.velocity.x = speed;
      coin.body.allowGravity = false;
    } 
    
  },this);
}