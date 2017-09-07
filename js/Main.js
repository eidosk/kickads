var KA = KA || {};
window.onload = function(){
    KA.game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.CANVAS, 'game');
    /*KA.game.global = {
        score : 0,
        sound : false
    }*/
    KA.game.state.add("Level", KA.Level);
    KA.game.state.add("WellDone", KA.WellDone);
    KA.game.state.add("GameOver", KA.GameOver);
    KA.game.state.start(START_STATE);
}

KA.getTintFromBrandId = function(brandId){
    var tint = "";
    switch(brandId){
           case 0:
                tint = TINT_SODA;
           break;
           case 1:
                tint = TINT_FOOD;
           break;
           case 2:
                tint= TINT_TECH;
           break;
    }
    return tint;
}
function trace(message){
    console.log(message);
}

function round(value){
    return Phaser.Math.roundAwayFromZero(value);
}

function pressAnyKey(){
    bmpText = game.add.bitmapText(10, 26, 'myfont','Press any key', 16);
    game.input.keyboard.onDownCallback = function(){
        game.state.start("Level");
    }
}
