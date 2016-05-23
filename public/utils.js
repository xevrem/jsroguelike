function format(text, args){
	if(!args){
		return text;
	}
	
	for(var i = 0; i < args.length; i++){
		text = text.replace('{'+i+'}', args[i]);
	}
	
	return text;
}

function get_neighbor_postions(x,y){
	var tiles = [];
	for(var dx = -1; dx < 2; dx++){
		for(var dy = -1; dy < 2; dy++){
			tiles.push({x:x+dx, y:y+dy});
		}
	}
	
	return tiles.randomize();
}