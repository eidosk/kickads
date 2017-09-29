var KA = KA || {};
var groundTilemap, platformTilemap, enemiesTilemap;
var groundLayer, platformLayer, adLayer;
var enemyManager;
var player;
var facing = 'left';
var waiting = false;
var bg;
var bgFar;
var bgSky;
var deltaY = 5;
var prevY = 0;
var totAdTiles;
var game;
var dayPart;

KA.Level = {init:init, preload: preload, create:create, update:update, render:render};

function init(){
    game = this.game;
    game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    game.scale.setUserScale(SCALE, SCALE);
    game.renderer.renderSession.roundPixels = true; //enable crisp rendering
    Phaser.Canvas.setImageRenderingCrisp(game.canvas);
    game.stage.smoothed = false;
    //game.kickSignal = new Phaser.Signal();
}

function preload(){
    //JSON FILES
    game.load.tilemap('groundTilemap', 'data/ground.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('platformTilemap', 'data/platform.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('enemiesTilemap', 'data/enemies.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.json('adsInfo', 'data/enemies.json');
    game.load.json('objectsInfo', 'data/objects.json');
    //TILES
    game.load.image('groundTile', 'images/tiles/ground.png');
    game.load.image('platformTile', 'images/tiles/platform.png');
    //ENEMIES
    game.load.image('billboard_ph', 'images/enemies/billboard_ph.png');
    game.load.image('banner_ph', 'images/enemies/banner_ph.png');
    game.load.image('square_ph', 'images/enemies/square_ph.png');
    
    game.load.spritesheet('billboard', 'images/enemies/billboard.png', 120, 60, 24);
    game.load.spritesheet('banner', 'images/enemies/banner.png', 24, 60, 12);
    game.load.spritesheet('square', 'images/enemies/square.png', 36, 36, 12);    
    
    //CHARACTERS
    game.load.spritesheet('dude', 'images/hero_sprites.png', 22, 22, 90);
    //game.load.image('girl', 'images/npcs/girl.png');
    //game.load.image('old_man', 'images/npcs/old_man.png');
    game.load.spritesheet('business_man', 'images/npcs/business_man.png', 22, 30, 20);
    game.load.spritesheet('business_woman', 'images/npcs/business_woman.png', 22, 30, 20);
    //game.load.image('cool_guy', 'images/npcs/cool_guy.png');
    //game.load.spritesheet('npcs', 'images/npcs.png', 22, 30, 32);
    //BG
    game.load.image("bg_far", "images/bg_far.png");
    game.load.image("background", "images/bg.png");
    //OTHER
    game.load.image("bullet", "images/bullet.png");
    game.load.image("pixel", "images/pixel.png");
    game.load.image("particle_01", "images/particle_01.png");
    game.load.image("particle_02", "images/particle_02.png");
    game.load.image("particle_03", "images/particle_03.png");
    game.load.image("speech_corner", "images/speech_corner.png");
    game.load.image("speech_arrow", "images/speech_arrow.png");
    game.load.image("speech_body", "images/speech_body.png");
    game.load.image("button_x", "images/button_x.png");
    game.load.image("sky_cycle_0", "images/sky_cycle_0.png");
    game.load.image("sky_cycle_1", "images/sky_cycle_1.png");
    game.load.image("sky_cycle_2", "images/sky_cycle_2.png");
    game.load.image("sky_cycle_3", "images/sky_cycle_3.png");
    game.load.image("sky_cycle_4", "images/sky_cycle_4.png");
    game.load.image("sky_cycle_5", "images/sky_cycle_5.png");
    game.load.image("sky_cycle_6", "images/sky_cycle_6.png");
    game.load.image("sky_cycle_7", "images/sky_cycle_7.png");
    game.load.spritesheet("influence_bubbles", "images/influence_bubbles.png",11,13, 4);
    game.load.spritesheet("bubbles", "images/bubbles.png", 12, 13, 47);
    
    //FONT
    game.load.bitmapFont('myfont', 'fonts/font.png', 'fonts/font.fnt');
}

function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE); //enable arcade physics
    bgSky = game.add.sprite(0, 0,'sky_cycle_1');
    bgFar = game.add.sprite(0, 0,'bg_far');
    bgFar.alpha = .7;
    bg = game.add.sprite(0, 0,'background');
    //bg = game.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'background');
    groundTilemap = game.add.tilemap('groundTilemap');
    groundTilemap.addTilesetImage('groundTile', 'groundTile');
    groundLayer = groundTilemap.createLayer('groundLayer');
    groundLayer.resizeWorld(); 
    //game.physics.arcade.enable(groundLayer);  
    groundTilemap.setCollision(1);
    groundLayer.alpha = HIT_AREA_ALPHA;
    platformTilemap = game.add.tilemap("platformTilemap");
    platformTilemap.addTilesetImage('platformTile', 'platformTile');
    platformLayer = platformTilemap.createLayer('platformLayer');
    platformLayer.resizeWorld();
    platformTilemap.setCollision(1);
    platformLayer.alpha = HIT_AREA_ALPHA;
    enemiesTilemap = game.add.tilemap("enemiesTilemap");
    enemyManager = new KA.EnemyManager(enemiesTilemap, game.cache.getJSON('adsInfo'));
    
    var objectsInfo = game.cache.getJSON('objectsInfo');
    
    //enemyManager.test();
    adLayer = enemiesTilemap.createLayer('adLayer');
    enemiesTilemap.setCollision([1,2]);
    totAdTiles = enemyManager.countTiles();
    game.physics.arcade.gravity.y = GRAVITY;
    KA.NPCManager.addNPCs(game, objectsInfo);
    
    var px = objectsInfo.layers[1].objects[4].x;
    var py = objectsInfo.layers[1].objects[4].y;
    
    player = new KA.Player(this.game, 'dude', px, py);
    KA.player = player;
    game.physics.enable(platformLayer, Phaser.Physics.ARCADE);
    game.time.advancedTiming = true;
    dayPart = -1;
    nextDayPart();
    
    
    //endDay();
}

