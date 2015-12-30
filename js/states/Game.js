var Bagels = Bagels || {};

Bagels.GameState = {
  init: function(){
    
    this.currentLayer = -1;
    this.maxLayer = 2;
    
    this.JUMPING_SPEED = 400;
    this.LEVEL_SPEED = 200;
    
    this.game.physics.arcade.gravity.y = 1000;
    
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.layers = [];
    this.gidMappings = {
      74: 'purple_center',
      51: 'purple_right',
      75: 'purple_left',
      25: 'marker',
      121: 'endOfLayer'
    };
    this.endOfLayerMarker = null;
    
    this.tableKeys = this.game.cache.getKeys(Phaser.Cache.IMAGE).filter(function(key){
      return key.indexOf('table') !== -1;
    });
    
    this.shelfKeys = this.game.cache.getKeys(Phaser.Cache.IMAGE).filter(function(key){
      return key.indexOf('shelf') !== -1;
    });
    
    this.currentItem = null;
    
    this.game.time.advancedTiming = true;
    
  },
  create: function(){
    
    this.player = this.add.sprite(50,50,'runner');
    this.player.anchor.setTo(0.5);
    this.player.animations.add('walking',[0,1,2,1],6,true,true);
    this.game.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;
    this.player.customParams = {};
    
    
    this.spritePool = this.add.group();
    //this.spritePool.enableBody = true;
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
    
    console.log(this.imageSizes);
    
    
    this.loadLevel();
    
    this.createOnscreenControls();
    
    this.input.keyboard.addKey(Phaser.KeyCode.W).onDown.add(function(){
      this.time.slowMotion += 0.5;
      console.log('slower');
    },this);
    
     this.input.keyboard.addKey(Phaser.KeyCode.S).onDown.add(function(){
      this.time.slowMotion -= 0.5;
      console.log('faster');
    },this);
    
    this.input.keyboard.addKey(Phaser.KeyCode.H).onDown.add(function(){
      console.log("FPS: " + this.game.time.fps);
    },this)
    
    this.currentItem = this.spawnWithKey(this.game.width,this.game.height - 35,'table_small')
  },
  update: function(){
    
    this.spritePool.forEachAlive(function(item){
      
      this.game.physics.arcade.collide(this.player, item);
      
      if(item.right < 0){
        item.kill();
      }
    },this);
    
//    for(var i = 0; i < this.spritePool.length; i++){
//      if(this.spritePool.children[i].alive){
//        this.game.physics.arcade.collide(this.player, this.spritePool.children[i]);
//      
//        if(this.spritePool.children[i].right < 0){
//          this.spritePool.children[i].kill();
//        }
//      }
//    }
    
    if(this.currentItem.right < this.game.width){

      this.loadNextItem();
    } 
    
    
    if((this.cursors.up.isDown || this.player.customParams.mustJump) && (this.player.body.blocked.down || this.player.body.touching.down)){
      this.player.body.velocity.y = -this.JUMPING_SPEED;
      this.player.customParams.mustJump = false;
    }
    
  },
//  render: function(){
////   this.leftPool.forEach(function(floor){
////      this.game.debug.body(floor);
////    },this);
////    
////    this.centerPool.forEach(function(floor){
////      this.game.debug.body(floor);
////    },this);
////    
////    this.rightPool.forEach(function(floor){
////      this.game.debug.body(floor);
////    },this);
//    
//    this.spritePool.forEachAlive(function(item){
//      this.game.debug.body(item);
//    },this);
//    
//  },
  loadLevel: function(){
    
    //this.maps.push(this.add.tilemap(stage));
    this.map = this.add.tilemap('bagelMap');
    
    //join the tile images to the json data
    this.map.addTilesetImage('tiles_spritesheet','gameTiles');
    
    //create layer
    this.backgroundLayer = this.map.createLayer('backgroundLayer');
    //send background to back
    this.game.world.sendToBack(this.backgroundLayer);
    //this.backgroundLayer.resizeWorld();
    //this.currentCollisionLayer.visible = false;
    
    //this.loadNextStage();

//    var centerSprites = this.map.createFromTiles(74,null,'purple_center','stage1',this.floorPool);
//    
//    var rightSprites = this.map.createFromTiles(51,null,'purple_right','stage1',this.floorPool);
//    
//    var leftSprites = this.map.createFromTiles(75,null,'purple_left','stage1',this.floorPool);
    
//    this.floorPool.setAll('body.immovable', true);
//    this.floorPool.setAll('body.allowGravity',false);
//    this.floorPool.setAll('body.velocity.x',-this.LEVEL_SPEED);
//    
    //this.floorPool.children[0].body
//    console.log('Center Sprites : ' + centerSprites );
//    console.log('Left Sprites : ' + leftSprites );
//    console.log('Right Sprites : ' + rightSprites );
//    
  },
  createOnscreenControls: function(){
    this.leftArrow = this.add.button(20,this.game.height-60,'arrowButton');
    this.rightArrow = this.add.button(110,this.game.height-60,'arrowButton');
    this.actionButton = this.add.button(this.game.width - 100,this.game.height  -60,'actionButton');
    
    this.leftArrow.alpha = 0.5;
    this.rightArrow.alpha = 0.5;
    this.actionButton.alpha = 0.5;
    
    this.leftArrow.fixedToCamera = true;
    this.rightArrow.fixedToCamera = true;
    this.actionButton.fixedToCamera = true;
    
    //jump
    this.actionButton.events.onInputDown.add(function(){
      this.player.customParams.mustJump = true;
    },this);
    this.actionButton.events.onInputUp.add(function(){
      this.player.customParams.mustJump = false;
    },this);
    
    //left
    this.leftArrow.events.onInputDown.add(function(){
      this.player.customParams.isMovingLeft = true;
    },this);
    this.leftArrow.events.onInputUp.add(function(){
      this.player.customParams.isMovingLeft = false;
    },this);
//    this.leftArrow.events.onInputOver.add(function(){
//      this.player.customParams.isMovingLeft = true;
//    },this);
//    this.leftArrow.events.onInputOut.add(function(){
//      this.player.customParams.isMovingLeft = false;
//    },this);
    
    //right
    this.rightArrow.events.onInputDown.add(function(){
      this.player.customParams.isMovingRight = true;
    },this);
    this.rightArrow.events.onInputUp.add(function(){
      this.player.customParams.isMovingRight = false;
    },this);
//    this.rightArrow.events.onInputOver.add(function(){
//      this.player.customParams.isMovingRight = true;
//    },this);
//    this.rightArrow.events.onInputOut.add(function(){
//      this.player.customParams.isMovingRight = false;
//    },this);
  },
  loadNextStage: function(){
    this.currentLayer++;
    if(this.currentLayer > this.maxLayer){
      this.currentLayer = 0;
    }
    if(this.layers[this.currentLayer] == null){
      this.layers[this.currentLayer] = this.map.createLayer('stage' + this.currentLayer);
    }
    this.currentCollisionLayer = this.layers[this.currentLayer];
    this.currentCollisionLayer.visible = false;
    
    this.createObstaclesFromCurrentLayer();
    
  },
  createObstaclesFromCurrentLayer: function(){
    var rightMost = 0;
    var tile = null;
    for(var i = 0; i < this.map.height; i++){
      for(var j = 0; j < this.map.width; j++){
        tile = this.currentCollisionLayer.layer.data[i][j];
        if(this.gidMappings[tile.index] != null){
          var floorTile = this.spritePools[tile.properties.key].getFirstExists(false);
          if(!floorTile){
            floorTile = new Phaser.Sprite(this.game,this.game.width + tile.x * this.map.tileWidth,tile.y * this.map.tileHeight - this.map.tileHeight,tile.properties.key);
          
          }
          else {
            floorTile.reset(this.game.width + tile.x * this.map.tileHeight,tile.y * this.map.tileHeight - this.map.tileHeight);
          }
          if(j > rightMost){
            this.endOfLayerMarker = floorTile;
            rightMost = j;
          }
          this.spritePools[tile.properties.key].add(floorTile);
        }
      }
    }
//    this.currentCollisionLayer.layer.data.forEach(function(row){
//      row.forEach(function(tile){
//        
//      },this);
//    },this);
    
    for(var pool in this.spritePools){
      this.spritePools[pool].setAll('body.immovable',true);
      this.spritePools[pool].setAll('body.allowGravity',false);
      this.spritePools[pool].setAll('body.velocity.x',-this.LEVEL_SPEED);
      this.spritePools[pool].setAll('body.friction.x',0);
    }
  },
  loadNextItem: function(){
    this.obstacleChance = this.game.rnd.realInRange(0,0.49);
    if(this.obstacleChance < 0.25){
      this.spawnTable();
    } else if(this.obstacleChance < 0.5){
      this.spawnShelf();
    } else if(this.obstacleChance < 0.75){
      this.spawnCoins();
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
  spawnWithKey: function(x,y,key){
    var sprite = this.spritePool.getFirstExists(false);
    if(!sprite){
      sprite = new Phaser.Sprite(this.game,x,y,key);
      this.game.physics.arcade.enable(sprite);
      sprite.body.immovable = true;
      sprite.body.allowGravity = false;
      sprite.body.friction.x = 0;
    } else {
      sprite.reset(x,y);
      sprite.loadTexture(key);
      sprite.body.setSize(this.imageSizes[key].w,this.imageSizes[key].h);
    }
    
    sprite.body.velocity.x = -this.LEVEL_SPEED;
    
    this.spritePool.add(sprite);
    
    return sprite;
  },
  spawnTable: function(){
    var x = this.game.rnd.between(this.game.width + this.currentItem.width,this.game.width + this.currentItem.width + 200);
    this.currentItem = this.spawnWithKey(x,this.game.height - 35,this.game.rnd.pick(this.tableKeys));
  },
  spawnShelf: function(){
    var x = this.game.rnd.between(this.game.width + this.currentItem.width,this.game.width + this.currentItem.width + 200);
    this.currentItem = this.spawnWithKey(x,75,this.game.rnd.pick(this.shelfKeys));
  },
  spawnCoins: function(){
    
  },
  spawnPendulum: function(){
    
  },
  spawnCapacitor: function(){
    
  },
  spawnVanDeGraff: function(){
    
  }
}