/* global Game */
Game.Entity = function(properties){
    properties = properties || {};
    Game.Glyph.call(this,properties);
    //entity specific properties
    this._name = properties['name'] || '';
    this._x = properties['x'] || 0;
    this._y = properties['y'] || 0;
    this._map = null;
    
    //setup something to keep track of the mixins
    this._attached_mixins = {};
    //setup attached groups
    this._attached_mixin_groups = {};
    
    //setup all the mixins!
    var mixins = properties['mixins'] || []
    for(var i = 0; i < mixins.length; i++){
        // Copy over all properties from each mixin as long
        // as it's not the name or the init property. We
        // also make sure not to override a property that
        // already exists on the entity.
        for(var key in mixins[i]){
            if(key != 'init' && key != 'name' && !this.hasOwnProperty(key)){
                this[key] = mixins[i][key];
            }
        }
        //add to the attached list
        this._attached_mixins[mixins[i].name] = true;
        //if it has a group name attach it
        if(mixins[i].group_name){
            this._attached_mixin_groups[mixins[i].group_name] = true;
        }
        //call the init funciton if it exists
        if(mixins[i].init){
            mixins[i].init.call(this, properties);
        }
    }
}

Game.Entity.extend(Game.Glyph);

Game.Entity.prototype.has_mixin = function(obj){
    if(typeof obj === 'object'){
        return this._attached_mixins[obj.name];
    }else{
        return this._attached_mixins[obj] || this._attached_mixin_groups[obj];
    }
    
}

Game.Entity.prototype.set_name = function(name){
    this._name = name;
}

Game.Entity.prototype.set_x = function(x){
    this._x = x;
}

Game.Entity.prototype.set_y = function(y){
    this._y = y;
}

Game.Entity.prototype.get_name = function(){
    return this._name;
}

Game.Entity.prototype.get_x = function(){
    return this._x;
}

Game.Entity.prototype.get_y = function(){
    return this._y;
}

Game.Entity.prototype.set_map = function(map){
    this._map = map;
}

Game.Entity.prototype.get_map = function(){
    return this._map;
}