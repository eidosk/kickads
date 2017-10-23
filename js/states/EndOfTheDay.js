KA.EndOfTheDay = {
    preload: function preload(){
        this.game.load.bitmapFont('myfont', 'fonts/font.png', 'fonts/font.fnt');
        this.game.load.spritesheet("newspaper_anim", "images/newspaper_anim.png", 240, 135, 9);
        this.game.load.image("newspaper", "images/newspaper.png");
    }, 
    create: function create(){
        this.newspaper_anim = this.game.add.sprite(0,0, "newspaper_anim");
        this.anim = this.newspaper_anim.animations.add("main", [0,1,2,3,4,5,6,7,8], 12, false);
        this.anim.onComplete.add(this.animationComplete, this);
        this.newspaper_anim.play("main");
        //this.game.time.events.add(1000, pressAnyKey, this);
    },
    animationComplete: function(sprite, animation) {
        var txt = "";
        if(KA.global.profit>0){
            txt = "Soda sales are rising!";
        }else{
            txt = "Not many sodas sold today!";
        }
        updateBalance();
        this.newspaper_anim.destroy();
        this.game.add.sprite(0,0, "newspaper");
        this.bmpText = this.game.add.bitmapText(24, 40, 'myfont',txt, 16);
        this.bmpText.tint = 0x223344;
        onKeyDown();
    }
}