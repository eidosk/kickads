KA.Dialogue = {
    player: null,
    npc: null,
    DEFAULT_LINE_DURATION: 2000,
    approach: function(npc){
        console.log(">>>approach");
        //vars
        this.game = KA.game;
        this.lastNode = false;
        this.player = KA.player;
        this.npc = npc;
        this.currentSpeaker = this.player;
        this.json = this.npc.dialogues;
        if(this.npc.isAware()){
            this.gotoNode("Approach");
            this.player.speak(this.currentLine);
            this.listenTo(this.player);
            this.player.disableInput();
            this.npc.getApproached();
        }else{
            //console.log("this.npc.getInfluenceLevel: " + this.npc.getInfluenceLevel);
            this.gotoNode("i"+this.npc.getInfluenceLevel(0));
            //this.gotoNode("i1");
            this.npc.speak(this.currentLine);
            this.listenTo(this.npc);
        }
    },
    askQuestion: function(txt, idx){
        this.gotoNode(this.nextNodeTitleArr[idx]);
        this.player.speak(txt);
        this.listenTo(this.player);
    },
    assignCurrentSpeaker: function(speaker){
        if(this.currentSpeaker!=null){
            this.currentSpeaker.removeSpeechBubble();
        }
        this.currentSpeaker = speaker;
    },
    end: function(){
        console.log(">>>end");
        this.player.enableInput();
        this.player.removeSpeechBubble();
        this.npc.removeSpeechBubble();
        this.npc.resumeMission();
        this.player = this.npc = null;
    },
    getNode: function(name){
        var resultArr = [];
        for(var i=0; i<this.json.length; i++){
            var tObj = this.json[i];
            if(tObj.title==name){
                resultArr.push(tObj);
            }
        }
        return resultArr[0];
    },
    getQuestions: function(){
        console.log(">>>getQuestions");
        var arr = [];
        for(var i=0; i<this.nextNodeTitleArr.length; i++){
            var tNode = this.getNode(this.nextNodeTitleArr[i]);
            var tArr = tNode.body.split("\n");
            arr.push(tArr[0]);
        }
        console.log("end loop");
        return arr;
    },
    gotoNode: function(name){
        console.log(">>>gotoNode: ");
        this.currentNode = this.getNode(name); 
        this.currentLinesArr = this.currentNode.body.split("\n");
        //find next nodes titles
        this.nextNodeTitleArr = [];
        for(var i=0; i<this.currentLinesArr.length; i++){
            var tLine = this.currentLinesArr[i];
            if(tLine.substring(0,2)=="[["){
                this.nextNodeTitleArr.push(tLine.substring(2, tLine.length-2));
                this.currentLinesArr.splice(i,1);
                i--;
            }
        }
        if(this.nextNodeTitleArr.length==0){
            this.lastNode = true;
        }
        this.currentLine = this.currentLinesArr.length == 1 ? this.currentLinesArr[0] : ArrayUtils.getRandomItem(this.currentLinesArr);
    },
    listenTo: function(speaker){
        console.log(">>>listenTo, last: " + this.lastNode);
        if(this.lastNode)this.wait(this.end);
        else this.wait(this.nextNode);
    },
    nextNode: function(){
        console.log(">>>nextNode");
        this.switchSpeaker();
        if(this.nextNodeTitleArr.length>1){
            this.thinkQuestion(this.getQuestions());
        }else{
            this.gotoNode(this.nextNodeTitleArr[0]);
            this.currentSpeaker.speak(this.currentLine, this.lastNode);
            this.listenTo(this.currentSpeaker);
        }
    },
    playerHasMultipleQuestions: function(){
        return this.currentSpeaker == this.player && this.nextNodeTitleArr.length > 1;
    },
    replyApproach: function(){
        console.log(">>>replyApproach");
        this.npc.stopWalking();
        this.npc.face(this.player.x);
        this.player.face(this.npc.x);
        this.nextNode();
    },
    switchSpeaker: function(){
        console.log(">>>switchSpeaker");
        if(this.currentSpeaker==this.player){
            this.assignCurrentSpeaker(this.npc);
        }else{
            this.assignCurrentSpeaker(this.player);
        }
    },
    thinkQuestion: function(questions){
        console.log(">>>thinkQuestion: " + questions);
        this.assignCurrentSpeaker(this.player);
        this.player.thinkLines(questions);
    },
    wait: function(callback){
        console.log(">>>wait");
        if(this.timerEvent){
            this.game.time.events.remove(this.timerEvent);
            this.timerEvent = null;
        }
        this.timerEvent = this.game.time.events.add(KA.Dialogue.DEFAULT_LINE_DURATION, callback, this);
    }
}
