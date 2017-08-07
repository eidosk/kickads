KA.GameOver = {init:init, preload: preload, create:create, update:update, render:render};
function init(){
    game = this.game;
}
function preload(){
    //game.load.bitmapFont('carrier_command', 'fonts/carrier_command.png', 'fonts/carrier_command.xml');
    //game.load.bitmapFont('carrier_command', 'fonts/carrier_command.png', 'fonts/carrier_command.xml');
    game.load.bitmapFont('myfont', 'fonts/font.png', 'fonts/font.fnt');
}
var text;
var game;
var bpmText;
function create(){
    bmpText = game.add.bitmapText(10, 10, 'myfont','ZOMBIE LAND!', 10);
    game.time.events.add(1000, showAnyKeys, this);
}
function showAnyKeys(){
    bmpText = game.add.bitmapText(10, 30, 'myfont','Press any key to restart', 5);
    game.input.keyboard.onDownCallback = function(){
        game.state.start("Level");
    }
}
function update(){}
function render(){}