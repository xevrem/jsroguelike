Game.Mixins = {}


/****MIXINS****/

Game.Mixins.Moveable = {
    name: 'Moveable',
    try_move: function(x,y,map){
        //get that tile!
        var tile = map.get_tile(x,y);
        var target = map.get_entity_at(x,y);

        //see if tile is walkable
        if(target){
            //if we can attack, try to attack
            if(this.has_mixin('Attacker')){
                this.attack(target);
                return true;
            }else{
                return false;
            }
        }else if(tile.is_walkable()){
            this._x = x;
            this._y = y;
            return true;
        }else if(tile.is_diggable()){
            map.dig(x,y);
            Game.send_message(this,'you dig through the wall!', 'rgb(184,128,64)');
            return true;
        }
        return false;
    }
}

Game.Mixins.Destructable = {
    name:'Destructable',
    init: function(template){
        //set max hp
        this._max_hp = template['max_hp'] || 10;
        //set current hp, allowing different hp amounts at initialization
        this._hp = template['hp'] || this._max_hp;
        //set defense
        this._defense_value = template['defense_value'] || 0;
    },
    get_hp: function(){
        return this._hp;
    },
    get_max_hp: function(){
        return this._max_hp;
    },
    get_defense_value: function(){
        return this._defense_value;
    },
    take_damage: function(attacker, damage){
        this._hp -= damage;
        //if this has 0 or less hp, remove ourselves from the game world
        if(this._hp <= 0){
            Game.send_message(attacker, format('you kill a {0}!', [this.get_name()]),'red');
            Game.send_message(this, 'you died!!!', 'black', 'red');
            this.get_map().remove_entity(this);
        }
    }
}

Game.Mixins.Attacker = {
    name:'Attacker',
    group_name:'Attacker',
    init: function(template){
        //set attack value
        this._attack_value = template['attack_value'] || 1;
    },
    get_attack_value: function(){
        return this._attack_value;
    },
    attack: function(target){
        //only attack if they are destructable
        if(target.has_mixin('Destructable')){
            var attack = this.get_attack_value();
            var defense = target.get_defense_value();
            var max = Math.max(0, attack - defense);
            var dmg = 1 + Math.floor(Math.random() * max);
            
            //sens messages
            Game.send_message(this, format('you strike a {0} for {1} damage!',[target.get_name(),dmg]),'orange')
            Game.send_message(target, format('a {0} attacks you for {1} damage!',[this.get_name(), dmg]), 'orange')

            target.take_damage(this, dmg);
        }
    }
}

//used to send messages to a specific recipient
Game.Mixins.MessageRecipient = {
    name:'MessageRecipient',
    init: function(template){
        this._messages = [];
    },
    receive_message:function(message){
        this._messages.push(message);
    },
    get_messages:function(){
        return this._messages;
    },  
    clear_messages: function(){
        this._messages = [];
    }
}


/****ACTORS****/

Game.Mixins.PlayerActor = {
    name: 'PlayerActor',
    group_name: 'Actor',
    act: function(){
        //issue a redraw
        Game.refresh();
        
        //lock engine and await player to perform input
        this.get_map().get_engine().lock();

        //clear all the messages
        this.clear_messages();
    }
}

Game.Mixins.FungusActor = {
    name:'FungusActor',
    group_name: 'Actor',
    init: function(){
        this._growths_remaining = 5;
    },
    act: function(){
        //try to grow
        if(this._growths_remaining > 0){
            if(Math.random() <= 0.02){
                //choose a point around us randomly
                var x_off = Math.floor(Math.random()*3) - 1;
                var y_off = Math.floor(Math.random()*3) - 1;
                //dont select ourselves
                if(x_off != 0 || y_off != 0){
                    if(this.get_map().is_empty_floor(this.get_x() + x_off,
                                                     this.get_y() + y_off)){
                        var entity = new Game.Entity(Game.FungusTemplate);
                        entity.set_x(this.get_x() + x_off);
                        entity.set_y(this.get_y() + y_off);
                        this.get_map().add_entity(entity);
                        this._growths_remaining--;

                        //alert those nearby to the spreading fungus!!!
                        Game.send_message_nearby(this.get_map(),
                                                 this.get_x(),
                                                 this.get_y(),
                                                 'the fungus spreads!',
                                                 'rgb(0,250,0)',
                                                 'rgb(0,64,0)');
                    }
                }
            }
        }
    }
}

/****TEMPLATES****/

Game.PlayerTemplate = {
    character: '@',
    foreground: 'white',
    background: 'black',
    max_hp: 40,
    attack_value: 10,
    mixins: [Game.Mixins.Moveable, Game.Mixins.PlayerActor,
             Game.Mixins.Attacker, Game.Mixins.Destructable,
             Game.Mixins.MessageRecipient]
}

Game.FungusTemplate = {
    name: 'fungus',
    character: 'F',
    foreground: 'rgb(0,255,0)',
    background: 'rgb(0,64,0)',
    max_hp: 10,
    mixins: [Game.Mixins.FungusActor, Game.Mixins.Destructable]
}

