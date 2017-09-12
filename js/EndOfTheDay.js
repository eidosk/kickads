KA.EndOfTheDay = {init:init, preload: preload, create:create, update:update, render:render};
function init(){
    game = this.game;
}
function preload(){
    game.load.bitmapFont('myfont', 'fonts/font.png', 'fonts/font.fnt');
}
var text;
var game;
var bpmText;
function create(){
    bmpText = game.add.bitmapText(10, 10, 'myfont','At the end of the day its the end of the day!', 16);
    game.time.events.add(1000, pressAnyKey, this);
}

function update(){}
function render(){}