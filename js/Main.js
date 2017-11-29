var KA = KA || {};
window.onload = function(){
    KA.game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.CANVAS, 'game');
    KA.game.state.add("Level", KA.Level);
    KA.game.state.add("WellDone", KA.WellDone);
    KA.game.state.add("GameOver", KA.GameOver);
    KA.game.state.add("EndOfTheDay", KA.EndOfTheDay);
    KA.game.state.start(START_STATE);
}
function round(value){
    return Phaser.Math.roundAwayFromZero(value);
}
function pressAnyKey(){
    bmpText = KA.game.add.bitmapText(10, 26, 'myfont','Press any key', 16);
    onKeyDown();
}
function updateBalance(){
    KA.global.balance += KA.global.profit * 50;
    if(KA.global.balance>=KA.global.totValue)KA.global.balance = KA.global.totValue;
}
function onKeyDown(){
    KA.game.input.keyboard.onDownCallback = function(){
        KA.game.state.start("Level");
    }
}
function romanize(num) {
    if (!+num)
        return NaN;
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}