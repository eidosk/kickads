var KA = KA || {};
/*
TOT value: 765
Banner: 18
Billboards: 9
Squares: 15
Banner Value: 10
Billboards Value: 50
Squares Value: 9
*/
KA.EnemyManager = {
    init: function(tilemap, jsonInfo){
        this.tilemap = tilemap;
        this.info = jsonInfo;
        this.enemyNames = ["banner","billboard","square"]; //temp, should be dynamic
        this.balance = KA.global.balance; //temp, only one brand 
        this.totAdTypes = this.info.tilesets.length;
        this.totAdsArr = [0,0,0];
        this.resultAdsArr = [0,0,0];
        this.totValue = 0;
        this.enemies = new Array(this.totAdTypes); //will be a 2d array
        this.replaceTiles();
        this.showEnemies();
        //this.removeAllEnemiesExceptShown();
    },
    //
    areThereAdPlacesAvailable: function(){
        return this.resultAdsArr != this.totAdsArr;
    },
    canBuy: function(){
        return this.balance>0 && this.areThereAdPlacesAvailable();
    },
    countEnemies: function(){
        var count = 0;
        for(i=0; i<this.enemies.length; i++){
            for(j=0; j<this.enemies[i].length; j++){
                count++;
            }
        }
        return count;
    },
    countTiles: function(){
        var count = 0;
        for(c=0; c<this.tilemap.width; c++){
            for(r=0; r<this.tilemap.height; r++){
                var tTile = this.tilemap.getTile(c, r);
                if(tTile!=null)count++;
            }
        }
        return count;
    },
    getEnemies: function(){
        return this.enemies;
    },
    getEnemyFirstTileArray: function(id){
        //EnemyManager
        tArray = [];
        var i = 0;
        while (this.tilemap.searchTileIndex(id, i)!=null){
            var t = this.tilemap.searchTileIndex(id,i);
            tArray.push(t);
            i++;
        }
        return tArray;
    },
    removeEnemyFromArr: function(enemy){
        for(i = 0; i<this.enemies.length; i++){
            for(j=0; j<this.enemies[i].length; j++){
                var tEnemy = this.enemies[i][j];
                if(enemy == tEnemy){
                    this.enemies.splice(i, 1);
                    break;
                }   
            }
        }
    },
    removeSignals: function(){
        for(i=0; i<this.enemies.length; i++){
            for(j=0; j<this.enemies[i].length; j++){
                var tEnemy = this.enemies[i][j];
                tEnemy.removeKickSignal();
            }
        }
    },
    removeTiles: function(tiles){    
        for(var i=0; i<tiles.length; i++){
            var tile = tiles[i];
            this.tilemap.removeTile(tile.x, tile.y);
        }
    },
    replaceTiles: function(){
        for(i = 0; i < this.totAdTypes; i++){ // types of ads loop
            var tSet = this.info.tilesets[i];
            var firstTileArr = this.getEnemyFirstTileArray(tSet.firstgid);
            var count = firstTileArr.length;
            this.totAdsArr[i] = count;
            this.tilemap.addTilesetImage(tSet.name, tSet.name);
            this.enemies[i] = new Array(count);
            for(j = 0; j<count; j++){ // ads of each type loop
                var firstTile = firstTileArr[j];
                var tWidth = tSet.columns;
                var tHeight = tSet.tilecount/tSet.columns;
                var tiles = this.tilemap.copy(firstTile.x, firstTile.y, tWidth, tHeight); //get tiles*-
                this.enemies[i][j] = new KA.Enemy(KA.game, firstTile.x * TILE_WIDTH, firstTile.y * TILE_WIDTH, this.enemyNames[i]);
                this.totValue += this.enemies[i][j].value;
                this.removeTiles(tiles);
            }
        }
        KA.global.totValue = this.totValue;
    },/* Replaces Tiled Enemies with Enemy Spritesheet and removes tiles of enemies */
    showEnemies: function(){    
        var enemiesClone = ArrayUtils.clone2d(this.enemies);
        var counter = 1;
        while(true){
            counter++;
            var i = counter % 3; // 2 -> 0 -> 1 -> 2 -> 0 -> 1...etc
            if(enemiesClone[0].length==0 && enemiesClone[1].length==0 && enemiesClone[2].length==0){ //if all full
                break;
            }else if(enemiesClone[i].length==0){ //if one type full
                continue;   
            }
            var randNum = Math.floor(Math.random() * enemiesClone[i].length);
            var currEnemy = enemiesClone[i][randNum];
            if(this.balance >= currEnemy.value){
                ArrayUtils.removeItem(enemiesClone[i], randNum);
                currEnemy.init();//show enemy!!
                this.balance-=currEnemy.value;
            }else{
                if(i==1){
                    continue;
                }else{
                    break;
                }
            }
        }    
    }/* Finds how many ads are needed for each type depending on the brand balance. Inits and shows those number of ads, choosing randomly */   
}