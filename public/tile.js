/* global Game */

Game.Tile = function(properties){
    properties = properties || {};
    
    Game.Glyph.call(this, properties);
    
    this._is_walkable = properties['is_walkable'] || false;
    this._is_diggable = properties['is_diggable'] || false;
}

Game.Tile.extend(Game.Glyph);

Game.Tile.prototype.get_glyph = function(){return this._glyph;}

Game.Tile.prototype.is_walkable = function(){return this._is_walkable;}
Game.Tile.prototype.is_diggable = function(){return this._is_diggable;}

Game.Tile.null_tile = new Game.Tile({});
Game.Tile.floor_tile = new Game.Tile({character:'.',
                                    foreground:'rgb(210,210,180)',
                                    background:'rgb(64,64,64)',
                                    is_walkable:true});
Game.Tile.wall_tile = new Game.Tile({character:'#', 
                                    foreground:'rgb(148,84,20)',
                                    background:'rgb(128,64,0)',
                                    //background:'rgb(64,64,64)',
                                    is_diggable:true});
Game.Tile.player_tile = new Game.Tile({character:'@',
                                    foreground:'rgb(255,255,255)',
                                    background:'rgb(0,0,0)'});
Game.Tile.stairs_up = new Game.Tile({character: '<',
                                     foreground:'rgb(200,200,0)',
                                     background:'rgb(64,64,64)'});
Game.Tile.stairs_down = new Game.Tile({character: '>',
                                     foreground:'rgb(200,200,0)',
                                     background:'rgb(64,64,64)'});