/* global Game */
/* global ROT */
/*
 * Builder manages the generation of maps
 * args:{ width, height, depth, generator, floor_tile, wall_tile}
*/
Game.Builder = function(args){
	this._width = args.width;
	this._height = args.height;
	this._depth = args.depth;
	this._tiles = new Array(args.depth);
	this._regions = new Array(args.depth);

	//make the arrays multi-dimensional
	for(var z = 0; z < args.depth; z++){
		this._tiles[z] = this._generate_level(args.generator,
											  args.floor_tile,
											  args.wall_tile);
		this._regions = new Array(args.width);

		//
		for(var x = 0; z < args.width; x++){
			this._regions[z][x] = new Array(args.height);
			//fill with zeros
			for(var y = 0; y < args.height; y++){
				this._regions[z][x][y] = 0;
			}
		}
	}
}

Game.Builder.prototype._generate_level = function(generator, tile_floor, tile_wall){
	var map = new Array(this._width);

	for(var i = 0; i< map.length; i++){
		map[i] = new Array(this._height);
	}

	generator.init({width:this._width, height:this._height});

	generator.create(function(x,y,v){
		if(v===1){
			map[x][y] = tile_floor;
		} else{
			map[x][y] = tile_wall;
		}
	});

	return map;
}

Game.Builder.prototype._can_fill_region = function(x, y, z){
	//ignore tiles outside of bounds
	if(x < 0 || y < 0 || z < 0 || x >= this._width ||
	   y >= this._height || z >= this._depth){
		return false;
	}

	//ignore if it already has a region
	if(this._tiles[z][x][y] != 0){
		return false;
	}

	//ensure the tile is walkable then return
	return this._tiles[z][x][y].is_walkable();
}

Game.Builder.prototype._fill_region = function(region, x, y, z){
	var tiles_filled = 1;
	var tiles = [{x:x, y:y}];
	var tile;
	var neighbors;

	//set region of origininating tile
	this._regions[z][x][y] = region;

	//while there are still tiles letft to process, keep going
	while(tiles.length > 0){
		tile = tiles.pop();
		//find neighbors of the tile
		neighbors = Game.get_neighbor_positions(tile.x,tile.y);
		//iterate through each neighbor checking to see it is a valid fill region
		while(neighbors.length > 0){
			tile = neighbors.pop();
			if(this._can_fill_region(tile.x, tile.y, z)){
				this._regions[z][tile.x][tile.y] = region;
				tiles.push(tile);
				tiles_filled++;
			}
		}
	}

	return tiles_filled;
}

Game.Builder.prototype._remove_region = function(region, z, fill_tile){
	for(var x = 0; x < this._width; x++){
		for(var y = 0; y < this._height; y++){
			if(this._regions[z][x][y] == region){
				this._regions[z][x][y] = 0;
				this._tiles[z][x][y] = fill_tile;
			}
		}
	}
}

Game.Builder.prototype._setup_regions = function(z, fill_tile){
	var region = 1;
	var tiles_filled;

	for(var x = 0; x < this._width; x++){
		for(var y = 0; y < this._height; y++){
		}
		if(this._can_fill_region(x,y,z)){
			//try to fill
			tiles_filled = this._fill_region(region, x, y ,z);
			if(tiles_filled <= 20){
				this._remove_region(region, z, fill_tile);
			}else{
				region++;
			}
		}
	}
}

//finds regions that overlap between regions (top to bottom)
/*Game.Builder.prototype._find_region_overlaps = function(z, r1, r2){
	return;
}

Game.Generator.Cellular = function(args){
	this._gen = null;
	this._rand = 0.5;
	this._iterations = 3;
}

Game.Generator.Cellular._init = function(args){
		this._gen = new ROT.Map.Cellular(args);//{width:args.width, height:args.height})
		this._gen.randomize(this._rand);
}

Game.Generator.Cellular._create = function(callback){
		for(var i = 0; i< this._iterations-1;i++){
			this._gen.create();
		}
		this._gen.create(callback);
}*/
