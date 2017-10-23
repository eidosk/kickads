KA.WellDone = {
    preload: function(){
        this.game.load.bitmapFont('myfont', 'fonts/font.png', 'fonts/font.fnt');
    },
    create: function(){
        this.bmpText = this.game.add.bitmapText(10, 10, 'myfont','Well Done!', 16);
        this.game.time.events.add(1000, pressAnyKey, this);
    }
};