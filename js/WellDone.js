KA.WellDone = {init:init, preload: preload, create:create, update:update, render:render};
function init(){
    game = this.game;
}
function preload(){
    //game.load.bitmapFont('carrier_command', 'fonts/carrier_command.png', 'fonts/carrier_command.xml');
    game.load.bitmapFont('myfont', 'fonts/font.png', 'fonts/font.fnt');
}
var text;
var game;
var bpmText;
function create(){
    bmpText = game.add.bitmapText(10, 10, 'myfont','Well Done!', 16);
    game.time.events.add(1000, pressAnyKey, this);
}
function update(){}
function render(){}