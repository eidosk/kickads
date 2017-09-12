var KA = KA || {};
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
    game.load.tilemap('mapGround', 'images/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('mapPlatform', 'images/level1platform.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('mapAds', 'images/level1ads.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.json('adsInfo', 'images/level1ads.json');
    //TILES
    game.load.image('groundTile', 'images/groundTile.png');
    game.load.image('platformTile', 'images/platformTile.png');
    //ADS
    game.load.image('billboard_temp', 'images/enemies/billboard_temp.png');
    game.load.image('banner_temp', 'images/enemies/banner_temp.png');
    game.load.image('square_temp', 'images/enemies/square_temp.png');
    //CHARACTERS
    game.load.spritesheet('dude', 'images/hero_sprites.png', 22, 22, 90);
    game.load.image('girl', 'images/npcs/girl.png');
    game.load.image('old_man', 'images/npcs/old_man.png');
    game.load.image('business_man', 'images/npcs/business_man.png');
    game.load.image('business_woman', 'images/npcs/business_woman.png');
    game.load.image('cool_guy', 'images/npcs/cool_guy.png');
    game.load.spritesheet('npcs', 'images/npcs.png', 22, 30, 32);
    //BG
    game.load.image("bg_far", "images/bg_far.png");
    game.load.image("background", "images/bg.png");
    //OTHER
    game.load.image("bullet", "images/bullet.png");
    game.load.image("pixel", "images/pixel.png");
    game.load.image("speech_corner", "images/speech_corner.png");
    game.load.image("speech_arrow", "images/speech_arrow.png");
    game.load.image("speech_body", "images/speech_body.png");
    game.load.image("button_x", "images/button_x.png");
    game.load.image("sky_cycle_0", "images/sky_cycle_0.png");
    game.load.image("sky_cycle_0b", "images/sky_cycle_0b.png");
    game.load.image("sky_cycle_1", "images/sky_cycle_1.png");
    game.load.image("sky_cycle_1b", "images/sky_cycle_1b.png");
    game.load.image("sky_cycle_2", "images/sky_cycle_2.png");
    game.load.image("sky_cycle_2b", "images/sky_cycle_2b.png");
    game.load.image("sky_cycle_3", "images/sky_cycle_3.png");
    game.load.image("sky_cycle_3b", "images/sky_cycle_3b.png");
    game.load.spritesheet("influence_bubbles", "images/influence_bubbles.png",11,13, 4);
    game.load.spritesheet("bubbles", "images/bubbles.png", 12, 13, 47);
    //FONT
    game.load.bitmapFont('myfont', 'fonts/font.png', 'fonts/font.fnt');
}
var mapGround;
var mapPlatform;
var mapAds;
var groundLayer;
var platformLayer;
var adLayer;
var enemyManager;
/*
var testLayer;
var scaffoldLayer;
*/
var player;
var facing = 'left';
var bg;
var bgFar;
var bgSky;
var deltaY = 5;
var prevY = 0;
var totAdTiles;
var game;

function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE); //enable arcade physics
    bgSky = game.add.sprite(0, 0,'sky_cycle_1');
    bgFar = game.add.sprite(0, 0,'bg_far');
    bgFar.alpha = .7;
    bg = game.add.sprite(0, 0,'background');
    //bg = game.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'background');
    mapGround = game.add.tilemap('mapGround');
    mapGround.addTilesetImage('groundTile', 'groundTile');
    groundLayer = mapGround.createLayer('groundLayer');
    groundLayer.resizeWorld(); 
    //game.physics.arcade.enable(groundLayer);  
    mapGround.setCollision(1);
    groundLayer.alpha = HIT_AREA_ALPHA;
    mapPlatform = game.add.tilemap("mapPlatform");
    mapPlatform.addTilesetImage('platformTile', 'platformTile');
    /*
    mapPlatform.addTilesetImage('building_01', 'building_01');
    mapPlatform.addTilesetImage('billboard_scaffold', 'billboard_scaffold');
    platformLayer = mapPlatform.createLayer('platformLayer');
    testLayer = mapPlatform.createLayer('buildingsLayer');
    scaffoldLayer = mapPlatform.createLayer('scaffoldLayer');
    */
    platformLayer = mapPlatform.createLayer('platformLayer');
    platformLayer.resizeWorld();
    mapPlatform.setCollision(1);
    platformLayer.alpha = HIT_AREA_ALPHA;
    mapAds = game.add.tilemap("mapAds");
    enemyManager = new KA.EnemyManager(mapAds,game.cache.getJSON('adsInfo'));
    //enemyManager.test();
    adLayer = mapAds.createLayer('adLayer');
    mapAds.setCollision([1,2]);
    totAdTiles = enemyManager.countTiles();
    game.physics.arcade.gravity.y = GRAVITY;
    KA.NPCManager.addNPCs(game);
    player = new KA.Player(this.game, 'dude');
    KA.player = player;
    game.physics.enable(platformLayer, Phaser.Physics.ARCADE);
    game.time.advancedTiming = true;
    dayPart = -1;
    nextDayPart();
    
}

