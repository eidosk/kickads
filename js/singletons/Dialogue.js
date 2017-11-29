KA.Dialogue = {
    speaking: false,
    player: null,
    npc: null,
    questionIdx: null,
    APPROACH: "approach",
    REPLY_APPROACH: "replyApproach",
    THINK_QUESTION: "thinkQuestion",
    ASK_QUESTION: "askQuestion",
    ANSWER: "answer",
    FAREWELL: "farewell",
    DEFAULT_LINE_DURATION: 2000,
    approach: function(npc){
        this.state = this.APPROACH;
        this.speaking = true;
        this.player = KA.player;
        this.npc = npc;
        this.player.dialoguePartner = this.npc;
        this.npc.dialoguePartner = this.player;
        this.player.approach(this.npc);
        this.npc.getApproached();
    },
    replyApproach: function(){
        this.state = this.REPLY_APPROACH;
        this.npc.stopWalking();
        this.npc.face(this.player.x);
        this.player.face(this.npc.x);
        var replyArray = KA.global.dialogues.npc.replyApproach;
        this.npc.speak(ArrayUtils.getRandomItem(replyArray));
    },
    thinkQuestion: function(){
        this.state = this.THINK_QUESTION;
        this.player.thinkLines(KA.global.dialogues.player.questions);
    },
    askQuestion: function(txt, idx){
        this.state = this.ASK_QUESTION;
        this.player.speak(txt);
        this.questionIdx = idx;
    },
    answerQuestion: function(){
        this.state = this.ANSWER;
        var answers = KA.global.dialogues.npc.answers;
        this.npc.speak(answers[this.questionIdx]);
    },
    farewell: function(){
        this.state = this.FAREWELL;
        var farewells = KA.global.dialogues.player.farewells;
        this.player.speak(ArrayUtils.getRandomItem(farewells), true);
    },
    end: function(){
        this.speaking = false;
        this.player.enableInput();
        this.player.removeSpeechBubble();
        this.npc.removeSpeechBubble();
        this.npc.resumeMission();
        this.player.dialoguePartner = this.npc.dialoguePartner = null;
        this.player = this.npc = null;
    }
}
// approach > reply approach > question > answer > bye

//LISTEN
KA.Player.prototype.listen = function(msg){
    var npcDialogues = KA.global.dialogues.npc;
    if(KA.Dialogue.state == KA.Dialogue.REPLY_APPROACH){
        this.game.time.events.add(KA.Dialogue.DEFAULT_LINE_DURATION, KA.Dialogue.thinkQuestion, KA.Dialogue);   
    }else if(KA.Dialogue.state == KA.Dialogue.ANSWER){
        this.game.time.events.add(KA.Dialogue.DEFAULT_LINE_DURATION, KA.Dialogue.farewell, KA.Dialogue);  
    }
}


KA.Player.prototype.thinkLines = function(lines){
    KA.global.assignCurrentSpeaker(this);
    this.removeSpeechBubble();
    this.speechBubble = new KA.SpeechChoiceBubble(this.game, lines, this.speechBubbleY);
    this.addChild(this.speechBubble);
}


KA.NPC.prototype.listen = function(msg){
    if(KA.Dialogue.state == KA.Dialogue.ASK_QUESTION){
        this.game.time.events.add(KA.Dialogue.DEFAULT_LINE_DURATION, KA.Dialogue.answerQuestion, KA.Dialogue);  
    }
}
//APPROACH
KA.Player.prototype.approach = function(npc){
    var approachArray = KA.global.dialogues.player.approach;
    this.speak(ArrayUtils.getRandomItem(approachArray));
    this.disableInput();
}

KA.NPC.prototype.getApproached = function(){
    this.distancing = true;
    this.immune = true;
    this.awarenessBar.visible = this.influenceBar.visible = false;
}

KA.Player.prototype.assignSpeechChoiceKeys = function(){
    var scope = this;
    this.game.input.keyboard.onDownCallback = function(){
        if(this.game.input.keyboard.event.keyCode==Phaser.Keyboard.LEFT){
            scope.speechBubble.prevLine();
        }else if(this.game.input.keyboard.event.keyCode==Phaser.Keyboard.RIGHT){
            scope.speechBubble.nextLine();
        }else if(this.game.input.keyboard.event.keyCode==Phaser.Keyboard.X){
            this.game.input.keyboard.onDownCallback = null;
            KA.Dialogue.askQuestion(scope.speechBubble.getCurrentLineText(), scope.speechBubble.getCurrentLine());
        }
    }
}

//SPEAK
KA.Character.prototype.speak = function(msg, last){
    if (typeof(last)==='undefined') last = false;
    KA.global.assignCurrentSpeaker(this);
    if(this.timerEvent){
        this.game.time.events.remove(this.timerEvent);
        this.timerEvent = null;
    } //
    this.removeSpeechBubble();
    this.speechBubble = new KA.SpeechBubble(this.game, msg, this, this.speechBubbleY);
    this.addChild(this.speechBubble);
    if(this.dialoguePartner!=null)this.dialoguePartner.listen(msg);
    //if(last)this.timerEvent = this.game.time.events.add(3000, this.removeSpeechBubble, this);
    if(last)this.timerEvent = this.game.time.events.add(KA.Dialogue.DEFAULT_LINE_DURATION, KA.Dialogue.end, KA.Dialogue);
}
