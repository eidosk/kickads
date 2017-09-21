var KA = KA || {};


//GAMEPLAY
var HIT_DAMAGE = 10;
//var TEMP_CHAR_1_START_X = 300;
var TEMP_CHAR_1_START_X = 130;
var TEMP_CHAR_2_START_X = 1149;
//var TEMP_CHAR_2_START_X = 500;

//ALPHA
var HIT_AREA_ALPHA = 0;
var BULLET_ALPHA = 1;
var START_STATE = "Level";
//BOOL
var DEBUG_MODE = false;
var IS_PLAYER_A_TARGET = false;
//PIXELS
var GAME_WIDTH = 240; //320;
var GAME_HEIGHT = 135; //180; 
var WORLD_WIDTH = 1280; 
var WORLD_HEIGHT = 360;
var EMITTER_RADIUS = 100;
var TILE_WIDTH = 12;
var FLOOR_Y = WORLD_HEIGHT - 12;
//COORDS
var PLAYER_START_X = GAME_WIDTH *.5;
var PLAYER_START_Y = 30;
var PLATFORM_X = 180;
var MC_X = 110;
//TIME
//PHYSICS
var DAY_PART_DURATION = 30000; //ms
var ATTACK_SPEED = 120;
var BULLET_SPEED = 100;
var RUN_SPEED = 100;
var JUMP_SPEED = 150;
var SPEED_X = .3;
var GRAVITY = 400;
var NPC_SPEED_PERC = .2;
//OTHER
var SCALE = 4;

var TOT_DAY_PARTS = 4;
var EDGE_PADDING = 80;
var EDGE_LEFT = EDGE_PADDING;
var EDGE_RIGHT = GAME_WIDTH - EDGE_PADDING;
var CHAR_IDX = 1;
var MAX_RUN_COUNTER = 104;
var MAX_JUMP_DOWN_COUNTER = 4;
var NPC_STATE_IDLE = "idle";
var NPC_STATE_WORKING = "working";
//var TINT_SODA = 0xe73131;
var TINT_SODA = 0xEE9E94;
//var TINT_FOOD = 0x688f48;
var TINT_FOOD = 0x94CC68;
//var TINT_TECH = 0x3cfffc;
var TINT_TECH = 0xA1F1FF;
var TINT_CIGARETTES = 0xfcc1d;
/*
//BRANDS
var BRAND_SODA = "soda";
var BRAND_FOOD = "food";
var BRAND_TECH = "tech";
var BRAND_CIGARETTES = "cigarettes";
var BRANDS = [BRAND_SODA, BRAND_FOOD, BRAND_TECH, BRAND_CIGARETTES];
var BRAND = {
    SODA:"soda",
    FOOD:"soda",
    TECH:"soda",
    CIGARETTES:"cigarettes",
}
*/
var GO_TO_WORK = 0;
var GO_TO_SHOP = 1;
var GO_HOME = 2;
var WORK_X = 485;
var SHOP_X = 754;
var PART_MORNING_COMMUTE = 0;
var PART_WORKING = 1;
var PART_EVENING_COMMUTE = 2;
var PART_NIGHT = 3;