function nextDayPart(){
    dayPart++;
    if(dayPart>= TOT_DAY_PARTS){
        endDay();
        return;
    }else if (dayPart == 2){
        KA.NPCManager.goHomeAfterWork();
    }
    trace("day part updated to: " + dayPart);
    bgSky.loadTexture("sky_cycle_" + dayPart);
    this.game.time.events.add(DAY_PART_DURATION *.5, nextSkyCycle, this);
}

function nextSkyCycle(){
    bgSky.loadTexture("sky_cycle_" + dayPart + "b");
    trace("dayPart: " + dayPart + "b");
    if(dayPart< TOT_DAY_PARTS && dayPart!=0){
        this.game.time.events.add(DAY_PART_DURATION *.5, nextDayPart, this);
    }
}

function endDay(){
    trace("END OF DAY")
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
//KA.Level.prototype.processPlatformCollide = function(spriteThatCollided, tileThatCollided){
function processPlatformCollide(spriteThatCollided, tileThatCollided){
    var py = spriteThatCollided.y + spriteThatCollided.height;
    var ty = tileThatCollided.y * 12
    if(py<=ty)return true;
    else return false;
}
//KA.Level.prototype.processAdCollide = function(playerSprite, adTile){
function processAdCollide(playerSprite, adTile){
    if(adTile.index!=-1){
        if(player.isKicking()){
            Signals.removeTile.dispatch(adTile);
            trace("DISPATCH!")
            mapAds.removeTile(adTile.x, adTile.y);
            totAdTiles--;
            if(totAdTiles<1){
                wellDone();
            }
        }
    }
    return false;
}
//KA.Level.prototype.wellDone = function(){
function wellDone(){
     game.state.start("WellDone");
}


//KA.Level.prototype.handleCollisions = function(game){
function handleCollisions(game){
    game.physics.arcade.collide(player, groundLayer);
    if(!jumpingDown)game.physics.arcade.collide(player, platformLayer, null, processPlatformCollide, game);
    game.physics.arcade.collide(player, adLayer, null, processAdCollide, game);
}
//KA.Level.prototype.getTileX = function(tile){
function getTileX(tile){
    return tile.x * TILE_WIDTH - game.camera.x;
}
//KA.Level.prototype.renderEmitters = function(){
function renderEmitters(){
    var enemies = enemyManager.getEnemies(); //optimize... render only visible... make static
    for(i=0; i<enemies.length; i++){
        var tEnemy = enemies[i];
        game.debug.geom(tEnemy.emitter.center,'#ff00ff');
    }
}

/*
function renderNPCBoundingBoxes(){
    for(i=0; i<KA.NPCManager.characters.length; i++){
        trace(KA.NPCManager.characters[i]);
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