Game.Glyph = function(properties){
    properties = properties || {};
    this._char = properties['character'] || ' ';
    this._foreground = properties['foreground'] || 'white';
    this._background = properties['background'] || 'black';
}

Game.Glyph.prototype.get_ch = function(){ return this._char; }
Game.Glyph.prototype.get_fg = function(){ return this._foreground;}
Game.Glyph.prototype.get_bg = function(){ return this._background;}

