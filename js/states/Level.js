var KA = KA || {};
KA.Level = {
    init: function(){
        this.waiting = false;
        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.setUserScale(SCALE, SCALE);
        this.game.renderer.renderSession.roundPixels = true; //enable crisp rendering
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
        this.game.stage.smoothed = false;
    },
    preload: function(){
        //JSON FILES
        this.game.load.tilemap('groundTilemap', 'data/ground.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('platformTilemap', 'data/platform.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('enemiesTilemap', 'data/enemies.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.json('adsInfo', 'data/enemies.json');
        this.game.load.json('objectsInfo', 'data/objects.json');
        this.game.load.json('dialogues', 'data/dialogues.json');
        //TILES
        this.game.load.image('groundTile', 'images/tiles/ground.png');
        this.game.load.image('platformTile', 'images/tiles/platform.png');
        //ENEMIES
        this.game.load.image('billboard_ph', 'images/enemies/billboard_ph.png');
        this.game.load.image('banner_ph', 'images/enemies/banner_ph.png');
        this.game.load.image('square_ph', 'images/enemies/square_ph.png');
        this.game.load.spritesheet('billboard', 'images/enemies/billboard.png', 120, 60, 24);
        this.game.load.spritesheet('banner', 'images/enemies/banner.png', 24, 60, 12);
        this.game.load.spritesheet('square', 'images/enemies/square.png', 36, 36, 12);    
        //CHARACTERS
        this.game.load.spritesheet('dude', 'images/hero_sprites.png', 22, 22, 90);
        //this.game.load.image('girl', 'images/npcs/girl.png');
        //this.game.load.image('old_man', 'images/npcs/old_man.png');
        this.game.load.spritesheet('business_man', 'images/npcs/business_man.png', 22, 30, 20);
        this.game.load.spritesheet('business_woman', 'images/npcs/business_woman.png', 22, 30, 20);
        //this.game.load.image('cool_guy', 'images/npcs/cool_guy.png');
        //this.game.load.spritesheet('npcs', 'images/npcs.png', 22, 30, 32);
        //BG
        this.game.load.image("bg_far", "images/bg_far.png");
        this.game.load.image("background", "images/bg.png");
        //OTHER
        this.game.load.image("bullet", "images/bullet.png");
        this.game.load.image("pixel", "images/pixel.png");
        this.game.load.image("particle_01", "images/particle_01.png");
        this.game.load.image("particle_02", "images/particle_02.png");
        this.game.load.image("particle_03", "images/particle_03.png");
        this.game.load.image("speech_corner", "images/speech_corner.png");
        this.game.load.image("speech_arrow", "images/speech_arrow.png");
        this.game.load.image("speech_body", "images/speech_body.png");
        this.game.load.image("speech_arrow_white", "images/speech_arrow_white.png");
        this.game.load.image("think_line_body", "images/think_line_body.png");
        this.game.load.image("button_x", "images/button_x.png");
        this.game.load.image("sky_cycle_0", "images/sky_cycle_0.png");
        this.game.load.image("sky_cycle_1", "images/sky_cycle_1.png");
        this.game.load.image("sky_cycle_2", "images/sky_cycle_2.png");
        this.game.load.image("sky_cycle_3", "images/sky_cycle_3.png");
        this.game.load.image("sky_cycle_4", "images/sky_cycle_4.png");
        this.game.load.image("sky_cycle_5", "images/sky_cycle_5.png");
        this.game.load.image("sky_cycle_6", "images/sky_cycle_6.png");
        this.game.load.image("sky_cycle_7", "images/sky_cycle_7.png");
        this.game.load.spritesheet("influence_bubbles", "images/influence_bubbles.png",11,13, 4);
        this.game.load.spritesheet("bubbles", "images/bubbles.png", 12, 13, 47);
        //FONT
        this.game.load.bitmapFont('myfont', 'fonts/font.png', 'fonts/font.fnt');
    },
    create: function(){
        var shake = new Phaser.Plugin.Shake(this.game);
        this.game.plugins.add(shake);
        this.game.physics.startSystem(Phaser.Physics.ARCADE); //enable arcade physics
        this.bgSky = this.game.add.sprite(0, 0,'sky_cycle_0');
        this.bgSkyFade = this.game.add.sprite(0, 0,'sky_cycle_0');
        this.bgSkyFade.alpha = 0;
        this.bgFar = this.game.add.sprite(0, 0,'bg_far');
        this.bgFar.alpha = .7;
        this.bg = this.game.add.sprite(0, 0,'background');
        this.groundTilemap = this.game.add.tilemap('groundTilemap');
        this.groundTilemap.addTilesetImage('groundTile', 'groundTile');
        this.groundLayer = this.groundTilemap.createLayer('groundLayer');
        this.groundLayer.resizeWorld(); 
        this.groundTilemap.setCollision(1);
        this.groundLayer.alpha = HIT_AREA_ALPHA;
        this.enemiesTilemap = this.game.add.tilemap("enemiesTilemap");
        KA.EnemyManager.init(this.enemiesTilemap, this.game.cache.getJSON('adsInfo'));
        this.platformTilemap = this.game.add.tilemap("platformTilemap"); 
        this.platformTilemap.addTilesetImage('platformTile', 'platformTile');
        this.platformLayer = this.platformTilemap.createLayer('platformLayer');
        this.platformLayer.resizeWorld();
        this.platformTilemap.setCollision(1);
        this.platformLayer.alpha = HIT_AREA_ALPHA;
        var objectsInfo = this.game.cache.getJSON('objectsInfo');
        this.adLayer = this.enemiesTilemap.createLayer('adLayer');
        this.enemiesTilemap.setCollision([1,2]);
        this.game.physics.arcade.gravity.y = GRAVITY;
        KA.NPCManager.initChars();
        var px = objectsInfo.layers[1].objects[4].x;
        var py = objectsInfo.layers[1].objects[4].y;
        this.player = KA.player = new KA.Player(this.game, 'dude', px, py);
        this.game.time.advancedTiming = true;
        this.gui = new KA.GUI(this.game);
        KA.global.day++;
        this.gui.showDayText(KA.global.day);
        this.initGlobalVars();  
        this.dayPart = 0;
        this.nextDayPart();
        //this.endDay();
        this.findHiddenPlatformTiles();
        this.platformLayer.kill();
        this.platformLayer.destroy();
        this.platformLayer = null;
        this.platformTilemap.replace(1, 0, 3, 27, 2, 1);
        this.platformLayer = this.platformTilemap.createLayer('platformLayer');
        this.platformLayer.alpha = HIT_AREA_ALPHA;
        //this.platformTilemap.currentLayer = this.platformLayer;
        this.platformTilemap.setCollision(1, true, this.platformLayer, true);
        /*
        this.platformLayer = this.platformTilemap.createLayer('platformLayer');
        this.platformLayer.resizeWorld();
        this.platformLayer.alpha = HIT_AREA_ALPHA;
        this.game.physics.enable(this.platformLayer, Phaser.Physics.ARCADE);
        */
        //replace(source, dest, x, y, width, height [, layer])
    },
    update: function(){
        this.bgFar.x= this.game.camera.x*0.03;
        this.handleCollisions();
    },
    render: function() {
        if(DEBUG_MODE){
            //renderEmitters();
            //renderNPCBoundingBoxes();
            this.game.debug.text(this.game.time.fps, 2, 14, "#ffffff");
            this.game.debug.body(this.player);
        }
    },
    //
    checkBeforeNextDayPart: function(){
        if(this.dayPart == 4){
            KA.NPCManager.everybodyGoHomeAfterWork();
        }
        if(this.dayPart == 1 && !KA.NPCManager.isEverybodyWorking()){
            ////trace("Wait...");
            this.waiting = true;
        }else if(this.dayPart == 5 && !KA.NPCManager.isEverybodyHome()){
            ////trace("Wait...");
            this.waiting = true;
        }else if(this.dayPart>= TOT_DAY_PARTS-1){
            this.endDay();
        }else{
            this.nextDayPart();
        }
    },
    endDay: function(){
        KA.NPCManager.halveBrandInfluence();
        KA.NPCManager.setGlobalVars();
        KA.EnemyManager.removeSignals();
        this.game.state.start("EndOfTheDay");
    },
    enemyPlatformOverlapCallback: function(spriteThatCollided, tileThatCollided){
        trace("processEnemyPlatformOverlap: " + tileThatCollided.x);
        return true;
    },
    findHiddenPlatformTiles: function(){
        var enemies = KA.EnemyManager.enemies;
        for(i=0; i< enemies.length; i++){
            for(j=0; j< enemies[i].length; j++){
                var enemy = enemies[i][j];
                if(enemy.parent){
                    temp = enemy;
                    return;
                }
            }
        }
    },
    gameOver: function(){
        this.game.state.start("GameOver");
    },
    getTileX: function(tile){
        return tile.x * TILE_WIDTH - this.game.camera.x;
    },
    handleCollisions: function(){
        this.game.physics.arcade.collide(this.player, this.groundLayer);
        if(!jumpingDown)this.game.physics.arcade.collide(this.player, this.platformLayer, null, this.processPlatformCollide, this.game);
    },
    initGlobalVars: function(){
        KA.global.dialogues = this.game.cache.getJSON('dialogues');
    },
    isWaitingForNpcs: function(){
        return this.waiting;
    },
    nextDayPart: function(){
        //trace("next day part!!!");
        this.dayPart++;
        if(this.dayPart==1){
            KA.NPCManager.init(this.game, this.game.cache.getJSON('objectsInfo')); //show npcs
        }
        if(this.dayPart>0){
            this.bgSkyFade.alpha = 1;
            this.bgSky.loadTexture("sky_cycle_" + this.dayPart);    
            var tween = this.game.add.tween(this.bgSkyFade).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.onSkyFadeComplete, this);
        }
        //this.bgSkyFade = this.game.add.sprite(0, 0,'sky_cycle_1');
        this.game.time.events.add(DAY_PART_DURATION, this.checkBeforeNextDayPart, this);
        this.waiting = false;
    },
    onSkyFadeComplete: function(){
        this.bgSkyFade.loadTexture("sky_cycle_" + this.dayPart);
    },
    processPlatformCollide: function(spriteThatCollided, tileThatCollided){
        var py = spriteThatCollided.y + spriteThatCollided.height;
        var ty = tileThatCollided.y * 12
        if(py<=ty)return true;
        else return false;
    },//makes sure the player will land on the platform only when falling from above
    renderEmitters: function(){
        var enemies = KA.EnemyManager.getEnemies(); //optimize... render only visible... make static
        for(i=0; i<enemies.length; i++){
            for(j=0; j<enemies[i].length; j++){
                var tEnemy = enemies[i][j];
                this.game.debug.geom(tEnemy.emitter.center,'#ff00ff');
            }
        }
    },
    wellDone: function(){
         this.game.state.start("WellDone");
    }
};