function nextDayPart(){
    dayPart++;
    trace("day part updated to: " + dayPart);
    bgSky.loadTexture("sky_cycle_" + dayPart);
    this.game.time.events.add(DAY_PART_DURATION *.5, checkBeforeNextDayPart, this);
    waiting = false;
}

function checkBeforeNextDayPart(){
    if(dayPart == 4){
        KA.NPCManager.everybodyGoHomeAfterWork();
    }
    if(dayPart == 1 && !KA.NPCManager.isEverybodyWorking()){
        trace("Wait...");
        waiting = true;
    }else if(dayPart == 5 && !KA.NPCManager.isEverybodyHome()){
        trace("Wait...");
        waiting = true;
    }else if(dayPart>= TOT_DAY_PARTS-1){
        endDay();
    }else{
        nextDayPart();
    }
}

function isWaitingForNpcs(){
    return waiting;
}

function endDay(){
    ////trace("END OF DAY")
    game.state.start("EndOfTheDay");
}

function gameOver(){
    game.state.start("GameOver");
}

function update(){
    //bgFar.x+=.01;
    bgFar.x= game.camera.x*0.03;
    handleCollisions(this);
}
//makes sure the player will land on the platform only when falling from above
function processPlatformCollide(spriteThatCollided, tileThatCollided){
    var py = spriteThatCollided.y + spriteThatCollided.height;
    var ty = tileThatCollided.y * 12
    if(py<=ty)return true;
    else return false;
}
//KA.Level.prototype.wellDone = function(){
function wellDone(){
     game.state.start("WellDone");
}
//KA.Level.prototype.handleCollisions = function(game){
function handleCollisions(game){
    game.physics.arcade.collide(player, groundLayer);
    if(!jumpingDown)game.physics.arcade.collide(player, platformLayer, null, processPlatformCollide, game);
    //game.physics.arcade.collide(player, adLayer, null, processAdCollide, game);
}
//KA.Level.prototype.getTileX = function(tile){
function getTileX(tile){
    return tile.x * TILE_WIDTH - game.camera.x;
}
//KA.Level.prototype.renderEmitters = function(){
function renderEmitters(){
    var enemies = enemyManager.getEnemies(); //optimize... render only visible... make static
    for(i=0; i<enemies.length; i++){
        for(j=0; j<enemies[i].length; j++){
            var tEnemy = enemies[i][j];
            game.debug.geom(tEnemy.emitter.center,'#ff00ff');
        }
    }
}
/*
function renderNPCBoundingBoxes(){
    for(i=0; i<KA.NPCManager.characters.length; i++){
        ////trace(KA.NPCManager.characters[i]);
        game.debug.body(KA.NPCManager.characters[i]);
    }
}
*/
function render() {
    if(DEBUG_MODE){
        renderEmitters();
        //renderNPCBoundingBoxes();
        game.debug.text(game.time.fps, 2, 14, "#ffffff");
        game.debug.body(player);
    }
}