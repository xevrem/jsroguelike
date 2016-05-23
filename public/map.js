Game.Map = function(tiles, player){
    this._tiles = tiles;
    this._width = tiles.length;
    this._height = tiles[0].length;

    //create array to keep track of all entities
    this._entities = [];
    //setup the game enine and scheduler
    this._scheduler = new  ROT.Scheduler.Simple();
    this._engine =  new ROT.Engine(this._scheduler);

    //add player and other entities
    this.add_entity_at_random_position(player);
    
    //add some fungi
    for(var i = 0; i < 50;i++){
        this.add_entity_at_random_position(new Game.Entity(Game.FungusTemplate));   
    }
}

Game.Map.prototype.get_width = function(){ return this._width;}
Game.Map.prototype.get_height = function(){ return this._height;}

Game.Map.prototype.get_tile = function(x, y){
    if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
        return Game.Tile.null_tile;
    } else {
        return this._tiles[x][y] || Game.Tile.null_tile;
    }
}

Game.Map.prototype.dig = function(x,y){
    if(this.get_tile(x,y).is_diggable()){
        this._tiles[x][y] = Game.Tile.floor_tile;
    }
}

Game.Map.prototype.add_entity = function(entity){
    //check bounds
    if(entity.get_x() < 0 || entity.get_x() > this._width ||
       entity.get_y() < 0 || entity.get_y() > this._height){
        throw new Error('entity location out of bounds');
    }
    //give entity reference to the map
    entity.set_map(this);
    //add entity to entity list
    this._entities.push(entity);
    //check to see if this entity has an actor mixin
    //if it does, add it to the scheduler
    if(entity.has_mixin('Actor')){
        this._scheduler.add(entity,true);
    }
}

Game.Map.prototype.add_entity_at_random_position = function(entity){
    var pos = this.get_random_floor_position();
    entity.set_x(pos.x);
    entity.set_y(pos.y);
    this.add_entity(entity);
}

Game.Map.prototype.remove_entity = function(entity){
    //find the entity and remove it from the list
    for(var i = 0; i < this._entities.length; i++){
        if(this._entities[i] == entity){
            this._entities.splice(i,1);
            break;
        }
    }
    //remove specific mixins from other areas of the game
    if(entity.has_mixin('Actor')){
        this._scheduler.remove(entity);
    }
}

Game.Map.prototype.is_empty_floor = function(x,y){
    //check if tile is a just a floor tile and no entities are there
    return (this.get_tile(x,y) == Game.Tile.floor_tile) &&
           !this.get_entity_at(x,y);
}

Game.Map.prototype.get_random_floor_position = function(){
    var x, y;
    do{
        x = Math.floor(Math.random() * this._width);
        y = Math.floor(Math.random() * this._height);
    }while(!this.is_empty_floor(x,y))
    return {x:x,y:y};
}

Game.Map.prototype.get_entities = function(){
    return this._entities;
}

Game.Map.prototype.get_engine = function(){
    return this._engine;
}

Game.Map.prototype.get_entity_at = function(x, y){
    //iterate through entity list
    //will replace this with a quadtree down the road
    for(var i = 0; i < this._entities.length; i++){
        if(this._entities[i].get_x() == x && this._entities[i].get_y() == y){
            return this._entities[i];
        }
    }

    return false;
}

Game.Map.prototype.get_entities_within_range = function(cx,cy,r){
    var results = [];
    //set bounds
    var lx = cx - r;
    var rx = cx + r;
    var ty = cy - r;
    var by = cy + r;
    //console.log(lx,rx,ty,by);
    //iterate through tentities, selecting those in bounds
    //NOTE: quadtree will make this MUCH easier in the future
    for(var i = 0; i < this._entities.length; i++){
        if(this._entities[i].get_x() >= lx &&
           this._entities[i].get_x() <= rx &&
           this._entities[i].get_y() >= ty &&
           this._entities[i].get_y() <= by){
            results.push(this._entities[i]);
        }
    }

    return results;
}












