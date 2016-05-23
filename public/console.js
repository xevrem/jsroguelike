/* global Game */
Game.Console = function(display, size){
	this._buffer = [];
	this._buffer_size = size || 5;
	this._console_display = display;
	this._cursor = 0;
}

Game.Console.prototype.init = function(){
	for(var i = 0; i < this._buffer_size;i++){
		this._buffer.push(new Game.Message());
	}
}

Game.Console.prototype.render = function(){
	for(var i = 0; i < this._buffer_size; i++){
		var index = (this._cursor + i) % this._buffer_size;
		this.draw_text(0,i,
					   this._buffer[index].get_text(),
					   this._buffer[index].get_fg(),
					   this._buffer[index].get_bg());
	}
}

Game.Console.prototype.draw_text = function(x,y, text,foreground,background){
    var fg = foreground || 'white';
    var bg = background || 'black';
    this._console_display.drawText(x,y,'%c{'+fg+'}%b{'+bg+'}'+text);
}

Game.Console.prototype.add_message = function(message){	
	this._buffer[this._cursor%this._buffer_size] = message; 
	this._cursor += 1;
}

Game.Console.prototype.clear = function(){
	for(var i = 0; i < this._buffer.length; i++){
		this._buffer[i] = new Game.Message();
	}
	this._cursor = 0;
}


Game.Message = function(text, foreground, background){
	this._text = text || '';
	this._foreground = foreground || 'white';
	this._background = background || 'black';
	Game.get_console().add_message(this);
}

Game.Message.prototype.get_text = function(){
	return this._text;
}

Game.Message.prototype.get_fg = function(){
	return this._foreground;
}

Game.Message.prototype.get_bg = function(){
	return this._background;
}
