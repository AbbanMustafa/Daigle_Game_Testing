var Bagels = Bagels || {};

Bagels.GameState = {
  init: function(){
    
    this.currentLayer = -1;
    this.maxLayer = 2;
    
    this.JUMPING_SPEED = 500;
    this.LEVEL_SPEED = 200;
    
    this.game.physics.arcade.gravity.y = 1000;
    
    this.cursors = this.game.input.keyboard.createCursorKeys();

    
    this.tableKeys = this.game.cache.getKeys(Phaser.Cache.IMAGE).filter(function(key){
      return key.indexOf('table') !== -1;
    });
    
    this.shelfKeys = this.game.cache.getKeys(Phaser.Cache.IMAGE).filter(function(key){
      return key.indexOf('shelf') !== -1;
    });
    
    this.currentItem = null;
    this.myCoins = 0;
    this.game.time.advancedTiming = true;
    this.isJumping = false;
    
    this.currentItemPlaceholder = {
      right: (this.game.width + 10),
      width: 100
    }
    
  },
  create: function(){
    
    this.createSprites();
    
    this.loadLevel();
    
    this.createControls();
    
    console.log('map');
    console.log(this.map);    
    this.input.keyboard.addKey(Phaser.KeyCode.W).onDown.add(function(){
      //this.time.slowMotion += 0.5;
      //console.log('slower');
    },this);
    
     this.input.keyboard.addKey(Phaser.KeyCode.S).onDown.add(function(){
      //this.time.slowMotion -= 0.5;
     // console.log('faster');
    },this);
    
//    this.input.onDown.add(function(){
//      this.player.body.velocity.x = -100;
//    },this);
    
    this.input.keyboard.addKey(Phaser.KeyCode.H).onDown.add(function(){
      console.log("FPS: " + this.game.time.fps);
    },this)
    
    this.currentItem = this.spawnWithKey(this.game.width,this.game.height - 35,'table_small',this.spritePool);
  },
  update: function(){
    
    this.spritePool.forEachAlive(function(item){
      
      this.game.physics.arcade.collide(this.player, item);
      
      if(item.right < 0){
        item.kill();
      }
    },this);
    
    this.coinPool.forEachAlive(function(coin){
      this.game.physics.arcade.overlap(this.player,coin,this.collectCoin);
      
      if(coin.right < 0){
        coin.kill();
      }
    },this);
    
    this.pendulumPool.forEachAlive(function(pendulum){
      pendulum.rotation = this.pendulumTweenData[pendulum.customParams.index].rotation;
      pendulum.customParams.index += pendulum.customParams.step;
      if(pendulum.customParams.index >= this.pendulumTweenData.length){
        pendulum.kill();
      }
    },this);
    
    if(this.currentItem.right < this.game.width){
      this.loadNextItem();
    } 
    
    
//    if((this.cursors.up.isDown) && (this.player.body.blocked.down || this.player.body.touching.down)){
//      this.player.body.velocity.y = -this.JUMPING_SPEED;
//    }
    
    if(this.game.input.activePointer.isDown){
      if(!this.isJumping){
      this.player.body.velocity.y -= this.JUMPING_SPEED;
      this.isJumping = true;
      }
    } else if(this.game.input.activePointer.isUp){
      this.isJumping = false;
    }
    
  },
  render: function(){
    
 //     this.game.debug.body(this.currentItem);
//    this.spritePool.forEachAlive(function(item){
//      this.game.debug.body(item);
//    },this);
    
    this.game.debug.body(this.currentItem);
    
  },
  createSprites: function(){
    
    
    this.pendulumPool = this.add.group();
 
    
    
    this.pendulumTweenData = this.game.make.tween({rotation: -2/3 * Math.PI}).to({rotation: 1/3 * Math.PI},1000 * 5).generateData();
  
    
    
    this.spritePool = this.add.group();
    this.spritePool.enableBody = true;
    this.coinPool = this.add.group();
    this.coinPool.enableBody = true;
    this.game.world.sendToBack(this.coinPool);
    this.game.world.sendToBack(this.spritePool);
    
    this.player = this.add.sprite(50,50,'runner');
    this.player.anchor.setTo(0.5);
    this.player.animations.add('walking',[0,1,2,1],6,true,true);
    this.game.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;
    
    this.imageSizes = {};
    this.tableKeys.forEach(function(key){
      var image = this.cache.getImage(key);
      this.imageSizes[key] = {
        w: image.width,
        h: image.height
      };
    },this);
    
    this.shelfKeys.forEach(function(key){
      var image = this.cache.getImage(key);
      this.imageSizes[key] = {
        w: image.width,
        h: image.height
      };
    },this);
    
  },
  loadLevel: function(){
    
    //this.maps.push(this.add.tilemap(stage));
    this.map = this.add.tilemap('bagelMap');
    
    //join the tile images to the json data
    this.map.addTilesetImage('tiles_spritesheet','gameTiles');
    
    //create layer
    this.backgroundLayer = this.map.createLayer('backgroundLayer');
    //send background to back
    this.game.world.sendToBack(this.backgroundLayer);
  },
  loadNextItem: function(){
    this.obstacleChance = this.game.rnd.realInRange(0,0.85);
//    this.obstacleChance = 0.4;
    if(this.obstacleChance < 0.25){
      this.spawnTable();
    } else if(this.obstacleChance < 0.5){
      this.spawnShelf();
    } else if(this.obstacleChance < 0.75){
      this.spawnPendulum();
    } else if(this.obstacleChance < 0.85){
      this.spawnPendulum();
    } else if(this.obstacleChance < 0.90){
      this.spawnCapacitor();
    } else if(this.obstacleChance < 0.95){
      this.spawnStrings();
    } else{
      this.spawnVanDeGraff();
    }
  },
  spawnWithKey: function(x,y,key,pool){
    var sprite = pool.getFirstExists(false);
    if(!sprite){
      sprite = pool.create(x,y,key);
      sprite.body.immovable = true;
      sprite.body.allowGravity = false;
      sprite.body.friction.x = 0;
    } else {
      sprite.reset(x,y);
      sprite.loadTexture(key);
      sprite.body.setSize(this.imageSizes[key].w,this.imageSizes[key].h);
    }
    
    sprite.body.velocity.x = -this.LEVEL_SPEED;
    
    return sprite;
  },
  spawnTable: function(){
    var x = this.game.rnd.between(this.game.width + this.currentItem.width,this.game.width + this.currentItem.width + 200);
    this.currentItem = this.spawnWithKey(x,this.game.height - this.map.tileHeight,this.game.rnd.pick(this.tableKeys),this.spritePool);
  },
  spawnShelf: function(){
    var x = this.game.rnd.between(this.game.width + this.currentItem.width,this.game.width + this.currentItem.width + 200);
    this.currentItem = this.spawnWithKey(x,this.map.tileHeight * 3,this.game.rnd.pick(this.shelfKeys),this.spritePool);
  },
  spawnCoins: function(){
    var sprite = null, obj = null, lastMarker = null;
    var rndCoin = this.game.rnd.between(1,3);
    this.map.objects['coins' + rndCoin].forEach(function(obj){ 
      sprite = this.coinPool.getFirstExists(false);
      if(!sprite){
        sprite = this.coinPool.create(obj.x,obj.y - this.map.tileHeight,'coin');
        sprite.body.immovable = true;
        sprite.body.allowGravity = false;
        sprite.body.velocity.x = -this.LEVEL_SPEED;
      } else {
        sprite.reset(obj.x,obj.y - this.map.tileHeight);
      }
      
      if(!lastMarker || obj.x > lastMarker.x){
        lastMarker = sprite;
      }
      
    },this);
    this.coinPool.setAll('body.velocity.x',-this.LEVEL_SPEED);
    this.currentItem = lastMarker;
  },
  
  /*
  Think of algorithm for creating valid pendulum lengths
  */
  spawnPendulum: function(){
    var rand = this.game.rnd.between(1,3), lastMarker = null;
    
    
    this.map.objects['pendulum' + rand].forEach(function(obj){
      console.log('obj from tilemap');
      console.log((obj.properties.delay) ? parseInt(obj.properties.delay) : "potato 100");
      var shadow = this.createShadow(obj.y - this.map.tileHeight, (obj.properties.delay) ? parseInt(obj.properties.delay) : 100);
      if(!lastMarker || lastMarker.customParams.delay < obj.properties.delay){
        lastMarker = shadow;
      }
    },this);
    
    lastMarker.customParams.isNeo = true;
    this.currentItemPlaceholder.right = this.game.width + 10;
    this.currentItem = this.currentItemPlaceholder;
    
  },
  spawnCapacitor: function(){
    
  },
  spawnVanDeGraff: function(){
    
  },
  collectCoin: function(player,coin){
    coin.kill();
    this.myCoins++;
  },
  createControls: function(){
   // this.game.input.
  },
  createPendulum: function(length){
    var pendulum = this.pendulumPool.getFirstDead(false);
    if(!pendulum){
      pendulum = new Phaser.TileSprite(this.game,50,-this.map.tileHeight,this.map.tileHeight,length,'pendulum_string');
      pendulum.anchor.setTo(0.5,0);
      //pendulum.revive();
      var mass = new Phaser.Sprite(this.game,0,length,'pendulum_mass');
      mass.anchor.setTo(0.5,0);
      this.game.physics.arcade.enable(mass);
      mass.body.allowGravity = false;
      mass.body.immovable = true;
      pendulum.addChild(mass);
    } else {
      pendulum.height = length;
      pendulum.revive();
    }
    pendulum.rotation = -2/3 * Math.PI;
    pendulum.getChildAt(0).position.setTo(0,length);
    pendulum.customParams = {};
    pendulum.customParams.index = 0;
    pendulum.customParams.step = ~~(5000 / (1/2 * Math.PI * length + 1800)); 

    
    this.pendulumPool.add(pendulum);
    return pendulum;
  },
  createShadow(length,delay){
    var shadow = this.shadowPool.getFirstDead(false);
    var x = 50 + length * Math.cos(Math.PI/2 + Math.PI * -2/3) + this.map.tileHeight/2;
    if(!shadow){
      shadow = new Phaser.Sprite(this.game,x,this.game.height - this.map.tileHeight/3 * 2,'pendulum_shadow');
    } else {
//     shadow.position.setTo(x,this.game.height - this.map.tileHeight/3 * 2);
       shadow.reset(x,this.game.height - this.map.tileHeight/3 * 2);
    }
    shadow.anchor.setTo(0.5);
    shadow.scale.setTo(0);
    
    shadow.customParams = {};
    shadow.customParams.growing = true;
    shadow.customParams.index = 0;
    shadow.customParams.length = length;
    shadow.customParams.delay = delay;
    shadow.customParams.inception = null;
    
    
    this.shadowPool.add(shadow);
    
    return shadow;
  }
}