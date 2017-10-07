KA.EndOfTheDay = {init:init, preload: preload, create:create, update:update, render:render};
function init(){
    game = this.game;
}
function preload(){
    game.load.bitmapFont('myfont', 'fonts/font.png', 'fonts/font.fnt');
    game.load.spritesheet("newspaper_anim", "images/newspaper_anim.png", 240, 135, 9);
    game.load.image("newspaper", "images/newspaper.png");
}
var text;
var game;
var bpmText;
var anim;
var newspaper_anim;

function create(){
    
    
    newspaper_anim = game.add.sprite(0,0, "newspaper_anim");
    anim = newspaper_anim.animations.add("main", [0,1,2,3,4,5,6,7,8], 12, false);
    
    anim.onComplete.add(animationComplete, this);
    newspaper_anim.play("main");
    
    
    
    
    //game.time.events.add(1000, pressAnyKey, this);
}

function animationComplete(sprite, animation) {
    trace("complete");
    
    
    var txt = "";
    if(KA.game.global.profit>0){
        txt = "Soda sales are rising!";
    }else{
        txt = "Not many sodas sold today!";
    }
    
    newspaper_anim.destroy();
    game.add.sprite(0,0, "newspaper");
    bmpText = game.add.bitmapText(24, 40, 'myfont',txt, 16);
    bmpText.tint = 0x223344;
    onKeyDown();
}

function update(){}
function render(){}